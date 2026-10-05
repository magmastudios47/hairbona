'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const tabs = [
    { name: 'Turnos', path: '/admin' },
    { name: 'Barberos', path: '/admin/barberos' },
    { name: 'Servicios', path: '/admin/servicios' },
    { name: 'Productos', path: '/admin/productos' },
    { name: 'Ganancias', path: '/admin/ganancias' },
    { name: 'Egresos', path: '/admin/egresos' },
    { name: 'Galería', path: '/admin/galeria' },
    { name: 'Reseñas', path: '/admin/resenas' },
    { name: 'Config', path: '/admin/configuracion' },
  ];

  return (
    <div className="admin-theme min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-main)] flex flex-col selection:bg-accent-400 selection:text-green-900">
      <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xl font-heading font-bold heading-solid">VASCOCO</span>
            <span className="text-[var(--color-text-muted)] text-sm hidden sm:inline">Panel Admin</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6">
            {tabs.map(tab => (
              <Link
                key={tab.path}
                href={tab.path}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === tab.path ? 'bg-accent-400/10 text-accent-400' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                }`}
              >
                {tab.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors text-sm flex items-center gap-1.5 ml-2"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
