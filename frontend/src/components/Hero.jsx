import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroImage from './HeroImage';

const SLIDES = [
  {
    id: 'tiramisu',
    eyebrow: 'OUR SIGNATURE DESSERT · TIRAMISU',
    title: (
      <>
        Make room for
        <br />
        something sweet.
      </>
    ),
    body: 'Meet our signature tiramisu, specialty coffee and comforting café favourites — made for slow moments in DHA Phase 8.',
    primary: { href: '#menu', label: 'Explore the menu ↓' },
    secondary: { to: '/tiramisu', label: 'Discover Tiramisu' },
    meta: 'DAILY · 9 AM–2 AM · DHA PHASE 8, KARACHI',
    image: {
      src: '/images/tiramisu.png',
      alt: 'Amoons signature tiramisu on a ceramic plate',
      label: 'THE AMOONS SIGNATURE · TIRAMISU',
      objectPosition: '50% 46%',
    },
  },
  {
    id: 'coffee',
    eyebrow: 'SPECIALTY COFFEE · DHA PHASE 8',
    title: (
      <>
        Good coffee.
        <br />
        Great company.
      </>
    ),
    body: 'From flat whites to pour-overs — crafted for quiet mornings, late nights, and every pause in between.',
    primary: { href: '#menu', label: 'Order from the menu ↓' },
    secondary: { to: '/visit', label: 'Plan your visit' },
    meta: 'DAILY · 9 AM–2 AM · PICK-UP AVAILABLE',
    image: {
      src: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80',
      alt: 'Amoons specialty coffee in a ceramic cup',
      label: 'HOUSE COFFEE · FLAT WHITE',
      objectPosition: '50% 40%',
    },
  },
];

function HeroSlide({ slide }) {
  return (
    <section className="page-pad-x w-full pt-8 pb-12 sm:pt-10 sm:pb-14 lg:pt-6 lg:pb-8">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-4 xl:gap-6">
        <div className="hero-copy mx-auto text-center lg:mx-0 lg:text-left">
          <div className="hero-eyebrow justify-center lg:justify-start">
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            <p className="hero-eyebrow-text">{slide.eyebrow}</p>
          </div>

          <h1 className="hero-heading mx-auto lg:mx-0">{slide.title}</h1>

          <p className="hero-body mx-auto lg:mx-0">{slide.body}</p>

          <div className="hero-actions justify-center lg:justify-start">
            <a href={slide.primary.href} className="hero-btn hero-btn-primary">
              {slide.primary.label}
            </a>
            <Link to={slide.secondary.to} className="hero-btn hero-btn-secondary">
              {slide.secondary.label}
            </Link>
          </div>

          <p className="hero-meta">{slide.meta}</p>
        </div>

        <div className="flex items-center justify-center pb-2 lg:justify-end lg:pb-0">
          <HeroImage {...slide.image} />
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((index) => (index + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="amoons-hero bg-[var(--color-bg)]">
      <div className="hero-rotator" aria-live="polite">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-rotator-slide ${
              index === active ? 'is-active' : ''
            }`}
            aria-hidden={index !== active}
          >
            <HeroSlide slide={slide} />
          </div>
        ))}
      </div>

      <div className="hero-rotator-dots" role="tablist" aria-label="Hero slides">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Show slide ${index + 1}`}
            className={`hero-rotator-dot ${index === active ? 'is-active' : ''}`}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </main>
  );
}

export default Hero;
