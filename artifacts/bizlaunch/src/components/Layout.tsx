import { Link, useLocation } from "wouter";
import { Rocket, Target, BookOpen, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/checklist", label: "Launch Checklist", icon: Target },
    { href: "/resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "py-3 glass-panel" : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all group-hover:scale-105">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              BizLaunch
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <Link href="/checklist">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-border shadow-xl p-4 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-4 rounded-xl font-medium ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-24">
        {children}
      </main>

      <footer className="bg-white border-t border-border mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl text-foreground">BizLaunch</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Empowering the next generation of founders.
          </p>
        </div>
      </footer>
    </div>
  );
}
