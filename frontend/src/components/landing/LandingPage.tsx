import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Menu, X, Instagram, Twitter, Linkedin } from 'lucide-react';
import { LapyaLogo } from '../LapyaLogo';
import Container from '../layout/Container';

interface LandingPageProps {
  onGetStarted?: () => void;
  onSubmitWaitlist?: (email: string, role: string) => void | Promise<void>;
  isSubmitting?: boolean;
}

export const LandingPage = ({ onGetStarted, onSubmitWaitlist, isSubmitting }: LandingPageProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistRole, setWaitlistRole] = useState('dietitian');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    if (onSubmitWaitlist) {
      void Promise.resolve(onSubmitWaitlist(waitlistEmail, waitlistRole)).then(() =>
        setWaitlistSubmitted(true),
      );
    } else {
      setWaitlistSubmitted(true);
    }
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#FBFAF7' }}>
      {/* NAVIGATION */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: '#FBFAF7',
          boxShadow: scrolled ? '0 2px 12px rgba(30, 42, 94, 0.08)' : 'none'
        }}
      >
        <Container maxWidth="landing">
          <div className="flex items-center justify-between h-20">
            {/* Logo - icon only, no text */}
            <div style={{ width: '36px', height: '36px', overflow: 'hidden', flexShrink: 0 }}>
              <LapyaLogo size={36} />
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'Why Lapya', id: 'why-lapya' },
                { label: 'How it works', id: 'product' },
                { label: 'Pricing', id: 'pricing' },
                { label: 'For dietitians', id: 'dietitians' },
                { label: 'Stories', id: 'stories' },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: '#1E2A5E',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: '#1E2A5E',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sign in
              </button>
              <button
                onClick={onGetStarted}
                className="px-5 py-2.5 rounded-full transition-all"
                style={{
                  backgroundColor: '#3D6BE5',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Get started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E2A5E' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </Container>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 top-20 z-40"
            style={{ backgroundColor: '#1E2A5E' }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
              {[
                { label: 'Why Lapya', id: 'why-lapya' },
                { label: 'How it works', id: 'product' },
                { label: 'Pricing', id: 'pricing' },
                { label: 'For dietitians', id: 'dietitians' },
                { label: 'Stories', id: 'stories' },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#F4D27A',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={onGetStarted}
                className="mt-8 px-8 py-4 rounded-full"
                style={{
                  backgroundColor: '#3D6BE5',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 lg:pb-32" style={{ backgroundColor: '#FBFAF7' }}>
        <Container maxWidth="landing">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Editorial Typography (7 cols) */}
            <div className="lg:col-span-7">
              <h1 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                fontWeight: 600,
                color: '#1E2A5E',
                lineHeight: 1.1,
                marginBottom: '1.25rem'
              }}>
                Food that understands{' '}
                <span style={{ color: '#E8A92E', fontStyle: 'italic' }}>your health.</span>
              </h1>

              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.125rem',
                color: '#5E6680',
                lineHeight: 1.65,
                maxWidth: '500px',
                marginBottom: '1rem'
              }}>
                Personalized nutrition for people managing multiple health conditions, using foods already found in African kitchens.
              </p>

              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#A8BCF0',
                marginBottom: '2rem'
              }}>
                No grams. No imported meal plans. No conflicting advice.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={onGetStarted}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full transition-all"
                  style={{
                    backgroundColor: '#3D6BE5',
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Start your meal plan, free
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Right: Editorial Photo (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <img
                  src="https://images.unsplash.com/photo-1636302926027-9619142d7173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0JTIwbmF0dXJhbCUyMGxpZ2h0fGVufDF8fHx8MTc3OTM2NTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="African woman portrait natural light"
                  className="w-full h-full object-cover"
                />

                {/* Caption overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{
                    background: 'linear-gradient(to top, rgba(30, 42, 94, 0.8), transparent)'
                  }}
                >
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8125rem',
                    color: '#F4D27A',
                    letterSpacing: '0.05em'
                  }}>
                    01 / Mama Nkechi, 52. Diabetic and hypertensive. She uses Lapya.
                  </p>
                </div>

                {/* Floating badge */}
                <div
                  className="absolute top-6 right-6 px-4 py-2 rounded-full flex items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(168, 188, 240, 0.95)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <span style={{ color: '#E8A92E', fontSize: '0.75rem' }}>★</span>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#1E2A5E'
                  }}>
                    Technovation 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* WHY LAPYA - NAVY SECTION */}
      <section id="why-lapya" className="py-20 md:py-32" style={{ backgroundColor: '#1E2A5E' }}>
        <Container maxWidth="landing">
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#F4D27A',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '3rem'
          }}>
            WHY LAPYA?
          </p>

          {/* Pull Quote */}
          <div className="mb-16 max-w-5xl">
            <div className="mb-4">
              <span style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '4rem',
                color: '#E8A92E',
                lineHeight: 1
              }}>"</span>
            </div>
            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(2rem, 4vw, 4rem)',
              fontWeight: 600,
              color: '#F4D27A',
              lineHeight: 1.3,
              marginBottom: '1.5rem'
            }}>
              The doctor said brown rice. My pastor said no carbs. The WhatsApp aunty said only beans. I just want to know what to cook for dinner."
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: '#A8BCF0'
            }}>
              Aisha, 47, Type 2 diabetes + hypertension. Interview, Nigeria, April 2026.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">
            {/* Stat 1 */}
            <div className="md:col-span-7">
              <p style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(4rem, 8vw, 6rem)',
                fontWeight: 600,
                color: '#F4D27A',
                lineHeight: 1,
                marginBottom: '1rem'
              }}>
                27M
              </p>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#A8BCF0',
                marginBottom: '0.75rem'
              }}>
                Nigerians live with diabetes, hypertension, or CKD
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#A8BCF0',
                lineHeight: 1.6,
                marginBottom: '1rem'
              }}>
                And 38% of them have at least two of these conditions at once, creating conflicting diet rules.
              </p>
              <a href="#" style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#E8A92E',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
                textDecoration: 'none'
              }}>
                PMC 2023 →
              </a>
            </div>

            {/* Stat 2 */}
            <div className="md:col-span-5">
              <p style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                fontWeight: 600,
                color: '#F4D27A',
                lineHeight: 1,
                marginBottom: '1rem'
              }}>
                1,175
              </p>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#A8BCF0',
                marginBottom: '0.75rem'
              }}>
                Registered dietitians for a country of 230 million
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#A8BCF0',
                lineHeight: 1.6,
                marginBottom: '1rem'
              }}>
                That's 0.5 per 100,000 people. The WHO recommends 6.
              </p>
              <a href="#" style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#E8A92E',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
                textDecoration: 'none'
              }}>
                ICDA 2024 →
              </a>
            </div>

            {/* Stat 3 - redesigned as inline editorial card */}
            <div className="md:col-span-12">
              <div
                className="flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-2xl"
                style={{
                  backgroundColor: 'rgba(232, 169, 46, 0.08)',
                  border: '1px solid rgba(232, 169, 46, 0.4)'
                }}
              >
                <div className="flex-shrink-0">
                  <p style={{
                    fontFamily: 'Fraunces, serif',
                    fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
                    fontWeight: 600,
                    color: '#F4D27A',
                    lineHeight: 1
                  }}>
                    0
                  </p>
                </div>
                <div
                  className="hidden md:block w-px self-stretch"
                  style={{ backgroundColor: 'rgba(232, 169, 46, 0.3)' }}
                />
                <div>
                  <h3 style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#F4D27A',
                    marginBottom: '0.5rem'
                  }}>
                    Therapeutic nutrition built for African kitchens
                  </h3>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9375rem',
                    color: '#A8BCF0',
                    lineHeight: 1.6
                  }}>
                    Most diet apps were never designed for people balancing multiple conditions, local foods, and everyday life. Lapya is.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Thin Marigold Rule */}
      <div style={{ height: '1px', backgroundColor: '#E8A92E' }} />

      {/* HOW IT WORKS - WARM WHITE SECTION */}
      <section id="product" className="py-20 md:py-32" style={{ backgroundColor: '#FBFAF7' }}>
        <Container maxWidth="landing">
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#3D6BE5',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            marginBottom: '2rem'
          }}>
            HOW IT WORKS
          </p>

          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2rem, 4vw, 4rem)',
            fontWeight: 600,
            color: '#1E2A5E',
            maxWidth: '720px',
            marginBottom: '0.75rem'
          }}>
            One plan for your everyday health.
          </h2>

          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.0625rem',
            color: '#5E6680',
            maxWidth: '560px',
            lineHeight: 1.65,
            marginBottom: '5rem'
          }}>
            AI-powered nutrition support tailored to your conditions, your meals, and your routines.
          </p>

          {/* Feature 1 - Image LEFT, Text RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1733491762566-701553a88e7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdvbWFuJTIwaGVhbHRoeSUyMGFmcmljYW4lMjBmb29kJTIwa2l0Y2hlbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzc5MzY1ODUyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Happy woman in kitchen with healthy food"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#3D6BE5',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                marginBottom: '1rem'
              }}>
                FEATURE 01
              </p>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1.5rem'
              }}>
                Your week, planned around your health.
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                color: '#5E6680',
                lineHeight: 1.7,
                maxWidth: '440px',
                marginBottom: '1.5rem'
              }}>
                Lapya creates a 7-day meal plan built around your full health picture: diabetes, blood pressure, kidney health, and more, using foods already familiar in your kitchen. Egusi. Jollof. Brown rice. Plantain. Simple portions. Familiar meals. No complicated measurements.
              </p>
              <a href="#" style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: '#3D6BE5',
                textDecoration: 'none'
              }}>
                See how the AI handles multiple conditions →
              </a>
            </div>
          </div>

          {/* Feature 2 - Text LEFT, Image RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
            <div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#3D6BE5',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                marginBottom: '1rem'
              }}>
                FEATURE 02
              </p>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1.5rem'
              }}>
                Ask anything about Nigerian foods.
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                color: '#5E6680',
                lineHeight: 1.7,
                maxWidth: '440px',
                marginBottom: '1.5rem'
              }}>
                Our AI Nutrition Chatbot knows Nigerian foods inside out. Ask about egusi, jollof, or plantain portions and get answers tailored to your conditions. Built on African data.
              </p>
              <a href="#" style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: '#3D6BE5',
                textDecoration: 'none'
              }}>
                Try the AI chatbot →
              </a>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1758522488003-f48d8b40ea82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMHRlY2hub2xvZ3klMjBudXRyaXRpb24lMjBmb29kJTIwaGVhbHRoeSUyMGRpZ2l0YWx8ZW58MXx8fHwxNzc5MzY1ODUyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="AI nutrition technology"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          {/* Feature 3 - Image LEFT, Text RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1572851569977-e18b9ea6edbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFya2V0JTIwc2hvcHBpbmclMjB2ZWdldGFibGVzJTIwY2FyZWdpdmVyfGVufDF8fHx8MTc3OTM2NTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="African market vegetables shopping"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#3D6BE5',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                marginBottom: '1rem'
              }}>
                FEATURE 03
              </p>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1.5rem'
              }}>
                The person who cooks for you always knows what to make.
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                color: '#5E6680',
                lineHeight: 1.7,
                maxWidth: '440px',
                marginBottom: '1.5rem'
              }}>
                Add the caregiver who shops at the market or cooks in your kitchen. They see the exact meal plan, the grocery list, and what to prepare each day. No guessing, no phone calls back and forth.
              </p>
              <a href="#" style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: '#3D6BE5',
                textDecoration: 'none'
              }}>
                Set up your care circle →
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* A REAL STORY - FULL BLEED PHOTO */}
      <section id="stories" className="relative h-screen min-h-[600px]">
        <img
          src="https://images.unsplash.com/photo-1628191012047-e789922abfdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwbW90aGVyJTIwZGF1Z2h0ZXIlMjBjb29raW5nJTIwdG9nZXRoZXIlMjBraXRjaGVufGVufDF8fHx8MTc3OTI3NzY4N3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Mother and daughter cooking together"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(30, 42, 94, 0.9) 0%, rgba(30, 42, 94, 0.4) 50%, transparent 100%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 pb-16 md:pb-24">
          <Container maxWidth="landing">
            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
              fontWeight: 600,
              color: '#F4D27A',
              lineHeight: 1.3,
              maxWidth: '720px',
              marginBottom: '1.5rem'
            }}>
              "I was always thinking about what to cook next. I couldn't focus on school. Since I discovered Lapya, I spend less time worrying about meals and more time focusing on school."
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: '#A8BCF0',
              marginBottom: '1rem'
            }}>
              Ibrahim, 20, a university student and caregiver to his grandmother, who lives with diabetes and hypertension.
            </p>
          </Container>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 md:py-32" style={{ backgroundColor: '#FBFAF7' }}>
        <Container maxWidth="landing">
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(1.75rem, 3vw, 3rem)',
            fontWeight: 600,
            color: '#1E2A5E',
            maxWidth: '600px',
            marginBottom: '1rem'
          }}>
            Pricing
          </h2>

          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            color: '#5E6680',
            maxWidth: '560px',
            marginBottom: '4rem'
          }}>
            Lapya is free to try. The Care plan is ₦1,500 a month, designed to give you full weekly meal planning, caregiver support, and daily clarity around what to cook.
          </p>

          {/* Pricing Cards - 2 plans only, centered */}
          <div className="flex flex-col md:flex-row gap-6 max-w-2xl mx-auto mb-10">
            {/* FREE */}
            <div
              className="flex-1 p-8 rounded-2xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E4DD' }}
            >
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '0.5rem'
              }}>
                Free
              </h3>
              <p style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '2.5rem',
                fontWeight: 600,
                color: '#1E2A5E',
                marginBottom: '1.5rem'
              }}>
                ₦0
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Breakfast & lunch only',
                  'Monday to Friday meals',
                  'AI meal plan generator',
                  'Basic grocery lists',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={16} style={{ color: '#3D6BE5', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#5E6680' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl"
                style={{
                  border: '1.5px solid #3D6BE5',
                  color: '#3D6BE5',
                  backgroundColor: 'transparent',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Get started free
              </button>
            </div>

            {/* CARE - highlighted */}
            <div
              className="flex-1 p-8 rounded-2xl relative"
              style={{ backgroundColor: '#FFFFFF', border: '2px solid #E8A92E' }}
            >
              <div
                className="absolute -top-3 left-8 px-3 py-1 rounded-full"
                style={{
                  backgroundColor: '#E8A92E',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#1E2A5E',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em'
                }}
              >
                Most Chosen
              </div>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '0.5rem'
              }}>
                Care
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <p style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  color: '#1E2A5E'
                }}>
                  ₦1,500
                </p>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#5E6680' }}>
                  / month
                </span>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#5E6680', marginBottom: '1.5rem' }}>
                Everything in Free, plus:
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  '7 days, 3 meals per day',
                  'Add 1 caregiver',
                  'Unlimited meal swaps',
                  'Progress tracking',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={16} style={{ color: '#E8A92E', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#5E6680' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl"
                style={{
                  backgroundColor: '#1E2A5E',
                  color: '#F4D27A',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Start Care plan
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Thin Marigold Rule */}
      <div style={{ height: '1px', backgroundColor: '#E8A92E' }} />

      {/* FOR DIETITIANS - WAITLIST - NAVY SECTION */}
      <section id="dietitians" className="py-20 md:py-32" style={{ backgroundColor: '#1E2A5E' }}>
        <Container maxWidth="landing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: Copy */}
            <div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#F4D27A',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                marginBottom: '2rem'
              }}>
                FOR DIETITIANS & NUTRITIONISTS
              </p>

              <h2 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
                fontWeight: 600,
                color: '#F4D27A',
                maxWidth: '540px',
                marginBottom: '1.5rem',
                lineHeight: 1.25
              }}>
                We are building something for you. Join the waitlist.
              </h2>

              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.0625rem',
                color: '#A8BCF0',
                maxWidth: '480px',
                lineHeight: 1.7,
                marginBottom: '2rem'
              }}>
                Lapya is not yet open to dietitians and nutritionists, but we're working on it. If you want to be among the first to use Lapya to support your patients, leave your details below.
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(244, 210, 122, 0.2)', border: '1px solid #F4D27A' }}
                  >
                    <span style={{ fontSize: '0.625rem', color: '#F4D27A', fontWeight: 700 }}>1</span>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#A8BCF0' }}>
                    Get early access before we open to the public
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(244, 210, 122, 0.2)', border: '1px solid #F4D27A' }}
                  >
                    <span style={{ fontSize: '0.625rem', color: '#F4D27A', fontWeight: 700 }}>2</span>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#A8BCF0' }}>
                    Help shape how the platform works for practitioners
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(244, 210, 122, 0.2)', border: '1px solid #F4D27A' }}
                  >
                    <span style={{ fontSize: '0.625rem', color: '#F4D27A', fontWeight: 700 }}>3</span>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#A8BCF0' }}>
                    Earn revenue from patients you support on Lapya
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Waitlist form */}
            <div>
              <div
                className="p-8 rounded-2xl"
                style={{ backgroundColor: 'rgba(168, 188, 240, 0.08)', border: '1px solid rgba(168, 188, 240, 0.2)' }}
              >
                {waitlistSubmitted ? (
                  <div className="text-center py-8">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: 'rgba(244, 210, 122, 0.2)' }}
                    >
                      <Check size={28} style={{ color: '#F4D27A' }} />
                    </div>
                    <h3 style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#F4D27A',
                      marginBottom: '0.75rem'
                    }}>
                      You're on the list.
                    </h3>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9375rem',
                      color: '#A8BCF0',
                      lineHeight: 1.6
                    }}>
                      We'll reach out as soon as the dietitian programme is ready. Thank you for your interest.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#F4D27A',
                      marginBottom: '0.5rem'
                    }}>
                      Join the waitlist
                    </h3>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#A8BCF0',
                      marginBottom: '2rem'
                    }}>
                      We are not currently accepting dietitians. Sign up below to be notified first.
                    </p>

                    <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="wl-name"
                          style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#A8BCF0', display: 'block', marginBottom: '0.5rem' }}
                        >
                          Full name
                        </label>
                        <input
                          id="wl-name"
                          type="text"
                          placeholder="Dr. Amaka Obi"
                          className="w-full px-4 py-3 rounded-xl"
                          style={{
                            backgroundColor: 'rgba(168, 188, 240, 0.1)',
                            border: '1px solid rgba(168, 188, 240, 0.3)',
                            color: '#F4D27A',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.9375rem',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="wl-email"
                          style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#A8BCF0', display: 'block', marginBottom: '0.5rem' }}
                        >
                          Email address
                        </label>
                        <input
                          id="wl-email"
                          type="email"
                          required
                          value={waitlistEmail}
                          onChange={(e) => setWaitlistEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-xl"
                          style={{
                            backgroundColor: 'rgba(168, 188, 240, 0.1)',
                            border: '1px solid rgba(168, 188, 240, 0.3)',
                            color: '#F4D27A',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.9375rem',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="wl-role"
                          style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#A8BCF0', display: 'block', marginBottom: '0.5rem' }}
                        >
                          I am a
                        </label>
                        <select
                          id="wl-role"
                          value={waitlistRole}
                          onChange={(e) => setWaitlistRole(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl"
                          style={{
                            backgroundColor: 'rgba(168, 188, 240, 0.1)',
                            border: '1px solid rgba(168, 188, 240, 0.3)',
                            color: '#F4D27A',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.9375rem',
                            outline: 'none'
                          }}
                        >
                          <option value="dietitian" style={{ backgroundColor: '#1E2A5E' }}>Registered Dietitian</option>
                          <option value="nutritionist" style={{ backgroundColor: '#1E2A5E' }}>Nutritionist</option>
                          <option value="other" style={{ backgroundColor: '#1E2A5E' }}>Other health practitioner</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-xl mt-2"
                        style={{
                          backgroundColor: '#E8A92E',
                          color: '#1E2A5E',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '1rem',
                          fontWeight: 700,
                          border: 'none',
                          cursor: isSubmitting ? 'wait' : 'pointer',
                          opacity: isSubmitting ? 0.7 : 1
                        }}
                      >
                        {isSubmitting ? 'Joining…' : 'Join the waitlist'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32" style={{ backgroundColor: '#FBFAF7' }}>
        <Container maxWidth="landing">
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#3D6BE5',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            marginBottom: '2rem'
          }}>
            FREQUENTLY ASKED
          </p>

          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2rem, 2.5vw, 2.5rem)',
            fontWeight: 600,
            color: '#1E2A5E',
            marginBottom: '4rem'
          }}>
            Questions, answered.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            {[
              {
                q: 'Is Lapya a replacement for my doctor or dietitian?',
                a: "No. Lapya is a daily companion that helps you act on the advice you've been given. We help you filter what foods are good or not good based on your condition. The decisions stay with you and your doctor."
              },
              {
                q: 'What if I have more than one condition?',
                a: "That's exactly why we built Lapya. Diabetes + hypertension + kidney disease often need conflicting diets. Lapya looks at all your conditions together and finds meals that work for all of them at once."
              },
              {
                q: "Will it work for foods my grandmother cooks?",
                a: "Yes. We started with the 100 most-cooked Nigerian dishes: egusi, eba, jollof, ofada, tuwo, akara, and more. Ghana, Kenya, and South Africa follow this year."
              },
              {
                q: 'Do I need a smartphone with great internet?',
                a: 'A basic Android phone with occasional WiFi or 4G is enough. Lapya works offline after your first plan loads.'
              },
              {
                q: 'What about my privacy?',
                a: 'Your health data is encrypted and stored securely. We will never sell or share it. NDPR-compliant by design.'
              },
              {
                q: 'How much is it?',
                a: 'Free to try forever. The Care plan is ₦1,500 a month for unlimited meals, 7 days a week, plus caregiver access.'
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <div style={{ height: '1px', backgroundColor: '#E8A92E', marginBottom: '1.5rem' }} />
                <h3 style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: '#1E2A5E',
                  marginBottom: '0.875rem'
                }}>
                  {q}
                </h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  color: '#5E6680',
                  lineHeight: 1.7
                }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CLOSING CTA */}
      <section
        className="py-24 md:py-32 relative overflow-hidden"
        style={{ backgroundColor: '#1E2A5E' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1664805254301-e18e51e2762d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlYmVycmllcyUyMGxpbmVuJTIwdGV4dHVyZSUyMGZhYnJpY3xlbnwxfHx8fDE3NzkyNzc2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <Container maxWidth="landing" className="relative z-10">
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#E8A92E',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            marginBottom: '2rem'
          }}>
            ONE LAST THING
          </p>

          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)',
            fontWeight: 600,
            color: '#F4D27A',
            lineHeight: 1.2,
            maxWidth: '880px',
            marginBottom: '1.5rem'
          }}>
            There is a way to eat well in Nigeria, even with everything.
          </h2>

          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.125rem',
            color: '#A8BCF0',
            marginBottom: '3rem'
          }}>
            Start your free plan in 3 minutes. No card needed.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-full"
              style={{
                backgroundColor: '#3D6BE5',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Start your free meal plan
            </button>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="py-16 md:py-20" style={{ backgroundColor: '#1E2A5E' }}>
        <Container maxWidth="landing">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Column 1 - Brand */}
            <div>
              <div className="mb-4" style={{ width: '40px', height: '40px', overflow: 'hidden', flexShrink: 0 }}>
                <LapyaLogo size={40} />
              </div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#A8BCF0',
                marginBottom: '1.5rem'
              }}>
                Eat well, even with everything.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" style={{ color: '#F4D27A' }}><Instagram size={20} /></a>
                <a href="#" style={{ color: '#F4D27A' }}><Twitter size={20} /></a>
                <a href="#" style={{ color: '#F4D27A' }}><Linkedin size={20} /></a>
              </div>
            </div>

            {/* Column 2 - Product */}
            <div>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#F4D27A', marginBottom: '1rem' }}>
                Product
              </h4>
              <ul className="space-y-2">
                {['How it works', 'For patients', 'For caregivers', 'For dietitians', 'Pricing'].map((item) => (
                  <li key={item}>
                    <a href="#" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#A8BCF0', textDecoration: 'none' }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Company */}
            <div>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#F4D27A', marginBottom: '1rem' }}>
                Company
              </h4>
              <ul className="space-y-2">
                {['About Lapya', 'Press', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#A8BCF0', textDecoration: 'none' }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Newsletter */}
            <div>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#F4D27A', marginBottom: '1rem' }}>
                Stay close
              </h4>
              <div className="flex gap-2 mb-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(168, 188, 240, 0.1)',
                    border: '1px solid #A8BCF0',
                    color: '#F4D27A',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <button
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: '#3D6BE5', border: 'none', cursor: 'pointer', color: '#FFFFFF' }}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#A8BCF0' }}>
                One email a month. Real stories. No spam. Promise.
              </p>
            </div>
          </div>

          {/* Bottom Row */}
          <div
            className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ borderTop: '1px solid rgba(168, 188, 240, 0.2)' }}
          >
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#A8BCF0' }}>
              © 2026 Lapya Health Limited · Nigeria
            </p>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'NDPR'].map((item) => (
                <a key={item} href="#" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#A8BCF0', textDecoration: 'none' }}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};
