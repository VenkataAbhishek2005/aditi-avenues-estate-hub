import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Amenities', href: '/amenities' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'RERA Disclaimer', href: '/rera' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gold p-2 rounded-lg">
                <div className="w-8 h-8 bg-primary-foreground rounded flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">A</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Aditi Avenues</h3>
                <p className="text-sm opacity-90">Crafting Modern Living</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Building dreams with trust, quality, and transparency. Creating modern living spaces in Hyderabad that combine luxury with affordability.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm opacity-90 hover:text-gold hover:opacity-100 transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm opacity-90 hover:text-gold hover:opacity-100 transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-gold" />
                <div className="text-sm opacity-90">
                  <p>Flat No-102, Vishali Nagar</p>
                  <p>Hyderabad, Telangana, India</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold" />
                <span className="text-sm opacity-90">+91 9876543210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold" />
                <span className="text-sm opacity-90">info@aditiavenues.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-90">
              © 2024 Aditi Avenues. All rights reserved.
            </p>
            <p className="text-sm opacity-90 mt-2 md:mt-0">
              RERA Reg. No: P02400004321 | Built with ❤️ in Hyderabad
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;