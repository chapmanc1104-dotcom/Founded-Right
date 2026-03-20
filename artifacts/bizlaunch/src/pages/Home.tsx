import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap, Rocket, Star } from "lucide-react";
import { Button } from "@/components/Button";
import { Layout } from "@/components/Layout";

export default function Home() {
  const features = [
    {
      icon: CheckCircle2,
      title: "Interactive Checklist",
      description: "Don't miss a step. From legal formation to your first marketing campaign.",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: BookOpen,
      title: "Curated Resources",
      description: "Access the best tools, guides, and templates used by successful founders.",
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      icon: Zap,
      title: "Actionable Insights",
      description: "Cut through the noise and focus entirely on what drives growth.",
      color: "text-accent",
      bg: "bg-accent/10"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 shadow-sm mb-6">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-sm font-semibold text-primary">The Ultimate Founder's Toolkit</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
                Turn your idea into a <span className="text-gradient">reality.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                BizLaunch gives you the step-by-step roadmap and curated resources you need to build, launch, and scale your dream business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/checklist">
                  <Button size="lg" className="w-full sm:w-auto gap-2 group">
                    Start Your Launch
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Resources
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <img 
                src={`${import.meta.env.BASE_URL}images/hero-illustration.png`}
                alt="Rocket Launch Illustration"
                className="w-full h-auto object-contain drop-shadow-2xl animate-float"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-muted-foreground">We've distilled the complex process of starting a business into clear, actionable steps and powerful resources.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background rounded-3xl p-8 border border-border/50 hover:shadow-xl hover:border-border transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/feature-bg.png`}
            alt="Abstract Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Rocket className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready for liftoff?</h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join thousands of entrepreneurs who have launched their businesses with our comprehensive toolkit.
          </p>
          <Link href="/checklist">
            <Button size="lg" className="gap-2 group">
              Start Your Launch Checklist
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Custom Keyframes for floating animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </Layout>
  );
}

// Ensure the BookOpen import matches what we need for icons
import { BookOpen } from "lucide-react";
