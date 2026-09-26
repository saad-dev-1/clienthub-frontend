import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Link2,
  FileText,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-bg-base/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-semibold text-xs">C</span>
            </div>
            <span className="text-sm font-semibold">ClientHub</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-text-muted hover:text-text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-text-muted hover:text-text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-text-muted hover:text-text-primary transition-colors px-3 py-1.5">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6">
            <Sparkles size={12} strokeWidth={2} />
            <span>Now with public share links</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.1]">
            Send one link.
            <br />
            <span className="text-text-muted">Your client sees everything.</span>
          </h1>

          <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            ClientHub is the project management tool built for freelancers.
            No client logins. No email chains. Just a clean link that shows
            project status, files, and invoices.
          </p>

          <div className="flex items-center justify-center gap-3 mb-16">
            <Link to="/register" className="btn-primary px-5 py-2.5 text-sm">
              Start for free
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <a href="#features" className="btn-secondary px-5 py-2.5 text-sm">
              See how it works
            </a>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-accent/20 blur-3xl -z-10" />
            <div className="border border-border rounded-xl overflow-hidden shadow-2xl bg-bg-card">
              {/* Fake browser bar */}
              <div className="h-8 border-b border-border bg-bg-hover flex items-center gap-1.5 px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-danger/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/50" />
              </div>
              {/* Dashboard mockup */}
              <div className="flex h-72">
                <div className="w-40 border-r border-border p-3 space-y-1">
                  {['Dashboard', 'Clients', 'Projects', 'Invoices'].map((item, i) => (
                    <div key={item} className={`text-xs px-2 py-1.5 rounded-md ${i === 0 ? 'bg-accent-subtle text-accent' : 'text-text-muted'}`}>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-4 space-y-3">
                  <div className="text-sm font-semibold">Good morning, Saad</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['Projects', 'Clients', 'Revenue'].map((stat) => (
                      <div key={stat} className="border border-border rounded-lg p-2.5">
                        <div className="text-[10px] text-text-subtle uppercase tracking-wide">{stat}</div>
                        <div className="text-lg font-semibold mt-1">12</div>
                      </div>
                    ))}
                  </div>
                  <div className="border border-border rounded-lg p-3">
                    <div className="text-xs font-medium mb-2">Nexus Store</div>
                    <div className="h-1 bg-bg-hover rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              Everything you need
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Simple enough to start today. Powerful enough to run your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FolderKanban, title: 'Projects', desc: 'Track every project, deadline, and progress in one clean view.' },
              { icon: Link2, title: 'Share Links', desc: 'Send clients a link. No login needed. Ever.' },
              { icon: FileText, title: 'Invoices', desc: 'Create, send, and mark paid. PDF export included.' },
              { icon: BarChart3, title: 'Insights', desc: 'See revenue, active projects, and what needs attention.' },
            ].map((f) => (
              <div key={f.title} className="card hover:border-border-strong transition-colors">
                <div className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center mb-4">
                  <f.icon size={18} strokeWidth={1.75} className="text-accent" />
                </div>
                <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              Simple pricing
            </h2>
            <p className="text-text-muted">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
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
                features: ['Unlimited projects', 'Unlimited clients', 'Invoices + PDF', 'Share links', 'Analytics'],
                cta: 'Start 14-day trial',
                featured: true,
              },
              {
                name: 'Agency',
                price: '$29',
                desc: 'For small teams',
                features: ['Everything in Pro', 'Team members', 'Priority support', 'Custom branding'],
                cta: 'Contact us',
                featured: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`card relative ${plan.featured ? 'border-accent' : ''}`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-accent">
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
                    <span className="text-sm text-text-muted">/mo</span>
                  </div>
                  <p className="text-xs text-text-muted">{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                      <CheckCircle2 size={14} strokeWidth={2} className="text-accent mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={plan.featured ? 'btn-primary w-full' : 'btn-secondary w-full'}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Ready to simplify your workflow?
          </h2>
          <p className="text-text-muted mb-8">
            Join freelancers who stopped chasing clients for updates.
          </p>
          <Link to="/register" className="btn-primary px-5 py-2.5 text-sm">
            Get started free
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white font-semibold text-[10px]">C</span>
            </div>
            <span className="text-xs text-text-muted">
              © 2026 ClientHub. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-text-muted">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}