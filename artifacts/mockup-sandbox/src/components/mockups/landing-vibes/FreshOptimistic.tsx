import React from 'react';
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
} from 'lucide-react';

export function FreshOptimistic() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#374151] overflow-x-hidden selection:bg-[#10B981] selection:text-white" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* 1. STICKY NAV */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-[#D1FAE5] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <svg height="34" viewBox="0 0 168 48" fill="none" className="transform scale-90 sm:scale-100 origin-left">
              <rect x="2" y="28" width="12" height="12" rx="3" fill="#064E3B"/>
              <rect x="14" y="34" width="12" height="12" rx="3" fill="#10B981"/>
              <rect x="26" y="18" width="12" height="12" rx="3" fill="#064E3B"/>
              <rect x="38" y="4" width="12" height="12" rx="3" fill="#10B981"/>
              <line x1="60" y1="6" x2="60" y2="42" stroke="#D1FAE5" strokeWidth="1"/>
              <text x="70" y="22" fontFamily='"Plus Jakarta Sans", sans-serif' fontSize="15" fontWeight="800" fill="#064E3B">Founded</text>
              <text x="70" y="41" fontFamily='"Plus Jakarta Sans", sans-serif' fontSize="15" fontWeight="800" fill="#10B981">Right</text>
            </svg>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[#064E3B] font-medium hover:text-[#10B981] transition-colors hidden sm:block">
              Sign in
            </button>
            <button className="bg-[#10B981] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#059669] hover:shadow-[0_8px_20px_rgba(16,185,129,0.35)] transition-all duration-300">
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[90vh] flex flex-col items-center justify-center text-center px-4" style={{ background: 'radial-gradient(ellipse 100% 60% at 50% 0%, #ECFDF5 0%, white 70%)' }}>
        
        <div className="inline-flex items-center gap-2 bg-[#ECFDF5] border border-[#D1FAE5] px-4 py-2 rounded-full mb-8 cursor-pointer hover:bg-[#D1FAE5] transition-colors group">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
          <span className="text-sm font-medium text-[#059669]">Business setup platform for LLC owners</span>
          <ArrowRight size={14} className="text-[#059669] group-hover:translate-x-1 transition-transform" />
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#064E3B] tracking-tight mb-6 max-w-4xl" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Stop guessing <br className="hidden md:block" />
          <span className="text-[#10B981]">what to do next.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#374151] leading-[1.7] max-w-2xl mb-10">
          FoundedRight walks you step by step through everything your LLC needs to get funded, win government contracts, and build a professional presence — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <button className="w-full sm:w-auto bg-[#10B981] text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-[#059669] hover:shadow-[0_8px_25px_rgba(16,185,129,0.35)] transition-all duration-300 flex items-center justify-center gap-2">
            Sign up free <ArrowRight size={20} />
          </button>
          <button className="w-full sm:w-auto bg-white border border-[#D1FAE5] text-[#064E3B] px-8 py-4 rounded-xl font-medium text-lg hover:bg-[#F0FDF4] transition-all duration-300 flex items-center justify-center gap-2">
            See how it works <ArrowDown size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[#6B7280] text-sm font-medium">
          <CheckCircle2 size={16} className="text-[#10B981]" />
          <span>No credit card required to start</span>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6B7280] opacity-70">
          <span className="text-xs font-semibold tracking-widest uppercase">Scroll</span>
          <ChevronDown size={20} className="animate-bounce" />
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-24 bg-[#ECFDF5] border-y border-[#D1FAE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#064E3B] mb-4" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Why most LLCs stay stuck.
            </h2>
            <div className="h-1.5 w-24 bg-[#10B981] rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 01 */}
            <div className="bg-white rounded-2xl p-8 border border-[#D1FAE5] relative overflow-hidden group hover:border-[#10B981]/50 hover:shadow-[0_10px_40px_-15px_rgba(16,185,129,0.2)] transition-all duration-300">
              <div className="absolute top-4 right-6 text-6xl font-black text-[#D1FAE5] opacity-50 select-none">01</div>
              <div className="w-12 h-12 bg-[#FEF9C3] rounded-xl border border-[#D1FAE5] shadow-sm flex items-center justify-center mb-6 relative z-10">
                <Target size={24} className="text-[#064E3B]" />
              </div>
              <h3 className="text-xl font-bold text-[#064E3B] mb-4 relative z-10" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                You don't know which steps actually matter for funding
              </h3>
              <p className="text-[#374151] mb-8 relative z-10 leading-relaxed">
                There's too much conflicting advice online. You're wasting time on things banks don't care about while missing the structural requirements they demand.
              </p>
              <button className="text-[#10B981] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all relative z-10">
                Learn more <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 02 */}
            <div className="bg-white rounded-2xl p-8 border border-[#D1FAE5] relative overflow-hidden group hover:border-[#10B981]/50 hover:shadow-[0_10px_40px_-15px_rgba(16,185,129,0.2)] transition-all duration-300">
              <div className="absolute top-4 right-6 text-6xl font-black text-[#D1FAE5] opacity-50 select-none">02</div>
              <div className="w-12 h-12 bg-[#FEE2E2] rounded-xl border border-[#D1FAE5] shadow-sm flex items-center justify-center mb-6 relative z-10">
                <ShieldAlert size={24} className="text-[#064E3B]" />
              </div>
              <h3 className="text-xl font-bold text-[#064E3B] mb-4 relative z-10" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Grant and loan applications keep getting rejected or ignored
              </h3>
              <p className="text-[#374151] mb-8 relative z-10 leading-relaxed">
                You're applying blindly without a solid business foundation. Lenders see red flags you didn't even know existed, stopping your growth before it starts.
              </p>
              <button className="text-[#10B981] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all relative z-10">
                Learn more <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 03 */}
            <div className="bg-white rounded-2xl p-8 border border-[#D1FAE5] relative overflow-hidden group hover:border-[#10B981]/50 hover:shadow-[0_10px_40px_-15px_rgba(16,185,129,0.2)] transition-all duration-300">
              <div className="absolute top-4 right-6 text-6xl font-black text-[#D1FAE5] opacity-50 select-none">03</div>
              <div className="w-12 h-12 bg-[#DBEAFE] rounded-xl border border-[#D1FAE5] shadow-sm flex items-center justify-center mb-6 relative z-10">
                <Award size={24} className="text-[#064E3B]" />
              </div>
              <h3 className="text-xl font-bold text-[#064E3B] mb-4 relative z-10" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Government contracts feel impossible to break into
              </h3>
              <p className="text-[#374151] mb-8 relative z-10 leading-relaxed">
                The terminology is dense and the requirements are strict. Without NAICS codes and a Capability Statement, you're locked out of billions in opportunities.
              </p>
              <button className="text-[#10B981] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all relative z-10">
                Learn more <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#064E3B] mb-6 tracking-tight" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Everything you need, structured perfectly.
            </h2>
            <p className="text-lg text-[#374151] leading-relaxed">
              One platform built specifically for new LLC owners who want to get funded, get contracts, and get taken seriously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Personalized Setup Checklist', desc: 'Know exactly what to do and when to do it. No more guessing.', icon: LayoutList },
              { title: 'AI-Matched Funding', desc: 'Discover grants and loans tailored specifically to your business profile.', icon: TrendingUp },
              { title: 'NAICS Code Finder', desc: 'Identify your correct industry codes instantly to qualify for contracts.', icon: Search },
              { title: 'Capability Statement Generator', desc: 'Create a professional government contracting resume in minutes.', icon: FileText },
              { title: 'Application Tracker', desc: 'Keep tabs on every grant, loan, and contract you apply for.', icon: Target },
              { title: 'AI Assistant', desc: 'Get instant answers to complex business structuring questions.', icon: Bot },
            ].map((feature, i) => (
              <div key={i} className="bg-[#F0FDF4] border border-[#D1FAE5] rounded-2xl p-8 hover:-translate-y-1 hover:bg-white hover:border-[#6EE7B7] hover:shadow-xl hover:shadow-[#10B981]/5 transition-all duration-300 group cursor-pointer flex flex-col">
                <div className="w-12 h-12 bg-[#064E3B] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#10B981] transition-colors duration-300">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#064E3B] mb-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-[#374151] mb-6 flex-grow">
                  {feature.desc}
                </p>
                <div className="mt-auto self-end w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center group-hover:bg-[#10B981] transition-colors duration-300">
                  <ArrowRight size={16} className="text-[#10B981] group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section className="py-20 bg-[#F0FDF4] border-y border-[#D1FAE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-[#D1FAE5]">
            <div className="px-6 flex flex-col">
              <div className="text-[3.5rem] leading-none font-extrabold text-[#10B981] mb-2" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                5.5M+
              </div>
              <div className="text-lg font-medium text-[#374151] mb-6">New businesses started last year</div>
              <div className="w-full h-[2px] bg-[#D1FAE5] rounded-full mb-4 overflow-hidden">
                <div className="w-full h-full bg-[#10B981]"></div>
              </div>
              <button className="text-[#10B981] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Why this matters <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="px-6 flex flex-col">
              <div className="text-[3.5rem] leading-none font-extrabold text-[#064E3B] mb-2" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                21.6M
              </div>
              <div className="text-lg font-medium text-[#374151] mb-6">LLCs currently operating in the US</div>
              <div className="w-full h-[2px] bg-[#D1FAE5] rounded-full mb-4 overflow-hidden">
                <div className="w-full h-full bg-[#10B981]"></div>
              </div>
              <button className="text-[#10B981] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Why this matters <ArrowRight size={14} />
              </button>
            </div>

            <div className="px-6 flex flex-col">
              <div className="text-[3.5rem] leading-none font-extrabold text-[#064E3B] mb-2" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Billions
              </div>
              <div className="text-lg font-medium text-[#374151] mb-6">In unawarded government contracts</div>
              <div className="w-full h-[2px] bg-[#D1FAE5] rounded-full mb-4 overflow-hidden">
                <div className="w-full h-full bg-[#10B981]"></div>
              </div>
              <button className="text-[#10B981] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Why this matters <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)' }}>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(0,0,0,0) 70%)', transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.1) 0%, rgba(0,0,0,0) 70%)', transform: 'translate(-30%, 30%)' }}></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Your LLC deserves a real foundation.
          </h2>
          <p className="text-xl text-[#A7F3D0] mb-10 max-w-2xl leading-relaxed">
            Join thousands of business owners who are getting structured, getting funded, and getting contracts.
          </p>
          
          <button className="w-full max-w-[600px] bg-white text-[#064E3B] px-8 py-5 rounded-xl font-bold text-lg hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center justify-center gap-2 mb-6 shadow-xl">
            Sign up free <ArrowRight size={20} />
          </button>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[#6EE7B7] text-sm font-medium">
            <span className="flex items-center gap-1"><CheckCircle2 size={16} /> Free forever plan</span>
            <span className="hidden sm:inline opacity-50">•</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={16} /> No credit card required</span>
            <span className="hidden sm:inline opacity-50">•</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={16} /> Setup in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#064E3B] py-12 border-t border-[#065F46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div>
              <svg height="34" viewBox="0 0 168 48" fill="none">
                <rect x="2" y="28" width="12" height="12" rx="3" fill="#A7F3D0"/>
                <rect x="14" y="34" width="12" height="12" rx="3" fill="#84CC16"/>
                <rect x="26" y="18" width="12" height="12" rx="3" fill="#A7F3D0"/>
                <rect x="38" y="4" width="12" height="12" rx="3" fill="#84CC16"/>
                <line x1="60" y1="6" x2="60" y2="42" stroke="#065F46" strokeWidth="1"/>
                <text x="70" y="22" fontFamily='"Plus Jakarta Sans", sans-serif' fontSize="15" fontWeight="800" fill="#ECFDF5">Founded</text>
                <text x="70" y="41" fontFamily='"Plus Jakarta Sans", sans-serif' fontSize="15" fontWeight="800" fill="#84CC16">Right</text>
              </svg>
            </div>
            
            <div className="flex gap-8 text-sm font-medium">
              <a href="#" className="text-[#6EE7B7] hover:text-[#ECFDF5] transition-colors">Privacy Policy</a>
              <a href="#" className="text-[#6EE7B7] hover:text-[#ECFDF5] transition-colors">Terms of Service</a>
              <a href="#" className="text-[#6EE7B7] hover:text-[#ECFDF5] transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#065F46]/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#4ADE80] text-sm">
              © 2026 FoundedRight. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
