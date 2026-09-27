import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Link2,
  FileText,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* ============ NAV ============ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-base/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/src/assets/logo.svg"
              alt="Klient"
              className="w-7 h-7 rounded-lg"
            />
            <span className="text-sm font-semibold heading-tight">
              Klient
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#how"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
              title={
                theme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              <span className="relative block w-4 h-4">
                <Sun
                  size={16}
                  strokeWidth={1.75}
                  className={`absolute inset-0 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'opacity-100 rotate-0'
                      : 'opacity-0 -rotate-90'
                  }`}
                />
                <Moon
                  size={16}
                  strokeWidth={1.75}
                  className={`absolute inset-0 transition-all duration-300 ${
                    theme === 'light'
                      ? 'opacity-100 rotate-0'
                      : 'opacity-0 rotate-90'
                  }`}
                />
              </span>
            </button>

            <Link
              to="/login"
              className="text-sm text-text-muted hover:text-text-primary transition-colors px-2 sm:px-3 py-1.5 hidden sm:inline-block"
            >
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] rounded-full opacity-[0.15]"
            style={{
              background:
                'radial-gradient(circle, rgba(109,40,217,0.6) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />
        </div>

        <div
          className="absolute inset-0 -z-10 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgb(var(--border)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--border)) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
            maskImage:
              'radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 80%)',
          }}
        />

        <div className="max-w-6xl mx-auto">
          {/* Hero grid — split only at lg (1024px+) */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left — Text */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-card border border-border text-text-muted text-xs font-medium mb-6">
                <Sparkles size={12} strokeWidth={2} className="text-accent" />
                <span>Public share links, built in</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl heading-tightest mb-6 leading-[1.05]">
                The client portal,
                <br />
                <span className="text-text-muted">
                  built for freelancers.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-text-body mb-8 leading-relaxed max-w-lg">
                Turn projects, files, and invoices into one clean, shareable
                link. Your client opens it, no login, no emails, no chaos.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <Link
                  to="/register"
                  className="btn-primary px-5 py-2.5 text-sm w-full sm:w-auto justify-center"
                >
                  Start for free
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
                <a
                  href="#how"
                  className="btn-secondary px-5 py-2.5 text-sm w-full sm:w-auto justify-center"
                >
                  See how it works
                </a>
              </div>

              <p className="text-xs text-text-subtle">
                No credit card required. Free forever.
              </p>
            </div>

            {/* Right — Product Mockup */}
            <div className="lg:col-span-6">
              <div className="relative max-w-lg mx-auto lg:max-w-none">
                <div
                  className="absolute -inset-8 -z-10 rounded-full opacity-40"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(109,40,217,0.4) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                  }}
                />

                {/* Browser frame */}
                <div className="rounded-2xl border border-border bg-bg-card overflow-hidden shadow-modal">
                  <div className="h-9 border-b border-border bg-bg-hover flex items-center gap-1.5 px-3 sm:px-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-danger/40 flex-shrink-0" />
                    <div className="w-2.5 h-2.5 rounded-full bg-warning/40 flex-shrink-0" />
                    <div className="w-2.5 h-2.5 rounded-full bg-success/40 flex-shrink-0" />
                    <div className="flex-1 mx-2 sm:mx-3 min-w-0">
                      <div className="h-5 max-w-xs mx-auto bg-bg-base rounded flex items-center justify-center px-2">
                        <span className="text-[10px] text-text-subtle truncate">
                          klient.app/dashboard
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-80">
                    {/* Sidebar */}
                    <div className="w-28 sm:w-32 border-r border-border p-2 sm:p-3 space-y-0.5 bg-bg-base/50 flex-shrink-0">
                      <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
                        <img
                          src="/src/assets/logo.svg"
                          alt="Klient"
                          className="w-5 h-5 rounded flex-shrink-0"
                        />
                        <span className="text-[10px] font-semibold truncate">
                          Klient
                        </span>
                      </div>
                      {[
                        'Dashboard',
                        'Clients',
                        'Projects',
                        'Invoices',
                        'Settings',
                      ].map((item, i) => (
                        <div
                          key={item}
                          className={`text-[10px] px-2 py-1.5 rounded-md truncate ${
                            i === 0
                              ? 'bg-accent-subtle text-accent font-medium'
                              : 'text-text-muted'
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    {/* Main area */}
                    <div className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 min-w-0">
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold heading-tight mb-0.5 truncate">
                          Good morning, Saad
                        </div>
                        <div className="text-[10px] text-text-subtle truncate">
                          Here&apos;s what&apos;s happening today.
                        </div>
                      </div>

                      {/* Stats — perfectly responsive */}
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        {[
                          { label: 'PROJECTS', value: '8' },
                          { label: 'CLIENTS', value: '12' },
                          { label: 'REVENUE', value: '$8.4K' },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="border border-border rounded-lg p-1.5 sm:p-2.5 bg-bg-card min-w-0"
                          >
                            <div className="text-[8px] sm:text-[9px] text-text-subtle uppercase tracking-wider truncate">
                              {stat.label}
                            </div>
                            <div className="text-[11px] sm:text-sm md:text-base font-semibold tabular-nums mt-0.5 truncate">
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Recent project */}
                      <div className="border border-border rounded-lg p-2.5 sm:p-3 bg-bg-card">
                        <div className="flex items-center justify-between mb-2 gap-2 min-w-0">
                          <div className="text-[10px] sm:text-[11px] font-medium truncate">
                            Nexus Store
                          </div>
                          <div className="text-[9px] text-text-subtle tabular-nums flex-shrink-0">
                            75%
                          </div>
                        </div>
                        <div className="h-1 bg-bg-hover rounded-full overflow-hidden">
                          <div className="h-full bg-accent w-3/4 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="border-y border-border bg-bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-3 sm:gap-y-4 text-xs sm:text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} strokeWidth={2} className="text-success flex-shrink-0" />
              <span>No signup for clients</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} strokeWidth={2} className="text-success flex-shrink-0" />
              <span>Setup in 60 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} strokeWidth={2} className="text-success flex-shrink-0" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} strokeWidth={2} className="text-success flex-shrink-0" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-card border border-border text-text-muted text-xs font-medium mb-5">
              <Zap size={12} strokeWidth={2} className="text-accent" />
              <span>How it works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl heading-tightest mb-4">
              From zero to shareable in minutes
            </h2>
            <p className="text-text-body text-base sm:text-lg">
              Three simple steps. No tutorials needed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                num: '01',
                title: 'Create your project',
                desc: 'Add project details, assign a client, set a deadline. Takes 30 seconds.',
              },
              {
                num: '02',
                title: 'Add tasks & files',
                desc: 'Break work into tasks. Attach files. Track progress in real-time.',
              },
              {
                num: '03',
                title: 'Share the link',
                desc: 'One click generates a public link. Send to client. Done.',
              },
            ].map((step) => (
              <div key={step.num} className="card card-hover p-5 sm:p-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-bg-base text-sm font-semibold text-text-primary mb-5 tabular-nums">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold heading-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-body leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section
        id="features"
        className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-border bg-bg-card/30 relative overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] -z-10 opacity-[0.08] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(109,40,217,1) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-card border border-border text-text-muted text-xs font-medium mb-5">
              <span>Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl heading-tightest mb-4">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="text-text-body text-base sm:text-lg">
              Simple enough to start today. Powerful enough to run your
              business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-4 card card-hover p-5 sm:p-6">
              <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center mb-5">
                <Link2 size={20} strokeWidth={1.75} className="text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold heading-tight mb-2">
                Public share links
              </h3>
              <p className="text-sm text-text-body leading-relaxed mb-6 max-w-lg">
                Send your client a link. They see progress, tasks, and files
                with no account required. The simplest client portal ever made.
              </p>

              <div className="rounded-lg border border-border bg-bg-base p-3 flex items-center gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-text-subtle uppercase tracking-wider mb-0.5">
                    Share link
                  </div>
                  <div className="text-xs text-text-primary font-mono truncate">
                    klient.app/p/nexus-store-x7k2
                  </div>
                </div>
                <button className="btn-primary px-3 py-1.5 text-xs flex-shrink-0">
                  Copy
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 card card-hover p-5 sm:p-6">
              <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center mb-5">
                <FolderKanban
                  size={20}
                  strokeWidth={1.75}
                  className="text-accent"
                />
              </div>
              <h3 className="text-lg font-semibold heading-tight mb-2">
                Projects
              </h3>
              <p className="text-sm text-text-body leading-relaxed">
                Track every project, deadline, and progress in one clean view.
              </p>
            </div>

            <div className="lg:col-span-2 card card-hover p-5 sm:p-6">
              <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center mb-5">
                <FileText
                  size={20}
                  strokeWidth={1.75}
                  className="text-accent"
                />
              </div>
              <h3 className="text-lg font-semibold heading-tight mb-2">
                Invoices
              </h3>
              <p className="text-sm text-text-body leading-relaxed">
                Create, send, and mark paid. Professional PDF export included.
              </p>
            </div>

            <div className="lg:col-span-4 card card-hover p-5 sm:p-6">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center flex-shrink-0">
                  <BarChart3
                    size={20}
                    strokeWidth={1.75}
                    className="text-accent"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold heading-tight mb-2">
                    Insights and analytics
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed">
                    See revenue, active projects, and what needs attention. All
                    in one dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 card card-hover p-5 sm:p-6">
              <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center mb-5">
                <Users size={20} strokeWidth={1.75} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold heading-tight mb-2">
                Built for freelancers
              </h3>
              <p className="text-sm text-text-body leading-relaxed">
                No team onboarding. No client training. Just you and your work.
              </p>
            </div>

            <div className="lg:col-span-3 card card-hover p-5 sm:p-6">
              <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center mb-5">
                <Shield size={20} strokeWidth={1.75} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold heading-tight mb-2">
                Secure by default
              </h3>
              <p className="text-sm text-text-body leading-relaxed">
                Your data is encrypted, private, and yours. Always.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-card border border-border text-text-muted text-xs font-medium mb-5">
              <span>Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl heading-tightest mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-text-body text-base sm:text-lg">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Free',
                price: '$0',
                desc: 'For trying things out',
                features: ['3 projects', '2 clients', 'Basic dashboard'],
                cta: 'Start free',
                featured: false,
              },
              {
                name: 'Pro',
                price: '$12',
                desc: 'For active freelancers',
                features: [
                  'Unlimited projects',
                  'Unlimited clients',
                  'Invoices + PDF',
                  'Public share links',
                  'Analytics',
                ],
                cta: 'Start 14-day trial',
                featured: true,
              },
              {
                name: 'Agency',
                price: '$29',
                desc: 'For small teams',
                features: [
                  'Everything in Pro',
                  'Team members',
                  'Priority support',
                  'Custom branding',
                ],
                cta: 'Contact us',
                featured: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`card relative ${
                  plan.featured ? 'border-text-primary' : ''
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-6">
                    <div className="px-2.5 py-1 rounded-md bg-text-primary text-bg-base text-[10px] font-semibold uppercase tracking-wider">
                      Most popular
                    </div>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-semibold heading-tighter tabular-nums">
                      {plan.price}
                    </span>
                    <span className="text-sm text-text-muted">/mo</span>
                  </div>
                  <p className="text-xs text-text-muted">{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-text-body"
                    >
                      <CheckCircle2
                        size={14}
                        strokeWidth={2}
                        className="text-success mt-0.5 flex-shrink-0"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={
                    plan.featured
                      ? 'btn-primary w-full justify-center'
                      : 'btn-secondary w-full justify-center'
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-border relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-[0.08] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 100%, rgba(109,40,217,1) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border bg-bg-card p-6 sm:p-10 md:p-12 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(rgb(var(--text-primary)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--text-primary)) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl heading-tightest mb-4">
                Start shipping work today
              </h2>
              <p className="text-text-body text-base sm:text-lg mb-8 max-w-lg mx-auto">
                Stop chasing clients for updates. Send one link. Done.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="btn-primary px-5 py-2.5 text-sm w-full sm:w-auto justify-center"
                >
                  Get started free
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
              </div>
              <p className="text-xs text-text-subtle mt-4">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-border py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/src/assets/logo.svg"
                  alt="Klient"
                  className="w-6 h-6 rounded-md"
                />
                <span className="text-sm font-semibold heading-tight">
                  Klient
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed max-w-xs">
                Where your clients live. Built for freelancers who value their
                time.
              </p>
              <p className="text-xs text-text-subtle mt-4">
                Made in Pakistan
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
                Product
              </h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Changelog'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs text-text-muted hover:text-text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
                Company
              </h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Contact'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs text-text-muted hover:text-text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
                Legal
              </h4>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Security'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs text-text-muted hover:text-text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-text-subtle">
              © 2026 Klient. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <a href="#" className="hover:text-text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-text-primary transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-text-primary transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}