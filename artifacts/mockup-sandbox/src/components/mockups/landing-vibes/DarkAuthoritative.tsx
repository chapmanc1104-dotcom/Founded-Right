import React from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  ChevronDown, 
  Target, 
  ShieldAlert, 
  Award,
  CheckCircle2, 
  TrendingUp, 
  Search, 
  FileText, 
  LayoutList, 
  Bot
} from 'lucide-react';

export function DarkAuthoritative() {
  return (
    <div className="min-h-screen bg-[#080C14] text-[#F1F5F9] font-sans selection:bg-[#C9A84C] selection:text-[#080C14] overflow-x-hidden">
      {/* Global typography overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        
        h1, h2, h3, h4, h5, h6, .font-heading {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        body, p, a, span, button, .font-body {
          font-family: 'Inter', sans-serif;
        }
      `}} />

      {/* 1. STICKY NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C14]/95 backdrop-blur border-b border-[#1E2D45]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex-shrink-0 cursor-pointer">
            <svg height="34" viewBox="0 0 168 48" fill="none" className="block">
              <rect x="2" y="28" width="12" height="12" rx="3" fill="#C9A84C"/>
              <rect x="14" y="34" width="12" height="12" rx="3" fill="#F1F5F9"/>
              <rect x="26" y="18" width="12" height="12" rx="3" fill="#C9A84C"/>
              <rect x="38" y="4" width="12" height="12" rx="3" fill="#F1F5F9"/>
              <line x1="60" y1="6" x2="60" y2="42" stroke="#1E2D45" strokeWidth="1"/>
              <text x="70" y="22" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="15" fontWeight="800" fill="#F1F5F9">Founded</text>
              <text x="70" y="41" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="15" fontWeight="800" fill="#C9A84C">Right</text>
            </svg>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => {}} className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors font-medium text-sm">
              Sign in
            </button>
            <button onClick={() => {}} className="bg-[#C9A84C] text-[#080C14] hover:bg-[#D4B863] px-5 py-2.5 rounded-none font-semibold text-sm transition-colors duration-200">
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,168,76,0.08) 0%, transparent 70%)'
      }}>
        <div className="max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F1729] border border-[#1E2D45] text-[#C9A84C] text-xs font-semibold uppercase tracking-wider mb-8">
            <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse"></div>
            Business setup platform for LLC owners
            <ArrowRight className="w-3 h-3 ml-1" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#F1F5F9] leading-tight mb-6 tracking-tight">
            Stop guessing <br className="hidden md:block" />
            <span className="text-[#94A3B8]">what to do next.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
            FoundedRight walks you step by step through everything your LLC needs to get funded, win government contracts, and build a professional presence — all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button onClick={() => {}} className="w-full sm:w-auto bg-[#C9A84C] text-[#080C14] font-bold px-8 py-4 rounded-none hover:shadow-[0_8px_30px_rgba(201,168,76,0.25)] hover:bg-[#D4B863] transition-all flex items-center justify-center gap-2 text-lg">
              Sign up free <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => {}} className="w-full sm:w-auto bg-transparent border border-[#1E2D45] text-[#F1F5F9] font-bold px-8 py-4 rounded-none hover:bg-[#162035] transition-all flex items-center justify-center gap-2 text-lg">
              See how it works <ArrowDown className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-[#64748B] text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> No credit card required to start
          </p>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#64748B]">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-24 px-6 bg-[#080C14] border-t border-b border-[#1E2D45] relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#F1F5F9 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#F1F5F9] mb-4">Why most LLCs stay stuck.</h2>
            <div className="w-16 h-1 bg-[#C9A84C]"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: Target,
                title: "You don't know which steps actually matter for funding",
                desc: "There are 50+ things you could do to set up an LLC. Banks only care about 8 of them. We show you exactly what they are."
              },
              {
                num: "02",
                icon: ShieldAlert,
                title: "Grant and loan applications keep getting rejected or ignored",
                desc: "Missing a single compliance check—like a mismatched address or incorrect NAICS code—is an automatic denial. We catch these before you apply."
              },
              {
                num: "03",
                icon: Award,
                title: "Government contracts feel impossible to break into",
                desc: "The public sector spends billions, but the barrier to entry is complex paperwork. We structure your business to meet federal contracting standards."
              }
            ].map((card, i) => (
              <div key={i} className="group bg-[#0F1729] border border-[#1E2D45] rounded-lg p-8 hover:border-[#C9A84C]/30 hover:shadow-[0_0_30px_rgba(201,168,76,0.05)] transition-all relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-4 right-6 text-7xl font-extrabold text-[#C9A84C] opacity-5 pointer-events-none">{card.num}</div>
                
                <div className="w-12 h-12 bg-[#162035] border border-[#1E2D45] group-hover:border-[#C9A84C] transition-colors rounded flex items-center justify-center mb-6">
                  <card.icon className="w-6 h-6 text-[#F1F5F9]" />
                </div>
                
                <h3 className="text-xl font-bold text-[#F1F5F9] mb-3 leading-tight">{card.title}</h3>
                <p className="text-[#94A3B8] mb-8 flex-grow leading-relaxed">{card.desc}</p>
                
                <button onClick={() => {}} className="text-[#C9A84C] font-semibold flex items-center gap-2 group/btn self-start text-sm uppercase tracking-wide">
                  Learn more <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="py-24 px-6 bg-[#0A0E18]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#F1F5F9] mb-6">Everything you need,<br/>structured perfectly.</h2>
            <p className="text-[#94A3B8] text-lg leading-relaxed">
              One platform built specifically for new LLC owners who want to get funded, get contracts, and get taken seriously.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: LayoutList, title: "Personalized Setup Checklist", desc: "A step-by-step roadmap tailored to your state, industry, and goals. Stop reading generic blogs." },
              { icon: TrendingUp, title: "AI-Matched Funding", desc: "We scan 10,000+ grants and loans to find the exact ones your specific LLC qualifies for today." },
              { icon: Search, title: "NAICS Code Finder", desc: "Select the wrong industry code and you'll miss out on contracts. We help you choose the strategic codes." },
              { icon: FileText, title: "Capability Statement Generator", desc: "Automatically generate the standard one-page resume required for any government contract." },
              { icon: Target, title: "Application Tracker", desc: "Keep all your EINs, UEIs, state registrations, and grant applications organized in one secure dashboard." },
              { icon: Bot, title: "AI Assistant", desc: "Have a question about a form? Ask our AI trained exclusively on federal and state business regulations." }
            ].map((feature, i) => (
              <div key={i} className="group bg-[#0F1729] border border-[#1E2D45] rounded-lg p-8 hover:border-[#C9A84C]/40 hover:bg-[#162035] transition-all cursor-pointer relative">
                <div className="w-10 h-10 bg-[#C9A84C] rounded flex items-center justify-center mb-6">
                  <feature.icon className="w-5 h-5 text-[#080C14]" strokeWidth={2.5} />
                </div>
                
                <h3 className="text-lg font-bold text-[#F1F5F9] mb-2">{feature.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">{feature.desc}</p>
                
                <div className="absolute bottom-6 right-6 text-[#C9A84C] opacity-50 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section className="py-20 px-6 bg-[#080C14] border-t border-b border-[#1E2D45]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1E2D45]">
            {[
              { val: "5.5M", label: "ACTIVE BUSINESSES", desc: "New businesses formed in 2023 alone.", metric: "ACTIVE BUSINESSES" },
              { val: "21.6M", label: "LLCs IN US", desc: "Total limited liability companies in the US.", metric: "LLCs IN US" },
              { val: "Billions", label: "UNCLAIMED ANNUALLY", desc: "In government grants and contracts.", metric: "UNCLAIMED ANNUALLY" }
            ].map((stat, i) => (
              <div key={i} className="py-8 md:py-4 px-6 md:px-12 flex flex-col justify-center">
                <span className="font-sans text-[10px] font-bold text-[#64748B] tracking-[0.15em] uppercase mb-2 block">{stat.metric}</span>
                <div className="text-5xl md:text-[3.5rem] font-extrabold text-[#C9A84C] mb-2 tracking-tight leading-none">{stat.val}</div>
                <div className="text-[#F1F5F9] font-medium mb-1">{stat.label}</div>
                <button onClick={() => {}} className="text-xs text-[#64748B] hover:text-[#C9A84C] flex items-center gap-1 transition-colors mt-2">
                  Why this matters <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F1729 0%, #162035 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A84C] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.12] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3B82F6] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.06] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-[#F1F5F9] mb-6 tracking-tight">Your LLC deserves a real foundation.</h2>
          <p className="text-xl text-[#94A3B8] mb-12 max-w-2xl mx-auto">
            Join thousands of business owners who are getting structured, getting funded, and getting contracts.
          </p>
          
          <button onClick={() => {}} className="w-full max-w-[600px] mx-auto bg-[#C9A84C] text-[#080C14] font-bold text-xl px-8 py-5 rounded-none hover:bg-[#D4B863] hover:shadow-[0_0_40px_rgba(201,168,76,0.35)] transition-all flex items-center justify-center gap-3 mb-6">
            Sign up free <ArrowRight className="w-6 h-6" />
          </button>
          
          <p className="text-[#475569] text-sm font-medium">
            No credit card required · Free forever plan
          </p>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#040608] py-16 px-6 border-t border-[#1E2D45]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <svg height="34" viewBox="0 0 168 48" fill="none" className="block opacity-90 grayscale hover:grayscale-0 transition-all duration-500">
              <rect x="2" y="28" width="12" height="12" rx="3" fill="#F1F5F9"/>
              <rect x="14" y="34" width="12" height="12" rx="3" fill="#94A3B8"/>
              <rect x="26" y="18" width="12" height="12" rx="3" fill="#F1F5F9"/>
              <rect x="38" y="4" width="12" height="12" rx="3" fill="#94A3B8"/>
              <line x1="60" y1="6" x2="60" y2="42" stroke="#1E2D45" strokeWidth="1"/>
              <text x="70" y="22" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="15" fontWeight="800" fill="#F1F5F9">Founded</text>
              <text x="70" y="41" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="15" fontWeight="800" fill="#F1F5F9">Right</text>
            </svg>
          </div>
          
          <div className="flex items-center gap-8">
            <a href="#" className="text-[#475569] hover:text-[#F1F5F9] text-sm font-medium transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#475569] hover:text-[#F1F5F9] text-sm font-medium transition-colors">Terms of Service</a>
            <a href="#" className="text-[#475569] hover:text-[#F1F5F9] text-sm font-medium transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#1E2D45] text-center md:text-left">
          <p className="text-[#334155] text-sm">© 2026 FoundedRight. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
