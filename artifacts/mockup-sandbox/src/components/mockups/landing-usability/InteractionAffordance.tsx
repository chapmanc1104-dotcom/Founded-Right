import React from "react";
import { ArrowRight, ArrowDown, ChevronDown, CheckCircle2, TrendingUp, Search, FileText, LayoutList, Bot, Target, ShieldAlert, Award } from "lucide-react";

export function InteractionAffordance() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}} />

      {/* STICKY NAV */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 flex items-center shadow-sm transition-all">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
          <div className="flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => {}}>
            <svg height="36" viewBox="0 0 168 48" fill="none" style={{ display: 'block', overflow: 'visible' }}>
              <rect x="2" y="28" width="12" height="12" rx="3" fill="#1B3A6B"/>
              <rect x="14" y="34" width="12" height="12" rx="3" fill="#C9A84C"/>
              <rect x="26" y="18" width="12" height="12" rx="3" fill="#1B3A6B"/>
              <rect x="38" y="4" width="12" height="12" rx="3" fill="#C9A84C"/>
              <line x1="60" y1="6" x2="60" y2="42" stroke="#CBD5E1" strokeWidth="1"/>
              <text x="70" y="22" className="font-heading" fontSize="15" fontWeight="700" fill="#1B3A6B">Founded</text>
              <text x="70" y="41" className="font-heading" fontSize="15" fontWeight="700" fill="#C9A84C">Right</text>
            </svg>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {}} 
              className="text-[#1B3A6B] font-semibold hover:text-[#2D5BE3] transition-colors flex items-center gap-1 group"
            >
              Sign in <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-1 transition-all" />
            </button>
            <button 
              onClick={() => {}} 
              className="bg-[#C9A84C] hover:bg-[#D4B663] text-[#1B3A6B] hover:shadow-lg font-bold px-6 py-2.5 rounded-md transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              Sign up free <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh] text-center bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF6FF] text-[#1B3A6B] font-semibold text-sm mb-8 border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => {}}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C9A84C]"></span>
            </span>
            Platform now open for early access <ArrowRight className="w-3.5 h-3.5" />
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-[#1B3A6B] tracking-tight leading-[1.1] mb-8">
            Stop guessing <br/>what to do next.
          </h1>
          
          <p className="font-body text-xl md:text-2xl text-slate-600 max-w-3xl mb-12 leading-relaxed">
            FoundedRight walks you step by step through everything your LLC needs to get funded, win government contracts, and build a professional presence — all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
            <button 
              onClick={() => {}} 
              className="group flex items-center justify-center gap-2 bg-[#1B3A6B] hover:bg-[#2D5BE3] text-white font-bold rounded-lg transition-all h-[56px] w-[200px] hover:shadow-[0_8px_30px_rgb(27,58,107,0.3)] transform hover:-translate-y-1"
            >
              Sign up free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => {}} 
              className="group flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#1B3A6B] font-bold rounded-lg transition-all h-[56px] w-[200px] border-2 border-[#1B3A6B] hover:shadow-md"
            >
              See how it works
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500 font-medium flex items-center gap-1 cursor-help hover:text-slate-800 transition-colors" onClick={() => {}}>
            <CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required to start
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>
          <span className="text-xs font-semibold text-slate-400 group-hover:text-[#1B3A6B] transition-colors uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-6 h-6 text-slate-400 group-hover:text-[#1B3A6B] animate-bounce transition-colors" />
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-24 px-6 bg-white border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24">
            <h2 className="font-heading text-4xl font-bold text-[#1B3A6B] mb-6">Why most LLCs stay stuck.</h2>
            <div className="w-24 h-1.5 bg-[#C9A84C] rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                num: "01",
                title: "You don't know which steps actually matter for funding",
                desc: "There are hundreds of things you could do. Most don't move the needle. Knowing the right 46 steps — in the right order — changes everything.",
                icon: <Target className="w-6 h-6 text-[#1B3A6B]" />
              },
              {
                num: "02",
                title: "Grant and loan applications keep getting rejected or ignored",
                desc: "It's not just what you apply for — it's how ready your business looks on paper. Most rejections happen before anyone reads your application.",
                icon: <ShieldAlert className="w-6 h-6 text-[#1B3A6B]" />
              },
              {
                num: "03",
                title: "Government contracts feel impossible to break into",
                desc: "SAM.gov, NAICS codes, capability statements, set-asides — the terminology alone is a barrier. But billions in contracts go to small businesses every year.",
                icon: <Award className="w-6 h-6 text-[#1B3A6B]" />
              }
            ].map((pt, i) => (
              <div 
                key={i} 
                className="group relative flex flex-col p-8 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 transition-all duration-300 hover:shadow-xl cursor-pointer"
                onClick={() => {}}
              >
                <div className="absolute top-0 right-0 p-8 text-6xl font-heading font-black text-slate-100 group-hover:text-blue-50/50 transition-colors -z-0">
                  {pt.num}
                </div>
                <div className="z-10 flex-grow">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                    {pt.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-[#1B3A6B] transition-colors">{pt.title}</h3>
                  <p className="font-body text-slate-600 leading-relaxed mb-8">{pt.desc}</p>
                </div>
                <div className="z-10 mt-auto">
                  <span className="inline-flex items-center gap-2 font-bold text-[#1B3A6B] group-hover:text-[#2D5BE3] transition-colors">
                    Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-[#1B3A6B] mb-6">Everything you need, structured perfectly.</h2>
            <p className="font-body text-xl text-slate-600 max-w-2xl mx-auto">Click any feature to see how we automate the heavy lifting for your business.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Personalized Setup Checklist", desc: "46 precise steps across 8 categories to make your business fundable.", icon: <CheckCircle2 /> },
              { title: "AI-Matched Funding", desc: "Opportunities tailored exactly to your industry, stage, and location.", icon: <TrendingUp /> },
              { title: "NAICS Code Finder", desc: "Instantly discover the exact government classification codes you need.", icon: <Search /> },
              { title: "Capability Statement Generator", desc: "Create a professional, government-ready resume for your business in minutes.", icon: <FileText /> },
              { title: "Application Tracker", desc: "Never miss a deadline. Track every grant, loan, and contract in one pipeline.", icon: <LayoutList /> },
              { title: "AI Assistant", desc: "Expert guidance available 24/7 to answer your specific compliance questions.", icon: <Bot /> }
            ].map((feat, i) => (
              <div 
                key={i} 
                className="group relative bg-[#EFF6FF] p-8 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white border border-blue-100 hover:border-blue-300"
                onClick={() => {}}
              >
                <div className="w-10 h-10 rounded-lg bg-[#1B3A6B] text-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#C9A84C] transition-colors">
                  {React.cloneElement(feat.icon as React.ReactElement, { className: "w-5 h-5" })}
                </div>
                <h3 className="font-heading text-lg font-bold text-[#1B3A6B] mb-3">{feat.title}</h3>
                <p className="font-body text-slate-600 pr-6">{feat.desc}</p>
                
                <div className="absolute bottom-6 right-6 opacity-40 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5 text-[#1B3A6B]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {[
              { stat: "5.5M", label: "New businesses formed in 2023", context: "Competition is fierce." },
              { stat: "21.6M", label: "Active LLCs in the US", context: "You need to stand out." },
              { stat: "Billions", label: "In federal grants unclaimed", context: "Because businesses aren't ready." }
            ].map((item, i) => (
              <div key={i} className="pt-8 md:pt-0 md:px-12 flex flex-col items-center text-center group cursor-pointer" onClick={() => {}}>
                <div className="font-heading text-5xl font-black text-[#1B3A6B] mb-4 group-hover:scale-110 transition-transform duration-300">{item.stat}</div>
                <div className="font-body text-lg font-medium text-slate-800 mb-4">{item.label}</div>
                <div className="font-body text-sm font-semibold text-[#C9A84C] flex items-center gap-1 group-hover:text-[#D4B663] transition-colors">
                  Why this matters <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-32 px-6 bg-[#1B3A6B] relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#C9A84C] blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your LLC deserves a real foundation.
          </h2>
          <p className="font-body text-xl text-blue-100 mb-12 max-w-2xl">
            Join thousands of business owners who are getting structured, getting funded, and getting contracts.
          </p>
          
          <button 
            onClick={() => {}} 
            className="group w-full max-w-[600px] h-[64px] bg-[#C9A84C] hover:bg-[#D4B663] text-[#1B3A6B] text-xl font-bold rounded-xl transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] flex items-center justify-center gap-3 transform hover:-translate-y-1"
          >
            Sign up free
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
          
          <div className="mt-6 font-body font-medium text-blue-200 flex items-center justify-center gap-3 cursor-pointer hover:text-white transition-colors" onClick={() => {}}>
            <span>No credit card required</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
            <span>Free forever plan</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => {}}>
            <svg height="32" viewBox="0 0 168 48" fill="none" style={{ display: 'block', overflow: 'visible' }}>
              <rect x="2" y="28" width="12" height="12" rx="3" fill="#ffffff"/>
              <rect x="14" y="34" width="12" height="12" rx="3" fill="#C9A84C"/>
              <rect x="26" y="18" width="12" height="12" rx="3" fill="#ffffff"/>
              <rect x="38" y="4" width="12" height="12" rx="3" fill="#C9A84C"/>
              <line x1="60" y1="6" x2="60" y2="42" stroke="#334155" strokeWidth="1"/>
              <text x="70" y="22" className="font-heading" fontSize="15" fontWeight="700" fill="#ffffff">Founded</text>
              <text x="70" y="41" className="font-heading" fontSize="15" fontWeight="700" fill="#C9A84C">Right</text>
            </svg>
          </div>
          <div className="text-slate-400 font-body text-sm flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => {}}>Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => {}}>Terms of Service</span>
            <span>© {new Date().getFullYear()} FoundedRight. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
