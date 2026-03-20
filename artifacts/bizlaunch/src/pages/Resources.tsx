import { Layout } from "@/components/Layout";
import { useListResources } from "@workspace/api-client-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, BookOpen, RefreshCw, AlertCircle, Briefcase, Code, Megaphone, Scale } from "lucide-react";

// Helper to map category to an icon
const getCategoryIcon = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes('legal')) return Scale;
  if (normalized.includes('tech') || normalized.includes('dev')) return Code;
  if (normalized.includes('marketing') || normalized.includes('sales')) return Megaphone;
  return Briefcase;
};

export default function Resources() {
  const { data: resources, isLoading, error } = useListResources();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    if (!resources) return ["All"];
    const cats = new Set(resources.map(r => r.category));
    return ["All", ...Array.from(cats)];
  }, [resources]);

  const filteredResources = useMemo(() => {
    if (!resources) return [];
    if (activeCategory === "All") return resources;
    return resources.filter(r => r.category === activeCategory);
  }, [resources, activeCategory]);

  return (
    <Layout>
      <div className="bg-muted/30 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <header className="mb-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 text-secondary mb-6">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Resource Library</h1>
            <p className="text-xl text-muted-foreground">
              Hand-picked tools, templates, and guides to accelerate your business launch.
            </p>
          </header>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">Fetching best resources...</p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-2xl flex items-start gap-4 max-w-2xl mx-auto">
              <AlertCircle className="w-6 h-6 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-1">Failed to load resources</h3>
                <p className="opacity-90">Please try refreshing the page.</p>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                      activeCategory === cat 
                        ? "bg-primary text-white shadow-lg shadow-primary/25" 
                        : "bg-white text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Resource Grid */}
              <motion.div 
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredResources.map((resource) => {
                    const Icon = getCategoryIcon(resource.category);
                    return (
                      <motion.a
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        key={resource.id}
                        href={resource.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {/* In a real app we might use an img if resource.icon is a URL. Fallback to generic icon */}
                            {resource.icon ? (
                              <img src={resource.icon} alt="" className="w-6 h-6 object-contain" />
                            ) : (
                              <Icon className="w-6 h-6" />
                            )}
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                            {resource.category}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-muted-foreground text-sm flex-1 leading-relaxed">
                          {resource.description}
                        </p>
                        
                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Visit Resource</span>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </motion.a>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
              
              {filteredResources.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-lg">No resources found for this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
