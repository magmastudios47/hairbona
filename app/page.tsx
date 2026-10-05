'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import WelcomeModal from '@/components/WelcomeModal';

interface Service {
  id: string;
  name: string;
  description: string;
  image: string | null;
  duration: number;
  price: number | null;
}

interface Barber {
  id: string;
  name: string;
  description: string;
  photo: string | null;
  whatsapp: string | null;
}

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
}

interface Review {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  userId: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  stock: number;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const INSTAGRAM_URL = 'https://www.instagram.com/vascoco.be';
export default function HomePage() {
  const { data: session } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Review form state
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const nocache = `?t=${Date.now()}`;
    Promise.all([
      fetch(`/api/services${nocache}`).then(r => r.json()),
      fetch(`/api/barbers${nocache}`).then(r => r.json()),
      fetch(`/api/gallery${nocache}`).then(r => r.json()),
      fetch(`/api/config${nocache}`).then(r => r.json()),
      fetch(`/api/reviews${nocache}`).then(r => r.json()),
      fetch(`/api/products${nocache}`).then(r => r.json()),
    ]).then(([servicesData, barbersData, galleryData, configData, reviewsData, productsData]) => {
      setServices(servicesData);
      setBarbers(barbersData);
      setGallery(galleryData);
      setConfig(configData);
      setReviews(reviewsData);
      setProducts(productsData);
    }).catch(console.error);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const checkoutMessage = `¡Hola Vascoco! Quiero encargar los siguientes productos:\n\n${cart
    .map((item) => `- ${item.quantity}x ${item.product.name} ($${item.product.price * item.quantity})`)
    .join('\n')}\n\nTotal: $${cartTotal}`;

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return alert('Debes iniciar sesión para reseñar');
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, text: reviewText }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setReviewText('');
        setReviewRating(5);
        alert('¡Reseña publicada con éxito!');
      } else {
        const err = await res.json();
        alert(err.error || 'Error al enviar la reseña');
      }
    } catch {
      alert('Error al enviar la reseña');
    }
    setSubmittingReview(false);
  };

  const deleteReview = async (id: string) => {
    if (!confirm('¿Seguro que deseas borrar tu reseña?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
      } else {
        alert('Error al borrar la reseña');
      }
    } catch {
      alert('Error al borrar la reseña');
    }
  };

  const heroSubtitle = config.heroSubtitle || "Tradición, estilo y excelencia para el hombre moderno.";
  const fiveStarReviews = Array.isArray(reviews) ? reviews.filter((r) => r.rating === 5) : [];

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-main)] font-body selection:bg-green-900 selection:text-[var(--color-ivory-200)]">
      <WelcomeModal />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--color-surface)] shadow-sm border-b border-[var(--color-border-subtle)] py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center group">
            <img src="/images/logo.jpg" alt="Vascoco Logo" className="h-16 w-16 object-cover rounded-full shadow-md transition-all group-hover:-translate-y-1 group-hover:shadow-lg" />
          </a>

          {/* Desktop nav */}
          <div className={`hidden md:flex items-center gap-6 font-bold text-sm uppercase tracking-wider transition-colors ${scrolled ? 'text-[var(--color-text-main)]' : 'text-[var(--color-ivory-200)]'}`}>
            <a href="#servicios" className={`${scrolled ? 'hover:text-accent-600' : 'hover:text-accent-400'} transition-colors`}>Servicios</a>
            {products.length > 0 && <a href="#productos" className={`${scrolled ? 'hover:text-accent-600' : 'hover:text-accent-400'} transition-colors`}>Productos</a>}
            <a href="#nosotros" className={`${scrolled ? 'hover:text-accent-600' : 'hover:text-accent-400'} transition-colors`}>Nosotros</a>
            <a href="#galeria" className={`${scrolled ? 'hover:text-accent-600' : 'hover:text-accent-400'} transition-colors`}>Galería</a>
            <a href="#resenas" className={`${scrolled ? 'hover:text-accent-600' : 'hover:text-accent-400'} transition-colors`}>Reseñas</a>
            <Link href="/reservar" className="btn-cta px-6 py-2 ml-4">
              Reservar
            </Link>
            {session ? (
              <Link href="/perfil" className="ml-2 block">
                {session.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || ''} className="w-10 h-10 rounded-full " />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-900 text-[var(--color-ivory-200)] flex items-center justify-center font-bold">
                    {session.user?.name?.[0] || '?'}
                  </div>
                )}
              </Link>
            ) : (
              <button onClick={() => signIn('google')} className={`ml-2 font-bold uppercase ${scrolled ? 'hover:text-accent-600' : 'hover:text-accent-400'} transition-colors`}>
                Entrar
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-2 transition-colors ${scrolled ? 'text-[var(--color-text-main)]' : 'text-[var(--color-ivory-200)]'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-4 py-4 flex flex-col gap-4 font-bold uppercase text-sm">
            <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
            {products.length > 0 && <a href="#productos" onClick={() => setMenuOpen(false)}>Productos</a>}
            <a href="#nosotros" onClick={() => setMenuOpen(false)}>Nosotros</a>
            <a href="#galeria" onClick={() => setMenuOpen(false)}>Galería</a>
            <a href="#resenas" onClick={() => setMenuOpen(false)}>Reseñas</a>
            <Link href="/reservar" onClick={() => setMenuOpen(false)} className="btn-cta px-4 py-3 mt-2 text-center">
              Reservar Turno
            </Link>
            {!session ? (
              <button onClick={() => { signIn('google'); setMenuOpen(false); }} className="text-left mt-2">
                Entrar con Google
              </button>
            ) : (
              <Link href="/perfil" onClick={() => setMenuOpen(false)} className="text-left mt-2 text-accent-400 hover:text-accent-300">
                Mi Perfil
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section (Dynamic & Premium) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-green-950)]">
        {/* Background Image with Parallax-like slow zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
            alt="Barbería Premium" 
            className="w-full h-full object-cover opacity-60 animate-slow-zoom"
          />
          {/* Rich Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-green-950)] via-[var(--color-green-900)]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[var(--color-surface)]"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start pt-20">
          
          <div className="max-w-2xl text-left stagger-children">
            {/* Main Title */}
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-heading font-bold text-[var(--color-ivory-200)] leading-[0.85] mb-6 uppercase tracking-tighter drop-shadow-2xl">
              Vas<span className="text-accent-400">co</span>co
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-[var(--color-ivory-300)] mb-10 leading-relaxed opacity-90">
              {heroSubtitle}
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/reservar" className="btn-cta px-10 py-4 text-lg w-full sm:w-auto text-center hover:scale-105 shadow-[0_0_40px_rgba(198,166,100,0.3)]">
                Reservar Turno
              </Link>
              <a href="#servicios" className="px-10 py-4 text-lg w-full sm:w-auto text-center text-[var(--color-ivory-200)] border border-[var(--color-border-dark)] rounded-lg hover:bg-[var(--color-ivory-200)]/10 transition-colors uppercase font-bold tracking-wider backdrop-blur-sm">
                Descubrir Más
              </a>
            </div>
            
            {/* Trust Badge (Glassmorphism) — only shown with real 5-star reviews */}
            {fiveStarReviews.length > 0 && (
              <a
                href="#resenas"
                id="hero-reviews-badge"
                className="mt-16 inline-flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-accent-400/50 hover:bg-white/10 cursor-pointer group"
              >
                <div className="flex -space-x-3">
                  {fiveStarReviews.slice(0, 3).map((review) =>
                    review.user?.image ? (
                      <img
                        key={review.id}
                        className="w-10 h-10 rounded-full border-2 border-[var(--color-green-900)] object-cover"
                        src={review.user.image}
                        alt={review.user?.name || 'Cliente'}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div
                        key={review.id}
                        className="w-10 h-10 rounded-full border-2 border-[var(--color-green-900)] bg-[var(--color-green-800,#1d3d31)] text-[var(--color-ivory-200)] flex items-center justify-center font-bold text-sm"
                      >
                        {(review.user?.name || 'C')[0].toUpperCase()}
                      </div>
                    )
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-[var(--color-ivory-200)] mt-1 uppercase tracking-wider">
                    {fiveStarReviews.length === 1 ? '1 reseña de 5 estrellas' : `${fiveStarReviews.length} reseñas de 5 estrellas`}
                  </p>
                </div>
                <svg className="w-4 h-4 text-accent-400 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
            )}
          </div>
        </div>

      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-[var(--color-surface)]  relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-heading font-bold uppercase tracking-tighter text-[var(--color-green-900)]">Servicios</h2>
            <div className="w-24 h-2 bg-accent-400 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {services.map((service) => (
              <Link key={service.id} href={`/reservar?service=${service.id}`} className="solid-card block p-6 sm:p-8 relative group cursor-pointer bg-[var(--color-surface)]">
                <div className="flex items-start gap-4">
                  <img src={service.image || '/icons/corte.jpg'} alt={service.name} className="w-16 h-16 object-cover rounded-none  grayscale group-hover:grayscale-0 transition-all" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold uppercase tracking-wide text-[var(--color-text-main)] group-hover:text-accent-600 transition-colors">{service.name}</h3>
                    <p className="text-[var(--color-text-muted)] mt-2 text-sm font-medium">{service.duration} min</p>
                  </div>
                  <div className="text-xl font-black text-[var(--color-text-main)]">
                    ${service.price}
                  </div>
                </div>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-bold text-accent-600 uppercase text-sm border-b-2 border-accent-600 pb-1">Reservar →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      {products.length > 0 && (
        <section id="productos" className="py-20 bg-green-900 text-[var(--color-ivory-200)] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-6xl font-heading font-bold uppercase tracking-tighter text-[var(--color-ivory-200)]">Tienda</h2>
              <div className="w-24 h-2 bg-accent-400 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="solid-card bg-[var(--color-surface)] text-[var(--color-text-main)] flex flex-col relative group hover:-translate-y-2 transition-transform">
                  {product.stock <= 0 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase z-20">Agotado</div>
                  )}
                  <div className="aspect-square bg-[var(--color-surface)] p-4 border-b border-[var(--color-border-subtle)] relative rounded-t-xl overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className={`w-full h-full object-contain ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-[var(--color-text-muted)]">SIN IMAGEN</div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-black text-lg uppercase leading-tight mb-2">{product.name}</h3>
                    <p className="text-[var(--color-text-muted)] text-sm font-medium mb-4 flex-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-black text-accent-600">${product.price}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="btn-solid px-4 py-2 text-xs"
                      >
                        {product.stock > 0 ? 'Comprar' : 'Sin Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Barbers Section */}
      <section id="nosotros" className="py-20 bg-[var(--color-surface)] ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-heading font-bold uppercase tracking-tighter text-[var(--color-green-900)]">El Equipo</h2>
            <div className="w-24 h-2 bg-accent-400 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {barbers.map((barber) => (
              <div key={barber.id} className="solid-card bg-[var(--color-surface)] group hover:-translate-y-2">
                <div className="aspect-square border-b border-[var(--color-border-subtle)] overflow-hidden relative rounded-t-xl">
                  <img src={barber.photo || 'https://i.pravatar.cc/400'} alt={barber.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-green-900/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-black uppercase tracking-wide text-[var(--color-text-main)]">{barber.name}</h3>
                  <p className="text-accent-600 font-bold text-sm uppercase mt-1">Barbero Profesional</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section id="galeria" className="py-20 bg-green-900 border-b-4 border-accent-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-6xl font-heading font-bold uppercase tracking-tighter text-[var(--color-ivory-200)]">Galería</h2>
              <div className="w-24 h-2 bg-accent-400 mx-auto mt-6"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((img) => (
                <div key={img.id} onClick={() => setLightboxImg(img.url)} className="gallery-solid aspect-square hover:border-accent-400 transition-colors cursor-pointer relative overflow-hidden group">
                  <img src={img.url} alt="Galería" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all group-hover:scale-110" />
                </div>
              ))}
            </div>

            {lightboxImg && (
              <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
                <img src={lightboxImg} className="max-w-full max-h-full object-contain" />
                <button className="absolute top-4 right-4 text-white p-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section id="resenas" className="py-20 bg-[var(--color-surface)] ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-heading font-bold uppercase tracking-tighter text-[var(--color-green-900)]">Reseñas</h2>
            <div className="w-24 h-2 bg-accent-400 mx-auto mt-6"></div>
          </div>

          <div className="space-y-6 mb-16">
            {reviews.map((review) => (
              <div key={review.id} className="solid-card bg-[var(--color-surface)] p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {review.user?.image ? (
                      <img src={review.user?.image} alt={(review.user?.name || "Usuario")} className="w-12 h-12 rounded-full " />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-900 text-[var(--color-ivory-200)] flex items-center justify-center font-bold">
                        {(review.user?.name || "Usuario")[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-black uppercase text-[var(--color-text-main)]">{(review.user?.name || "Usuario")}</h4>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-accent-500' : 'text-green-900/20'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[var(--color-text-muted)]">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-[var(--color-text-main)] font-medium italic">"{review.text}"</p>
                {((session?.user as any)?.id === review.userId) && (
                  <button onClick={() => deleteReview(review.id)} className="absolute bottom-4 right-4 text-[var(--color-text-muted)] hover:text-red-500 transition-colors p-2" title="Eliminar reseña">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-center text-[var(--color-text-muted)] font-bold uppercase py-8 border-2 border-dashed border-green-900">
                Aún no hay reseñas. ¡Sé el primero!
              </div>
            )}
          </div>

          {session ? (
            <div className="solid-card bg-[var(--color-surface)] p-8">
              <h3 className="text-2xl font-black uppercase text-[var(--color-green-900)] mb-6">Dejanos tu opinión</h3>
              <form onSubmit={submitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase text-green-900 mb-2">Calificación</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)} className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-colors ${reviewRating >= star ? 'border-accent-500 text-accent-500 bg-[var(--color-surface)]' : 'border-[var(--color-border-subtle)] text-green-900/30 hover:border-accent-500 hover:text-accent-500'}`}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase text-green-900 mb-2">Comentario</label>
                  <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required rows={4} className="w-full bg-[var(--color-surface)] rounded-xl border border-[var(--color-border-subtle)] p-4 text-[var(--color-text-main)] focus:border-accent-500 outline-none resize-none font-medium"></textarea>
                </div>
                <button type="submit" disabled={submittingReview} className="btn-solid w-full py-4 text-lg">
                  {submittingReview ? 'Enviando...' : 'Publicar Reseña'}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center">
              <button onClick={() => signIn('google')} className="btn-solid px-8 py-3">
                Iniciá sesión para dejar una reseña
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Cart Sidebar */}
      {cartOpen && (
        <>
          <div className="fixed inset-0 bg-green-950/80 z-50 transition-opacity" onClick={() => setCartOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[var(--color-surface)] border-l-4 border-green-900 shadow-2xl z-50 flex flex-col">
            <div className="p-6 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-surface)]">
              <h2 className="text-2xl font-black uppercase text-[var(--color-green-900)]">Tu Carrito</h2>
              <button onClick={() => setCartOpen(false)} className="text-green-900 hover:text-red-600 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-[var(--color-text-muted)] font-bold uppercase mt-10">El carrito está vacío</div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 bg-[var(--color-surface)]  p-4">
                    <img src={item.product.image || ''} alt={item.product.name} className="w-20 h-20 object-contain bg-[var(--color-surface)]  p-1" />
                    <div className="flex-1">
                      <h4 className="font-black uppercase text-[var(--color-text-main)] leading-tight">{item.product.name}</h4>
                      <p className="text-accent-600 font-bold mt-1">${item.product.price}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center  bg-[var(--color-surface)]">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="px-2 py-1 text-green-900 hover:bg-green-900 hover:text-[var(--color-ivory-200)] font-bold">-</button>
                          <span className="px-3 font-bold text-[var(--color-text-main)] border-x-2 border-green-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="px-2 py-1 text-green-900 hover:bg-green-900 hover:text-[var(--color-ivory-200)] font-bold">+</button>
                        </div>
                        <button onClick={() => updateQuantity(item.product.id, -item.quantity)} className="text-red-600 font-bold uppercase text-xs hover:underline">
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t-2 border-green-900 bg-[var(--color-surface)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold uppercase text-green-900">Total</span>
                  <span className="text-3xl font-black text-[var(--color-text-main)]">${cartTotal}</span>
                </div>
                <Link href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(checkoutMessage)}`} target="_blank" className="btn-solid w-full py-4 text-center text-lg shadow-lg">
                  Pedir por WhatsApp
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* Cart Floating Button */}
      {cart.length > 0 && (
        <button 
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 btn-solid w-16 h-16 rounded-full shadow-md flex items-center justify-center z-40"
        >
          <div className="relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-ivory-200">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
        </button>
      )}

      {/* Ubicación y Contacto Section */}
      <section className="py-24 bg-[var(--color-bg-main)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent-400 font-bold uppercase tracking-[0.2em] text-sm">Visitanos</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--color-green-900)] mt-2 uppercase tracking-tight">
              Ubicación y Contacto
            </h2>
            <div className="w-24 h-1 bg-accent-400 mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[var(--color-green-950)] rounded-3xl p-8 sm:p-12 shadow-2xl border border-[var(--color-border-subtle)] relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            {/* Col 1: Info */}
            <div className="space-y-8 relative z-10">
              <div>
                <h3 className="text-3xl font-heading font-bold text-[var(--color-ivory-200)] mb-5">Vascoco Barbería</h3>
                <div className="flex items-start gap-4 text-[var(--color-ivory-300)] opacity-90">
                  <svg className="w-6 h-6 text-accent-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <p className="text-lg leading-relaxed">
                    San Juan 127<br />
                    Junín de los Andes, Neuquén<br />
                    Argentina
                  </p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-[var(--color-ivory-200)]/10">
                <h4 className="text-sm font-bold uppercase tracking-widest text-accent-400 mb-5">Horarios de Atención</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/5 transition-colors hover:bg-white/10">
                    <span className="font-medium text-[var(--color-ivory-200)]">Martes a Sábado</span>
                    <span className="text-[var(--color-ivory-300)] font-bold text-right text-sm sm:text-base">10:00 - 13:00 <br className="sm:hidden"/> <span className="hidden sm:inline px-2">|</span> 16:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/5 transition-colors hover:bg-white/10">
                    <span className="font-medium text-[var(--color-ivory-200)]">Domingo y Lunes</span>
                    <span className="text-accent-400 font-bold uppercase text-sm tracking-widest">Cerrado</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent('San Juan 127, Junín de los Andes, Neuquén')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-3 w-full sm:w-auto btn-solid px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-[0_8px_30px_rgba(198,166,100,0.3)] hover:-translate-y-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  Cómo llegar
                </a>
              </div>
            </div>
            
            {/* Col 2: Map */}
            <div className="h-[400px] lg:h-full min-h-[400px] w-full relative rounded-2xl overflow-hidden border border-[var(--color-ivory-200)]/10 shadow-2xl group z-10 bg-[var(--color-surface)]">
              <iframe 
                src="https://maps.google.com/maps?q=San%20Juan%20127,%20Jun%C3%ADn%20de%20los%20Andes,%20Neuqu%C3%A9n&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[30%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-[var(--color-ivory-200)] py-12 border-t-8 border-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold uppercase tracking-widest text-[var(--color-ivory-200)] mb-6">Vascoco</h2>
          <p className="text-accent-400 font-bold uppercase tracking-widest text-sm mb-8">{heroSubtitle}</p>
          
          <div className="flex justify-center gap-6 mb-8">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--color-ivory-300)] hover:text-accent-400 transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.169a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
            </a>
          </div>
          <p className="text-[var(--color-ivory-300)] opacity-60 font-bold uppercase text-xs tracking-widest mb-4">&copy; {new Date().getFullYear()} Vascoco. Todos los derechos reservados.</p>
          <div className="flex items-center justify-center gap-4 text-xs font-medium text-[var(--color-ivory-300)] opacity-60 mb-6">
            <a href="/terminos" className="hover:text-accent-400 underline">Términos y Condiciones</a>
            <span>|</span>
            <a href="/privacidad" className="hover:text-accent-400 underline">Política de Privacidad</a>
          </div>
          <a href="https://magmastudios.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-xs font-bold text-accent-400/70 hover:text-accent-400 transition-colors uppercase tracking-widest">
            Powered by Magma Studios
          </a>
        </div>
      </footer>
    </div>
  );
}

