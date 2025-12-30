import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Home, Calculator, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickActions = [
  { icon: Home, label: "Find a property", message: "Help me find a furnished apartment in Dubai Marina" },
  { icon: Calculator, label: "Calculate ROI", message: "I want to calculate my property's ROI" },
  { icon: HelpCircle, label: "How it works", message: "How does HOPO Homes work?" },
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Hi! I'm HOPO's AI Assistant. I can help you find your perfect home or answer questions about our services. How can I assist you today?" 
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Thank you for your message! Our team will get back to you shortly. In the meantime, feel free to browse our featured properties or use our ROI calculator." 
      }]);
    }, 1000);
  };

  const handleQuickAction = (message: string) => {
    setMessages([...messages, { role: "user", content: message }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Great choice! I'm processing your request. Our AI is analyzing the best options for you. A specialist will reach out within 24 hours with personalized recommendations." 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-gold shadow-gold flex items-center justify-center hover:scale-105 transition-transform animate-pulse-gold"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="w-7 h-7 text-accent-foreground" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-gold p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-foreground/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-accent-foreground">HOPO AI Assistant</h3>
                  <p className="text-xs text-accent-foreground/80">Powered by Slaab.ai</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-accent-foreground/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-accent-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === "user" 
                        ? "bg-accent text-accent-foreground rounded-br-md" 
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.message)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80 transition-colors"
                    >
                      <action.icon className="w-3 h-3" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/50"
                />
                <Button 
                  onClick={handleSend}
                  className="btn-primary px-4 rounded-xl"
                  disabled={!input.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
