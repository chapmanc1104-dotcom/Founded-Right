import { Layout } from "@/components/Layout";
import { useGetChecklist } from "@workspace/api-client-react";
import { useLocalChecklist } from "@/hooks/use-local-checklist";
import { motion } from "framer-motion";
import { Check, Target, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/Button";

export default function Checklist() {
  const { data: checklistItems, isLoading, error } = useGetChecklist();
  const { completedItems, toggleItem, resetChecklist } = useLocalChecklist();

  // Group items by category
  const categories = checklistItems?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof checklistItems>) || {};

  // Sort categories and items
  Object.values(categories).forEach(items => items.sort((a, b) => a.order - b.order));

  const totalItems = checklistItems?.length || 0;
  const completedCount = completedItems.size;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Target className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-display font-bold">Launch Checklist</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Follow this comprehensive guide to get your business off the ground. 
            Your progress is saved automatically.
          </p>

          {/* Progress Bar */}
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Progress</span>
                <div className="text-2xl font-bold font-display mt-1">
                  {completedCount} of {totalItems} tasks completed
                </div>
              </div>
              <span className="text-3xl font-display font-bold text-accent">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </header>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Loading your checklist...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-2xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg mb-1">Failed to load checklist</h3>
              <p className="opacity-90">Please try refreshing the page or check your connection.</p>
            </div>
          </div>
        )}

        <div className="space-y-12">
          {Object.entries(categories).map(([category, items], catIndex) => (
            <motion.section 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm">
                  {catIndex + 1}
                </span>
                {category}
              </h2>
              
              <div className="grid gap-4">
                {items.map((item) => {
                  const isChecked = completedItems.has(item.id);
                  return (
                    <motion.div 
                      key={item.id}
                      layout
                      onClick={() => toggleItem(item.id)}
                      className={`group cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                        isChecked 
                          ? "bg-muted/50 border-border/50" 
                          : "bg-white border-border hover:border-primary/30 hover:shadow-md"
                      }`}
                    >
                      <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isChecked 
                          ? "bg-primary border-primary" 
                          : "border-muted-foreground/30 group-hover:border-primary/50"
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-1 transition-colors ${
                          isChecked ? "text-muted-foreground line-through decoration-muted-foreground/30" : "text-foreground"
                        }`}>
                          {item.title}
                        </h3>
                        <p className={`text-sm leading-relaxed ${
                          isChecked ? "text-muted-foreground/70" : "text-muted-foreground"
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>

        {totalItems > 0 && completedCount === totalItems && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl text-center"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
              <Rocket className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-2">You're ready to launch!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Congratulations! You've completed all the essential steps to get your business started. 
              The world is waiting for what you've built.
            </p>
            <Button variant="outline" onClick={resetChecklist}>
              Reset Checklist
            </Button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}

// Needed imports for the checklist
import { Rocket } from "lucide-react";
