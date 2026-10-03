import React from 'react';
import { Map, Mail, Linkedin, Github, CircleUser } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Screenshots', href: '#screenshots' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Contact', href: 'mailto:unalone.app@gmail.com' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: CircleUser, label: 'Portfolio', href: 'https://omkar-pansare.vercel.app/' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/omkar-pansare-3b8a91292' },
    { icon: Github, label: 'GitHub', href: 'https://github.com/Omkar-56/' },
    { icon: Mail, label: 'Email', href: 'mailto:unalone.app@gmail.com' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-10 sm:py-12 border-b border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                  <Map size={16} className="text-slate-900" />
                </div>
                <span className="font-bold text-base">Unalone</span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                Meet people near you. Find spontaneous meetups, create plans, and build genuine connections in your community.
              </p>
              <div className="flex gap-2.5 mt-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.label}
                      className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links */}
            {sections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-white text-xs sm:text-sm mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <p>&copy; {currentYear} Unalone. All rights reserved.</p>
          <p>Built for spontaneous connections.</p>
        </div>
      </div>
    </footer>
  );
}
