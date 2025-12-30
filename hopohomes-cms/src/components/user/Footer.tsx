"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  "For Tenants": [
    { label: "Browse Properties", href: "#" },
    { label: "How It Works", href: "#" },
    { label: "Co-Living Spaces", href: "#" },
    { label: "FAQs", href: "#" },
  ],
  "For Owners": [
    { label: "List Your Property", href: "#" },
    { label: "ROI Calculator", href: "#" },
    { label: "Franchise Opportunities", href: "#" },
    { label: "Partner With Us", href: "#" },
  ],
  "Company": [
    { label: "About HOPO", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground" id="contact">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-xl">H</span>
              </div>
              <span className="text-xl font-bold">HOPO<span className="text-accent">Homes</span></span>
            </a>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Dubai's leading managed rental homes network. Fully furnished, ready-to-move-in apartments, villas, and co-living spaces.
            </p>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                <MapPin className="w-4 h-4 text-accent" />
                Dubai, United Arab Emirates
              </a>
              <a href="tel:+971000000000" className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                <Phone className="w-4 h-4 text-accent" />
                +971 00 000 0000
              </a>
              <a href="mailto:info@hopohomes.com" className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                <Mail className="w-4 h-4 text-accent" />
                info@hopohomes.com
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} HOPO Homes. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
