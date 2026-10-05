import Link from 'next/link';

export const metadata = {
  title: 'PolÃ­tica de Privacidad | Vascoco',
  description: 'PolÃ­tica de privacidad de Vascoco. InformaciÃ³n sobre cÃ³mo recopilamos y usamos tus datos.',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[var(--color-green-950)] text-[var(--color-ivory-200)]">
      <nav className="glass py-4 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo.jpg" alt="Vascoco" className="h-8 w-auto rounded-full" />
            <span className="text-xl font-heading font-bold text-gold-gradient">VASCOCO</span>
          </Link>
          <Link href="/" className="text-[var(--color-ivory-300)] opacity-80 hover:text-white transition-colors text-sm">â† Volver</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12 text-[var(--color-ivory-200)] space-y-8">
        <div>
          <span className="text-accent-400 text-sm font-semibold tracking-widest uppercase">Legal</span>
          <h1 className="text-4xl font-heading font-bold text-white mt-2">PolÃ­tica de Privacidad</h1>
          <p className="text-[var(--color-ivory-300)] opacity-80 mt-2 text-sm">Ãšltima actualizaciÃ³n: septiembre de 2026</p>
        </div>

        <div className="space-y-6 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Â¿QuiÃ©nes somos?</h2>
            <p className="text-[var(--color-ivory-200)] opacity-90">Vascoco es una barberÃ­a ubicada en San Juan 127, JunÃ­n de los Andes, NeuquÃ©n, Argentina. Esta polÃ­tica explica cÃ³mo recopilamos, usamos y protegemos tu informaciÃ³n personal cuando utilizÃ¡s nuestro sitio web.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. InformaciÃ³n que recopilamos</h2>
            <p className="text-[var(--color-ivory-200)] opacity-90">Cuando iniciÃ¡s sesiÃ³n con tu cuenta de Google, recopilamos:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--color-ivory-300)] opacity-80">
              <li>Nombre y apellido de tu cuenta de Google</li>
              <li>DirecciÃ³n de correo electrÃ³nico</li>
              <li>Foto de perfil de Google</li>
            </ul>
            <p className="mt-3">Cuando reservÃ¡s un turno (con o sin cuenta), recopilamos:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--color-ivory-300)] opacity-80">
              <li>Nombre y apellido</li>
              <li>NÃºmero de telÃ©fono de contacto</li>
              <li>Fecha, hora y servicio solicitado</li>
            </ul>
            <p className="mt-3">Cuando dejÃ¡s una reseÃ±a, recopilamos:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--color-ivory-300)] opacity-80">
              <li>El texto de tu reseÃ±a y calificaciÃ³n</li>
              <li>Tu nombre y foto de perfil (obtenidos de Google)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Â¿Para quÃ© usamos tu informaciÃ³n?</h2>
            <ul className="list-disc list-inside space-y-1 text-[var(--color-ivory-300)] opacity-80">
              <li>Gestionar y confirmar tus reservas de turnos</li>
              <li>Contactarte ante cambios en tu turno</li>
              <li>Llevar un historial de visitas para el programa de fidelidad</li>
              <li>Mostrar tus reseÃ±as pÃºblicas en el sitio web</li>
              <li>Mejorar nuestros servicios</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Â¿Compartimos tu informaciÃ³n?</h2>
            <p className="text-[var(--color-ivory-200)] opacity-90">No vendemos, alquilamos ni compartimos tu informaciÃ³n personal con terceros con fines comerciales. Tu informaciÃ³n es utilizada exclusivamente por el equipo de Vascoco para gestionar los servicios descritos en esta polÃ­tica.</p>
            <p className="mt-2">Utilizamos los siguientes servicios de terceros que pueden procesar tu informaciÃ³n:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--color-ivory-300)] opacity-80">
              <li><strong className="text-white">Google OAuth</strong>: para la autenticaciÃ³n con cuenta de Google</li>
              <li><strong className="text-white">Vercel</strong>: para el alojamiento del sitio web</li>
              <li><strong className="text-white">Neon PostgreSQL</strong>: para el almacenamiento seguro de datos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. RetenciÃ³n de datos</h2>
            <p className="text-[var(--color-ivory-200)] opacity-90">Conservamos tu informaciÃ³n mientras tengas una cuenta activa en nuestro sitio o mientras sea necesario para prestarte los servicios. PodÃ©s solicitar la eliminaciÃ³n de tus datos en cualquier momento contactÃ¡ndonos.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Tus derechos</h2>
            <p className="text-[var(--color-ivory-200)] opacity-90">TenÃ©s derecho a:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--color-ivory-300)] opacity-80">
              <li>Acceder a los datos personales que tenemos sobre vos</li>
              <li>Solicitar la correcciÃ³n de datos incorrectos</li>
              <li>Solicitar la eliminaciÃ³n de tu cuenta y tus datos</li>
              <li>Retirar tu consentimiento en cualquier momento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Seguridad</h2>
            <p className="text-[var(--color-ivory-200)] opacity-90">Implementamos medidas de seguridad tÃ©cnicas apropiadas para proteger tu informaciÃ³n personal contra accesos no autorizados, alteraciÃ³n, divulgaciÃ³n o destrucciÃ³n.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contacto</h2>
            <p className="text-[var(--color-ivory-200)] opacity-90">Si tenÃ©s preguntas sobre esta polÃ­tica o querÃ©s ejercer tus derechos, podÃ©s contactarnos a travÃ©s de nuestro Instagram: <a href="https://www.instagram.com/vascoco" className="text-accent-400 hover:underline">@vascoco.be</a></p>
          </section>
        </div>

        <div className="pt-6 border-t border-[var(--color-border-subtle)] flex gap-6 text-sm">
          <Link href="/terminos" className="text-accent-400 hover:underline">TÃ©rminos y Condiciones</Link>
          <Link href="/" className="text-[var(--color-ivory-300)] opacity-80 hover:text-white">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
