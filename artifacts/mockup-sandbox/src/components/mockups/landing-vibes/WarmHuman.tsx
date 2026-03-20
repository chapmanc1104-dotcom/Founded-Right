import React from "react";
import { 
  ArrowRight, 
  ArrowDown, 
  ChevronDown, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  FileText, 
  LayoutList, 
  Bot, 
  Target, 
  ShieldAlert, 
  Award 
} from "lucide-react";

export function WarmHuman() {
  return (
    <div className="min-h-screen bg-[#FDFAF6] text-[#5C3D2E] font-sans selection:bg-[#E8D0B8] selection:text-[#3D1A07]">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif-display { font-family: 'DM Serif Display', Georgia, serif; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
      `}} />

      {/* 1. STICKY NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFAF6]/95 backdrop-blur-md border-b border-[#E8D0B8]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <svg height="34" viewBox="0 0 168 48" fill="none">
              <rect x="2" y="28" width="12" height="12" rx="3" fill="#3D1A07"/>
              <rect x="14" y="34" width="12" height="12" rx="3" fill="#C9A84C"/>
              <rect x="26" y="18" width="12" height="12" rx="3" fill="#3D1A07"/>
              <rect x="38" y="4" width="12" height="12" rx="3" fill="#C9A84C"/>
              <line x1="60" y1="6" x2="60" y2="42" stroke="#E8D0B8" strokeWidth="1"/>
              <text x="70" y="22" fontFamily="'DM Serif Display', Georgia, serif" fontSize="15" fontWeight="700" fill="#3D1A07">Founded</text>
              <text x="70" y="41" fontFamily="'DM Serif Display', Georgia, serif" fontSize="15" fontWeight="700" fill="#C5612E">Right</text>
            </svg>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => {}} className="text-[#5C3D2E] hover:text-[#3D1A07] font-medium text-sm transition-colors">
              Sign in
            </button>
            <button onClick={() => {}} className="bg-[#C5612E] hover:bg-[#A84F24] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm">
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 min-h-[90vh] flex flex-col justify-center items-center text-center px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0E6] border border-[#E8C9B0] text-[#C5612E] text-sm font-medium mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5612E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5612E]"></span>
            </span>
            Business setup platform for LLC owners
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>

          <h1 className="font-serif-display text-[68px] leading-[1.1] text-[#3D1A07] mb-8 max-w-3xl italic tracking-tight">
            Stop guessing <br/>
            <span className="not-italic">what to do next.</span>
          </h1>

          <p className="text-[#5C3D2E] text-[17px] leading-[1.75] max-w-2xl mb-12">
            FoundedRight walks you step by step through everything your LLC needs to get funded, win government contracts, and build a professional presence — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto">
            <button onClick={() => {}} className="w-full sm:w-auto bg-[#C5612E] hover:bg-[#A84F24] text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-sm flex items-center justify-center gap-2">
              Sign up free <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => {}} className="w-full sm:w-auto bg-white border border-[#3D1A07] text-[#3D1A07] hover:bg-[#FAF4EC] px-8 py-4 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2">
              See how it works <ArrowDown className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[#9C7B6E] text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#849C6E]" />
            No credit card required to start
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#9C7B6E] uppercase tracking-[0.15em] text-xs font-semibold">
          SCROLL
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-24 bg-[#FFF8F0] border-y border-[#E8D0B8] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-serif-display text-4xl text-[#3D1A07] mb-4">
              Why most LLCs stay stuck.
            </h2>
            <div className="h-1 w-20 bg-[#C5612E] rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "You don't know which steps actually matter for funding",
                desc: "There is endless advice online. Figuring out the exact sequence to make your business lendable feels like a full-time job.",
                icon: <Target className="w-6 h-6 text-[#3D1A07]" />
              },
              {
                num: "02",
                title: "Grant and loan applications keep getting rejected or ignored",
                desc: "You apply and hear nothing back. Often, it's because of small foundational errors that instantly disqualify your application.",
                icon: <ShieldAlert className="w-6 h-6 text-[#3D1A07]" />
              },
              {
                num: "03",
                title: "Government contracts feel impossible to break into",
                desc: "The terminology, the portals, the certifications—it's designed to keep newcomers out unless you know the specific formula.",
                icon: <Bot className="w-6 h-6 text-[#3D1A07]" />
              }
            ].map((card, i) => (
              <div key={i} className="relative bg-[#FDFAF6] border border-[#E8D0B8] rounded-2xl p-8 hover:shadow-[0_8px_30px_rgb(251,191,36,0.1)] transition-all group overflow-hidden">
                <div className="absolute top-2 right-4 text-7xl font-serif-display text-[#F0E6DC] opacity-50 select-none pointer-events-none">
                  {card.num}
                </div>
                
                <div className="w-12 h-12 bg-white border border-[#E8D0B8] rounded-xl flex items-center justify-center mb-6 relative z-10">
                  {card.icon}
                </div>
                
                <h3 className="text-xl font-bold text-[#3D1A07] mb-4 relative z-10 leading-snug">
                  {card.title}
                </h3>
                
                <p className="text-[#5C3D2E] text-[17px] leading-[1.75] mb-8 relative z-10">
                  {card.desc}
                </p>
                
                <button onClick={() => {}} className="text-[#C5612E] font-medium flex items-center gap-1.5 hover:gap-2 transition-all relative z-10">
                  Learn more <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="py-24 bg-[#FAF4EC] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-serif-display text-4xl text-[#3D1A07] mb-6">
              Everything you need, structured perfectly.
            </h2>
            <p className="text-[#5C3D2E] text-[17px] leading-[1.75]">
              One platform built specifically for new LLC owners who want to get funded, get contracts, and get taken seriously.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Personalized Setup Checklist", desc: "A custom roadmap based on your state and industry to ensure full compliance.", icon: <LayoutList className="w-5 h-5" /> },
              { title: "AI-Matched Funding", desc: "Instantly find grants and loans tailored exactly to your business profile.", icon: <TrendingUp className="w-5 h-5" /> },
              { title: "NAICS Code Finder", desc: "Select the perfect industry codes to maximize your eligibility for specific programs.", icon: <Search className="w-5 h-5" /> },
              { title: "Capability Statement Generator", desc: "Create a professional one-pager to present to government contracting officers.", icon: <FileText className="w-5 h-5" /> },
              { title: "Application Tracker", desc: "Manage every grant, loan, and contract application in a single organized dashboard.", icon: <Target className="w-5 h-5" /> },
              { title: "AI Assistant", desc: "Get immediate answers to complex business structuring and compliance questions.", icon: <Bot className="w-5 h-5" /> }
            ].map((feature, i) => (
              <div key={i} className="bg-[#FFF8F0] border border-[#E8D0B8] rounded-2xl p-6 group hover:border-[#C5612E]/30 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-[#3D1A07] group-hover:bg-[#C5612E] text-white rounded-xl flex items-center justify-center mb-6 transition-colors shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#3D1A07] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#5C3D2E] leading-relaxed mb-6">
                  {feature.desc}
                </p>
                <div className="flex justify-end">
                  <ArrowRight className="w-5 h-5 text-[#C5612E] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section className="py-20 bg-[#FDFAF6] border-t border-[#E8D0B8] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E8D0B8]">
            <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
              <div className="font-serif-display text-[3.5rem] text-[#3D1A07] leading-none mb-4">5.5M</div>
              <div className="text-[#5C3D2E] text-[17px] mb-4">New businesses started last year</div>
              <button onClick={() => {}} className="text-[#C5612E] text-sm font-semibold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                Why this matters <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
              <div className="font-serif-display text-[3.5rem] text-[#3D1A07] leading-none mb-4">21.6M</div>
              <div className="text-[#5C3D2E] text-[17px] mb-4">Total active LLCs navigating compliance</div>
              <button onClick={() => {}} className="text-[#C5612E] text-sm font-semibold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                Why this matters <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
              <div className="font-serif-display text-[3.5rem] text-[#3D1A07] leading-none mb-4">Billions</div>
              <div className="text-[#5C3D2E] text-[17px] mb-4">In grants left unclaimed due to errors</div>
              <button onClick={() => {}} className="text-[#C5612E] text-sm font-semibold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                Why this matters <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-28 bg-[#3D1A07] relative overflow-hidden px-6">
        {/* Soft decorative blurs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C5612E] rounded-full mix-blend-screen filter blur-[100px] opacity-15 pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#C9A84C] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-serif-display text-5xl md:text-6xl text-white mb-6">
            Your LLC deserves a real foundation.
          </h2>
          <p className="text-[#F5E6D6] text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Join thousands of business owners who are getting structured, getting funded, and getting contracts.
          </p>
          
          <button onClick={() => {}} className="w-full max-w-[600px] mx-auto bg-[#C5612E] hover:bg-[#A84F24] text-white px-8 py-5 rounded-2xl font-semibold text-xl transition-all shadow-lg shadow-[#A84F24]/20 flex items-center justify-center gap-3 mb-6">
            Sign up free <ArrowRight className="w-6 h-6" />
          </button>
          
          <div className="text-[#C4A882] text-sm flex items-center justify-center gap-2">
            No credit card required <span className="opacity-50">·</span> Free forever plan
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#2D1006] py-16 px-6 border-t border-[#4A2010]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div>
              <svg height="34" viewBox="0 0 168 48" fill="none">
                <rect x="2" y="28" width="12" height="12" rx="3" fill="#FFFFFF"/>
                <rect x="14" y="34" width="12" height="12" rx="3" fill="#C9A84C"/>
                <rect x="26" y="18" width="12" height="12" rx="3" fill="#FFFFFF"/>
                <rect x="38" y="4" width="12" height="12" rx="3" fill="#C9A84C"/>
                <line x1="60" y1="6" x2="60" y2="42" stroke="#4A2010" strokeWidth="1"/>
                <text x="70" y="22" fontFamily="'DM Serif Display', Georgia, serif" fontSize="15" fontWeight="700" fill="#FFFFFF">Founded</text>
                <text x="70" y="41" fontFamily="'DM Serif Display', Georgia, serif" fontSize="15" fontWeight="700" fill="#C9A84C">Right</text>
              </svg>
            </div>
            
            <div className="flex gap-8 text-[15px] font-medium">
              <button onClick={() => {}} className="text-[#C4A882] hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => {}} className="text-[#C4A882] hover:text-white transition-colors">Terms of Service</button>
              <button onClick={() => {}} className="text-[#C4A882] hover:text-white transition-colors">Contact</button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#4A2010]/50 text-[#9C7B6E] text-sm">
            <p>© 2026 FoundedRight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
