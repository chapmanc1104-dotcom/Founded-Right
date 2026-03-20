import React from "react";
import { ArrowRight, CheckCircle2, ChevronRight, CheckSquare, Sparkles, Search, FileText, LayoutList, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InfoHierarchy() {
  return (
    <div className="min-h-screen bg-white text-[#475569] font-sans selection:bg-[#1B3A6B] selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        
        .font-heading {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .font-body {
          font-family: 'Inter', sans-serif;
        }
      `}} />

      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <a href="#" onClick={(e) => e.preventDefault()} className="block">
            <svg height="36" viewBox="0 0 168 48" fill="none" style={{ display: 'block', overflow: 'visible' }}>
              <rect x="2" y="28" width="12" height="12" rx="3" fill="#1B3A6B"/>
              <rect x="14" y="34" width="12" height="12" rx="3" fill="#C9A84C"/>
              <rect x="26" y="18" width="12" height="12" rx="3" fill="#1B3A6B"/>
              <rect x="38" y="4" width="12" height="12" rx="3" fill="#C9A84C"/>
              <line x1="60" y1="6" x2="60" y2="42" stroke="#CBD5E1" strokeWidth="1"/>
              <text x="70" y="22" fontFamily="Plus Jakarta Sans,sans-serif" fontSize="15" fontWeight="700" fill="#1B3A6B">Founded</text>
              <text x="70" y="41" fontFamily="Plus Jakarta Sans,sans-serif" fontSize="15" fontWeight="700" fill="#C9A84C">Right</text>
            </svg>
          </a>
          <div className="flex items-center gap-8">
            <a href="#" onClick={(e) => e.preventDefault()} className="text-[16px] font-medium text-[#475569] hover:text-[#1B3A6B] transition-colors">
              Sign in
            </a>
            <Button 
              onClick={() => {}} 
              className="bg-[#1B3A6B] hover:bg-[#C9A84C] text-white h-12 px-8 rounded-none font-medium text-[16px] transition-colors font-body"
            >
              Sign up free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-40 px-6 max-w-5xl mx-auto">
        <div className="space-y-12">
          <h1 className="font-heading text-[80px] leading-[1.05] font-bold text-[#1B3A6B] tracking-tight">
            Stop guessing what to do next.
          </h1>
          <p className="font-body text-[24px] leading-relaxed text-[#475569] max-w-3xl">
            FoundedRight walks you step by step through everything your LLC needs to get funded, win government contracts, and build a professional presence — all in one place.
          </p>
          <div className="pt-4">
            <Button 
              onClick={() => {}} 
              className="bg-[#1B3A6B] hover:bg-[#C9A84C] text-white h-14 px-10 rounded-none font-medium text-[18px] transition-colors font-body flex items-center gap-3"
            >
              Sign up free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-6 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-24">
            <span className="block font-heading text-[14px] font-bold tracking-[0.2em] text-[#C9A84C] uppercase mb-6">
              01 / The Challenge
            </span>
            <h2 className="font-heading text-[48px] leading-tight font-bold text-[#1B3A6B] tracking-tight">
              Why most small businesses stall out.
            </h2>
          </div>

          <div className="space-y-24">
            {/* Pain Point 1 */}
            <div className="flex gap-12 group">
              <div className="font-heading text-[72px] leading-none font-bold text-[#CBD5E1] group-hover:text-[#1B3A6B] transition-colors">
                01
              </div>
              <div className="space-y-4 pt-2">
                <h3 className="font-heading text-[28px] font-bold text-[#1B3A6B] leading-snug">
                  You don't know which steps actually matter for funding.
                </h3>
                <p className="font-body text-[18px] leading-relaxed text-[#475569]">
                  There are hundreds of things you could do. Most don't move the needle. Knowing the right 46 steps — in the right order — changes everything.
                </p>
              </div>
            </div>

            {/* Pain Point 2 */}
            <div className="flex gap-12 group">
              <div className="font-heading text-[72px] leading-none font-bold text-[#CBD5E1] group-hover:text-[#1B3A6B] transition-colors">
                02
              </div>
              <div className="space-y-4 pt-2">
                <h3 className="font-heading text-[28px] font-bold text-[#1B3A6B] leading-snug">
                  Grant and loan applications keep getting rejected or ignored.
                </h3>
                <p className="font-body text-[18px] leading-relaxed text-[#475569]">
                  It's not just what you apply for — it's how ready your business looks on paper. Most rejections happen before anyone reads your application.
                </p>
              </div>
            </div>

            {/* Pain Point 3 */}
            <div className="flex gap-12 group">
              <div className="font-heading text-[72px] leading-none font-bold text-[#CBD5E1] group-hover:text-[#1B3A6B] transition-colors">
                03
              </div>
              <div className="space-y-4 pt-2">
                <h3 className="font-heading text-[28px] font-bold text-[#1B3A6B] leading-snug">
                  Government contracts feel impossible to break into.
                </h3>
                <p className="font-body text-[18px] leading-relaxed text-[#475569]">
                  SAM.gov, NAICS codes, capability statements, set-asides — the terminology alone is a barrier. But billions in contracts go to small businesses every year.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-24 max-w-3xl">
            <span className="block font-heading text-[14px] font-bold tracking-[0.2em] text-[#C9A84C] uppercase mb-6">
              02 / The Solution
            </span>
            <h2 className="font-heading text-[48px] leading-tight font-bold text-[#1B3A6B] tracking-tight">
              A structured path to becoming contract and capital ready.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-[#F8FAFC] text-[#1B3A6B]">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-[22px] font-bold text-[#1B3A6B]">Personalized Setup Checklist</h3>
              </div>
              <p className="font-body text-[16px] leading-relaxed text-[#475569] pl-14">
                Follow a guided sequence of 46 steps across 8 categories, ensuring your business structure is flawless from day one.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-[#F8FAFC] text-[#1B3A6B]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-[22px] font-bold text-[#1B3A6B]">AI-Matched Funding Opportunities</h3>
              </div>
              <p className="font-body text-[16px] leading-relaxed text-[#475569] pl-14">
                Stop manually searching for grants. Our system automatically pairs your LLC profile with relevant federal, state, and private funding.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-[#F8FAFC] text-[#1B3A6B]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-[22px] font-bold text-[#1B3A6B]">NAICS Code Finder</h3>
              </div>
              <p className="font-body text-[16px] leading-relaxed text-[#475569] pl-14">
                Easily identify the exact government industry codes that apply to your business, unlocking access to targeted contracts.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-[#F8FAFC] text-[#1B3A6B]">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-[22px] font-bold text-[#1B3A6B]">Capability Statement Generator</h3>
              </div>
              <p className="font-body text-[16px] leading-relaxed text-[#475569] pl-14">
                Build a professional, government-ready capability statement in minutes, not days, putting your best foot forward to procurement officers.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-[#F8FAFC] text-[#1B3A6B]">
                  <LayoutList className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-[22px] font-bold text-[#1B3A6B]">Application Tracker</h3>
              </div>
              <p className="font-body text-[16px] leading-relaxed text-[#475569] pl-14">
                Keep all your grant and contract applications organized in one dashboard. Never miss a deadline or follow-up again.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-[#F8FAFC] text-[#1B3A6B]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-[22px] font-bold text-[#1B3A6B]">AI Assistant</h3>
              </div>
              <p className="font-body text-[16px] leading-relaxed text-[#475569] pl-14">
                Get instant answers to complex compliance, registration, and business strategy questions from an AI trained on government contracting rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-40 px-6 bg-[#1B3A6B] text-white text-center">
        <div className="max-w-6xl mx-auto">
          <span className="block font-heading text-[14px] font-bold tracking-[0.2em] text-[#C9A84C] uppercase mb-20">
            03 / The Opportunity
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            <div className="space-y-6">
              <div className="font-heading text-[80px] font-bold leading-none tracking-tight">
                5.5M
              </div>
              <p className="font-body text-[18px] text-white/80 max-w-xs mx-auto">
                new businesses formed in 2023.
              </p>
            </div>
            <div className="space-y-6">
              <div className="font-heading text-[80px] font-bold leading-none tracking-tight">
                21.6M
              </div>
              <p className="font-body text-[18px] text-white/80 max-w-xs mx-auto">
                active LLCs in the US right now.
              </p>
            </div>
            <div className="space-y-6">
              <div className="font-heading text-[80px] font-bold leading-none tracking-tight">
                Billions
              </div>
              <p className="font-body text-[18px] text-white/80 max-w-xs mx-auto">
                in federal grants go unclaimed every year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-[#F8FAFC] text-center">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="font-heading text-[56px] leading-tight font-bold text-[#1B3A6B] tracking-tight">
            Your LLC deserves a real foundation.
          </h2>
          <p className="font-body text-[20px] leading-relaxed text-[#475569]">
            Join thousands of business owners who are getting structured, getting funded, and getting contracts.
          </p>
          <div className="pt-8">
            <Button 
              onClick={() => {}} 
              className="bg-[#1B3A6B] hover:bg-[#C9A84C] text-white h-16 px-12 rounded-none font-medium text-[18px] transition-colors font-body"
            >
              Sign up free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <svg height="28" viewBox="0 0 168 48" fill="none" style={{ display: 'block', overflow: 'visible' }}>
            <rect x="2" y="28" width="12" height="12" rx="3" fill="#1B3A6B"/>
            <rect x="14" y="34" width="12" height="12" rx="3" fill="#C9A84C"/>
            <rect x="26" y="18" width="12" height="12" rx="3" fill="#1B3A6B"/>
            <rect x="38" y="4" width="12" height="12" rx="3" fill="#C9A84C"/>
            <line x1="60" y1="6" x2="60" y2="42" stroke="#CBD5E1" strokeWidth="1"/>
            <text x="70" y="22" fontFamily="Plus Jakarta Sans,sans-serif" fontSize="15" fontWeight="700" fill="#1B3A6B">Founded</text>
            <text x="70" y="41" fontFamily="Plus Jakarta Sans,sans-serif" fontSize="15" fontWeight="700" fill="#C9A84C">Right</text>
          </svg>
          <div className="text-[14px] text-[#475569] font-body">
            © {new Date().getFullYear()} FoundedRight. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
