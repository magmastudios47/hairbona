import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { sendNotificationEmail, sendCustomerEmail } from '@/lib/email';
import { bookingConfirmationEmail, cancellationEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, date, startTime, serviceId, barberId } = body;

    if (!customerName || !customerPhone || !date || !startTime || !serviceId || !barberId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get service to calculate end time
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Calculate end time
    const [startH, startM] = startTime.split(':').map(Number);
    const endMinutes = startH * 60 + startM + service.duration;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    // Check for existing pending appointment for this user
    const existingPending = await prisma.appointment.findFirst({
      where: {
        OR: [
          ...(customerEmail ? [{ customerEmail }] : []),
          { customerPhone }
        ],
        status: 'confirmed',
      }
    });

    if (existingPending) {
      const [y, m, d] = existingPending.date.split('-');
      return NextResponse.json(
        { error: `Ya tenés un turno pendiente para el ${d}/${m}/${y} a las ${existingPending.startTime} hs. No podés tener más de un turno activo.` },
        { status: 409 }
      );
    }

    // Check for conflicts one more time for this specific barber
    const conflict = await prisma.appointment.findFirst({
      where: {
        date: date,
        barberId: barberId,
        status: { not: 'cancelled' },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: 'Este horario ya no está disponible con este barbero. Por favor elegí otro.' },
        { status: 409 }
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        date,
        startTime,
        endTime,
        serviceId,
        barberId,
        price: service.price, // Guardar precio histórico
        status: 'confirmed',
      },
      include: {
        service: true,
        barber: true,
      },
    });

    // Notify barber/owner
    const [y, m, d] = date.split('-');
    const emailSubject = `💈 Nuevo Turno: ${customerName}`;
    const emailBody = `
      <h2>¡Nuevo turno reservado!</h2>
      <p><strong>Cliente:</strong> ${customerName}</p>
      <p><strong>Teléfono:</strong> ${customerPhone}</p>
      <p><strong>Fecha:</strong> ${d}/${m}/${y}</p>
      <p><strong>Hora:</strong> ${startTime} hs</p>
      <p><strong>Servicio:</strong> ${appointment.service.name}</p>
      <p><strong>Barbero:</strong> ${appointment.barber.name}</p>
    `;
    // Branded confirmation email for the customer
    let customerEmailPromise: Promise<unknown> = Promise.resolve();
    if (customerEmail) {
      const addressConfig = await prisma.siteConfig.findUnique({ where: { key: 'address' } }).catch(() => null);
      const { subject, html } = bookingConfirmationEmail({
        appointmentId: appointment.id,
        customerName,
        date,
        startTime,
        endTime,
        serviceName: appointment.service.name,
        duration: appointment.service.duration,
        price: appointment.price ?? appointment.service.price ?? null,
        barberName: appointment.barber.name,
        barberPhoto: appointment.barber.photo,
        address: addressConfig?.value,
      });
      customerEmailPromise = sendCustomerEmail(customerEmail, subject, html);
    }

    // We await these to avoid Vercel killing the process before the emails are sent
    await Promise.all([sendNotificationEmail(emailSubject, emailBody), customerEmailPromise]);

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Error creating appointment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, action } = await request.json();
    if (!id || action !== 'cancel') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
      include: { service: true, barber: true }
    });

    const emailData = {
      appointmentId: appointment.id,
      customerName: appointment.customerName,
      customerPhone: appointment.customerPhone,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      serviceName: appointment.service.name,
      duration: appointment.service.duration,
      price: appointment.price,
      barberName: appointment.barber.name,
      barberPhoto: appointment.barber.photo,
    } as any;

    const { subject: ownerSubj, html: ownerHtml } = cancellationEmail(emailData, true);
    
    let customerPromise: Promise<unknown> = Promise.resolve();
    if (appointment.customerEmail) {
      const { subject: custSubj, html: custHtml } = cancellationEmail(emailData, false);
      customerPromise = sendCustomerEmail(appointment.customerEmail, custSubj, custHtml);
    }

    await Promise.all([
      sendNotificationEmail(ownerSubj, ownerHtml),
      customerPromise
    ]);

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error canceling appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
