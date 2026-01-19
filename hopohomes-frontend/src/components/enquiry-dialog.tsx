"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnquiryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
    propertyTitle: string;
}

export function EnquiryDialog({ isOpen, onClose, propertyId, propertyTitle }: EnquiryDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    propertyId: propertyId,
                    propertyTitle: propertyTitle,
                    type: 'tenant_enquiry'
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to submit enquiry');
            }

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({ name: '', email: '', phone: '', message: '' });
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            // Optionally set error state here to show in UI
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={`
                            fixed z-[101] bg-background overflow-hidden flex flex-col
                            
                            /* Mobile Styles (Default) - Bottom Sheet */
                            bottom-0 left-0 right-0 w-full rounded-t-3xl border-t border-border shadow-2xl max-h-[90vh]
                            
                            /* Desktop Styles (md+) - Centered Modal */
                            md:bottom-auto md:right-auto md:left-1/2 md:top-1/2 
                            md:w-full md:max-w-md md:rounded-2xl md:border md:shadow-xl md:max-h-[85vh]
                            /* Transform handled by motion animate props for centering on desktop */
                        `}
                    >
                        {/* Mobile Handle */}
                        <div className="md:hidden w-full flex items-center justify-center pt-3 pb-1" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-muted rounded-full"></div>
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold">Reserve Property</h2>
                                <p className="text-xs text-muted-foreground mt-0.5 text-ellipsis overflow-hidden whitespace-nowrap max-w-[250px] md:max-w-[300px]">
                                    {propertyTitle}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 bg-secondary/50 hover:bg-secondary rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-foreground/70" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 overflow-y-auto flex-1 overscroll-contain">
                            {isSuccess ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-600 mb-1">Enquiry Sent!</h3>
                                        <p className="text-muted-foreground text-sm">We'll get back to you shortly.</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground ml-1">Full Name</label>
                                        <input
                                            id="name"
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground ml-1">Email Address</label>
                                        <input
                                            id="email"
                                            required
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground ml-1">Phone Number</label>
                                        <input
                                            id="phone"
                                            required
                                            type="tel"
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                                            placeholder="+971 50 123 4567"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground ml-1">Message (Optional)</label>
                                        <textarea
                                            id="message"
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm font-medium"
                                            placeholder="I'm interested in this property..."
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full mt-2 h-12 text-base rounded-full font-bold shadow-lg shadow-primary/20"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Enquiry'
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Footer */}
                        {!isSuccess && (
                            <div className="p-4 bg-secondary/10 text-center text-[10px] text-muted-foreground border-t border-border/50 shrink-0 pb-8 md:pb-4 safe-area-bottom">
                                By submitting, you agree to our Terms of Service and Privacy Policy.
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
