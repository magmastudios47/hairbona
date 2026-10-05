import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.scheduleRule.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.barber.deleteMany();
  await prisma.siteConfig.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('vascoco2026', 10);
  await prisma.adminUser.create({
    data: {
      username: 'vascoco',
      password: hashedPassword,
    },
  });
  console.log('âœ… Admin user created (vascoco / vascoco2026)');

  // Create SiteConfig
  await prisma.siteConfig.createMany({
    data: [
      { key: 'heroImage', value: '/images/hero_background.jpg' },
      { key: 'whatsappNumber', value: '+5491100000000' }
    ]
  });
  console.log('âœ… Site config created');

  // Create Barbers
  const barbers = [
    { name: 'Lucas', description: 'Especialista en cortes modernos y fades.', photo: '/images/barber_1.jpg', whatsapp: '+5491111111111', order: 1 },
    { name: 'MartÃ­n', description: 'Maestro del estilo clÃ¡sico y perfilado de barba.', photo: '/images/barber_2.jpg', whatsapp: '+5491122222222', order: 2 },
    { name: 'Nico', description: 'Estilo urbano, quiffs y atenciÃ³n al detalle.', photo: '/images/barber_3.jpg', whatsapp: '+5491133333333', order: 3 },
  ];

  for (const barber of barbers) {
    await prisma.barber.create({ data: barber });
  }
  console.log('âœ… Barbers created');

  // Create Gallery Images
  const galleryImages = [
    { url: '/images/gallery_1.jpg', caption: 'Skin Fade ClÃ¡sico', order: 1 },
    { url: '/images/gallery_2.jpg', caption: 'Perfilado de Barba', order: 2 },
    { url: '/images/gallery_3.jpg', caption: 'Corte Moderno Texturizado', order: 3 },
    { url: '/images/gallery_4.jpg', caption: 'Slick Back Elegante', order: 4 },
  ];

  for (const img of galleryImages) {
    await prisma.galleryImage.create({ data: img });
  }
  console.log('âœ… Gallery images created');

  // Create services
  const services = [
    { name: 'Corte de Pelo', description: 'Corte clÃ¡sico o moderno a tu estilo', duration: 30, price: 5000, order: 1 },
    { name: 'Perfilado de Cejas', description: 'Perfilado y definiciÃ³n de cejas', duration: 15, price: 2000, order: 2 },
    { name: 'Corte + Barba', description: 'Combo completo: corte de pelo y arreglo de barba', duration: 45, price: 7500, order: 3 },
    { name: 'Barba', description: 'Recorte y perfilado de barba profesional', duration: 20, price: 3500, order: 4 },
    { name: 'Shaving Tradicional', description: 'Afeitado clÃ¡sico con navaja y toalla caliente', duration: 30, price: 4000, order: 5 },
    { name: 'Color', description: 'ColoraciÃ³n y mechas profesionales', duration: 60, price: 8000, order: 6 },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }
  console.log('âœ… Services created');

  // Create schedule rules (Mon-Sat, 9-13 and 15-20)
  // 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
  for (let day = 1; day <= 6; day++) {
    await prisma.scheduleRule.create({
      data: {
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '13:00',
        isBlock: false,
        label: 'MaÃ±ana',
      },
    });
    await prisma.scheduleRule.create({
      data: {
        dayOfWeek: day,
        startTime: '15:00',
        endTime: '20:00',
        isBlock: false,
        label: 'Tarde',
      },
    });
  }
  console.log('âœ… Schedule rules created (Mon-Sat, 9-13 & 15-20)');

  console.log('\nðŸŽ‰ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

