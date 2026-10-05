const fs = require('fs');

let txt = fs.readFileSync('app/perfil/page.tsx', 'utf8');

// 1. Fix progress bar
txt = txt.replace(/from-gold-600 to-gold-400/g, 'from-accent-600 to-accent-400');

// 2. Unify appointments
const startPending = txt.indexOf('{/* Pending Appointments */}');
const endHistory = txt.lastIndexOf('</div>\n      </div>\n    </div>\n  );\n}');

if (startPending !== -1 && endHistory !== -1) {
  const newAppointmentsBlock = `{/* Appointments List */}
        <div className="solid-card rounded-lg overflow-hidden animate-fade-in-up">
          <div className="px-6 py-4 border-b border-[var(--color-border-subtle)] bg-accent-400/5">
            <h2 className="text-lg font-heading font-semibold text-[var(--color-text-main)]">Tus Turnos</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-[var(--color-ivory-300)] opacity-80">Cargando...</div>
          ) : profileData?.appointments?.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-ivory-300)] opacity-80">
              <p>Aún no tenés turnos registrados.</p>
              <Link href="/reservar" className="text-accent-600 font-medium hover:underline mt-2 inline-block">Reservar un turno →</Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {(profileData?.appointments || []).map(appt => (
                <div key={appt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-[var(--color-bg-main)] transition-colors">
                  <div className="flex-1">
                    <p className="text-[var(--color-text-main)] font-medium text-lg">{appt.service.name}</p>
                    <p className="text-[var(--color-ivory-300)] opacity-80 text-sm">{formatDate(appt.date)} a las {appt.startTime} hs</p>
                    <p className="text-[var(--color-ivory-300)] opacity-80 text-sm">Con {appt.barber.name}</p>
                  </div>
                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className={\`text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider \${
                      appt.status === 'confirmed' ? 'bg-accent-400/20 text-accent-400 border border-accent-400/30' :
                      appt.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/30' :
                      appt.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                      'bg-[var(--color-border-subtle)] text-[var(--color-text-main)]'
                    }\`}>
                      {appt.status === 'confirmed' ? 'Pendiente' : appt.status === 'completed' ? 'Completado' : appt.status === 'cancelled' ? 'Cancelado' : appt.status}
                    </span>
                    {appt.status === 'confirmed' && (
                      <button onClick={() => handleCancelAppointment(appt.id)}
                        className="text-red-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-wider border border-red-500/30 rounded-lg px-3 py-1.5 hover:bg-red-500/10">
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
`;
  txt = txt.substring(0, startPending) + newAppointmentsBlock + txt.substring(endHistory);
} else {
  console.log("Could not find startPending or endHistory", startPending, endHistory);
}

// 3. Remove definitions
txt = txt.replace(/const pendingAppointments = profileData\?\.appointments\?\.filter\(a => a\.status === 'confirmed'\) \|\| \[\];/g, '');
txt = txt.replace(/const pastAppointments = profileData\?\.appointments\?\.filter\(a => a\.status !== 'confirmed'\) \|\| \[\];/g, '');

fs.writeFileSync('app/perfil/page.tsx', txt, 'utf8');
console.log('Fixed perfil layout');
