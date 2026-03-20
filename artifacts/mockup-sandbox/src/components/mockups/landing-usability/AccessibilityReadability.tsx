import React from 'react';
import { Check } from "lucide-react";

export function AccessibilityReadability() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] selection:bg-[#C9A84C] selection:text-[#0F172A]">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        
        .font-heading {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .font-body {
          font-family: 'Inter', sans-serif;
        }

        /* Simulating focus ring for accessibility variant */
        .btn-focus-ring:focus-visible, .btn-focus-ring:hover {
          outline: 3px solid #1B3A6B;
          outline-offset: 2px;
        }
      `}} />

      {/* Navigation */}
      <nav className="border-b border-[#E2E8F0] bg-white sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-24 flex items-center justify-between">
          <a href="#" className="flex-shrink-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1B3A6B] rounded p-1" aria-label="FoundedRight Home">
            <svg height="36" viewBox="0 0 168 48" fill="none" style={{display: 'block', overflow: 'visible'}}>
              <rect x="2" y="28" width="12" height="12" rx="3" fill="#1B3A6B"/>
              <rect x="14" y="34" width="12" height="12" rx="3" fill="#C9A84C"/>
              <rect x="26" y="18" width="12" height="12" rx="3" fill="#1B3A6B"/>
              <rect x="38" y="4" width="12" height="12" rx="3" fill="#C9A84C"/>
              <line x1="60" y1="6" x2="60" y2="42" stroke="#CBD5E1" strokeWidth="1"/>
              <text x="70" y="22" fontFamily="Plus Jakarta Sans,sans-serif" fontSize="15" fontWeight="700" fill="#1B3A6B">Founded</text>
              <text x="70" y="41" fontFamily="Plus Jakarta Sans,sans-serif" fontSize="15" fontWeight="700" fill="#C9A84C">Right</text>
            </svg>
          </a>
          <div className="flex items-center gap-6">
            <a href="#" className="font-body font-medium text-[18px] text-[#0F172A] hover:text-[#1B3A6B] underline underline-offset-4 py-3 px-4 rounded focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1B3A6B]">
              Sign in
            </a>
            <button className="font-body font-bold text-[18px] bg-[#1B3A6B] text-white py-4 px-8 rounded-md transition-colors hover:bg-[#12284C] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2 shadow-sm">
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#F8FAFC] pt-[140px] pb-[140px] border-b border-[#E2E8F0]">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <h1 className="font-heading text-[56px] leading-[1.2] font-bold text-[#1B3A6B] mb-8 tracking-tight">
            Stop guessing what to do next.
          </h1>
          <p className="font-body text-[22px] leading-[1.8] text-[#0F172A] mb-12 max-w-[800px] mx-auto">
            FoundedRight walks you step by step through everything your LLC needs to get funded, win government contracts, and build a professional presence — all in one place.
          </p>
          <div className="flex flex-col items-center">
            <button className="font-body font-bold text-[20px] bg-[#1B3A6B] text-white py-5 px-10 rounded-md transition-all hover:bg-[#12284C] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2 shadow-md outline outline-3 outline-[#1B3A6B] outline-offset-2">
              Sign up free
            </button>
            <p className="mt-4 text-[16px] text-[#64748B] font-body">Free to start. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-[100px] bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="font-heading text-[56px] font-bold text-[#1B3A6B] mb-2">5.5M</div>
              <div className="font-body text-[18px] leading-[1.6] text-[#0F172A] font-medium">New businesses formed in 2023</div>
            </div>
            <div>
              <div className="font-heading text-[56px] font-bold text-[#1B3A6B] mb-2">21.6M</div>
              <div className="font-body text-[18px] leading-[1.6] text-[#0F172A] font-medium">Active LLCs in the US</div>
            </div>
            <div>
              <div className="font-heading text-[56px] font-bold text-[#1B3A6B] mb-2">Billions</div>
              <div className="font-body text-[18px] leading-[1.6] text-[#0F172A] font-medium">In federal grants go unclaimed yearly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-[140px] bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="mb-12">
            <span className="font-body text-[16px] font-bold tracking-wider uppercase text-[#64748B] mb-4 block">The challenges</span>
            <h2 className="font-heading text-[40px] leading-[1.3] font-bold text-[#1B3A6B]">
              Why building a business feels so difficult
            </h2>
          </div>

          <div className="space-y-12">
            <div className="bg-white p-8 rounded-lg border border-[#E2E8F0] shadow-sm">
              <h3 className="font-heading text-[24px] font-bold text-[#1B3A6B] mb-4 flex items-start gap-4">
                <span className="bg-[#C9A84C] text-[#0F172A] px-3 py-1 rounded-md text-[18px] flex-shrink-0 mt-1">01</span>
                You don't know which steps actually matter for funding
              </h3>
              <p className="font-body text-[18px] leading-[1.8] text-[#0F172A] ml-[68px]">
                There are hundreds of things you could do. Most don't move the needle. Knowing the right 46 steps — in the right order — changes everything.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-[#E2E8F0] shadow-sm">
              <h3 className="font-heading text-[24px] font-bold text-[#1B3A6B] mb-4 flex items-start gap-4">
                <span className="bg-[#C9A84C] text-[#0F172A] px-3 py-1 rounded-md text-[18px] flex-shrink-0 mt-1">02</span>
                Grant and loan applications keep getting rejected or ignored
              </h3>
              <p className="font-body text-[18px] leading-[1.8] text-[#0F172A] ml-[68px]">
                It's not just what you apply for — it's how ready your business looks on paper. Most rejections happen before anyone reads your application.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-[#E2E8F0] shadow-sm">
              <h3 className="font-heading text-[24px] font-bold text-[#1B3A6B] mb-4 flex items-start gap-4">
                <span className="bg-[#C9A84C] text-[#0F172A] px-3 py-1 rounded-md text-[18px] flex-shrink-0 mt-1">03</span>
                Government contracts feel impossible to break into
              </h3>
              <p className="font-body text-[18px] leading-[1.8] text-[#0F172A] ml-[68px]">
                SAM.gov, NAICS codes, capability statements, set-asides — the terminology alone is a barrier. But billions in contracts go to small businesses every year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-[140px] bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="mb-16">
            <span className="font-body text-[16px] font-bold tracking-wider uppercase text-[#64748B] mb-4 block">What you get</span>
            <h2 className="font-heading text-[40px] leading-[1.3] font-bold text-[#1B3A6B]">
              Everything you need in one place
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="flex items-start gap-4">
              <Check className="w-8 h-8 text-[#1B3A6B] flex-shrink-0 mt-1 stroke-[3]" aria-hidden="true" />
              <div>
                <h3 className="font-heading text-[22px] font-bold text-[#0F172A] mb-2">Personalized Setup Checklist</h3>
                <p className="font-body text-[18px] leading-[1.6] text-[#0F172A]">46 exact steps across 8 categories to make your business funding-ready.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Check className="w-8 h-8 text-[#1B3A6B] flex-shrink-0 mt-1 stroke-[3]" aria-hidden="true" />
              <div>
                <h3 className="font-heading text-[22px] font-bold text-[#0F172A] mb-2">AI-Matched Funding</h3>
                <p className="font-body text-[18px] leading-[1.6] text-[#0F172A]">Find grants and loans tailored specifically to your business profile.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Check className="w-8 h-8 text-[#1B3A6B] flex-shrink-0 mt-1 stroke-[3]" aria-hidden="true" />
              <div>
                <h3 className="font-heading text-[22px] font-bold text-[#0F172A] mb-2">NAICS Code Finder</h3>
                <p className="font-body text-[18px] leading-[1.6] text-[#0F172A]">Easily identify the correct classification codes for your industry.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Check className="w-8 h-8 text-[#1B3A6B] flex-shrink-0 mt-1 stroke-[3]" aria-hidden="true" />
              <div>
                <h3 className="font-heading text-[22px] font-bold text-[#0F172A] mb-2">Capability Statement Generator</h3>
                <p className="font-body text-[18px] leading-[1.6] text-[#0F172A]">Create professional documents required for government contracting.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Check className="w-8 h-8 text-[#1B3A6B] flex-shrink-0 mt-1 stroke-[3]" aria-hidden="true" />
              <div>
                <h3 className="font-heading text-[22px] font-bold text-[#0F172A] mb-2">Application Tracker</h3>
                <p className="font-body text-[18px] leading-[1.6] text-[#0F172A]">Keep all your funding and contract applications organized in a single dashboard.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Check className="w-8 h-8 text-[#1B3A6B] flex-shrink-0 mt-1 stroke-[3]" aria-hidden="true" />
              <div>
                <h3 className="font-heading text-[22px] font-bold text-[#0F172A] mb-2">AI Assistant</h3>
                <p className="font-body text-[18px] leading-[1.6] text-[#0F172A]">Get immediate answers to your business structure and compliance questions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-[140px] bg-[#C9A84C] border-b border-[#E2E8F0]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="font-heading text-[48px] leading-[1.2] font-bold text-[#0F172A] mb-8">
            Your LLC deserves a real foundation.
          </h2>
          <p className="font-body text-[22px] leading-[1.8] text-[#0F172A] mb-12 font-medium">
            Join thousands of business owners who are getting structured, getting funded, and getting contracts.
          </p>
          <div className="flex flex-col items-center">
            <button className="font-body font-bold text-[20px] bg-[#1B3A6B] text-white py-5 px-10 rounded-md transition-all hover:bg-[#12284C] focus:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#C9A84C] shadow-lg">
              Sign up free
            </button>
            <p className="mt-4 text-[18px] text-[#0F172A] font-body font-medium">Free to start. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="#" className="focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1B3A6B] rounded p-1" aria-label="FoundedRight Home">
            <svg height="36" viewBox="0 0 168 48" fill="none" style={{display: 'block', overflow: 'visible'}}>
              <rect x="2" y="28" width="12" height="12" rx="3" fill="#1B3A6B"/>
              <rect x="14" y="34" width="12" height="12" rx="3" fill="#C9A84C"/>
              <rect x="26" y="18" width="12" height="12" rx="3" fill="#1B3A6B"/>
              <rect x="38" y="4" width="12" height="12" rx="3" fill="#C9A84C"/>
              <line x1="60" y1="6" x2="60" y2="42" stroke="#CBD5E1" strokeWidth="1"/>
              <text x="70" y="22" fontFamily="Plus Jakarta Sans,sans-serif" fontSize="15" fontWeight="700" fill="#1B3A6B">Founded</text>
              <text x="70" y="41" fontFamily="Plus Jakarta Sans,sans-serif" fontSize="15" fontWeight="700" fill="#C9A84C">Right</text>
            </svg>
          </a>
          <p className="font-body text-[16px] text-[#64748B]">
            &copy; {new Date().getFullYear()} FoundedRight. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
