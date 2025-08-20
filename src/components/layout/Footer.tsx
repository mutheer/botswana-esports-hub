import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="BESF Logo" className="h-10 w-10" />
              <span className="font-bold text-xl">BESF</span>
            </div>
            <p className="text-background/80 text-sm">
              Botswana Electronic Sports Federation - Promoting and developing esports in Botswana.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-background hover:text-primary" asChild>
                <a href="https://www.facebook.com/profile.php?id=61565692832196" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary" asChild>
                <a href="https://www.tiktok.com/@botswana.esport.p?_t=ZM-8y4e3diPRun&_r=1" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary" asChild>
                <a href="https://www.instagram.com/esportsfed_bw/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-background/80 hover:text-primary transition-smooth">
                  About Us
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/register" className="text-background/80 hover:text-primary transition-smooth">
                    Register
                  </Link>
                </li>
              )}
              <li>
                <Link to="/events" className="text-background/80 hover:text-primary transition-smooth">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-background/80 hover:text-primary transition-smooth">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-background/80 text-sm">botswanaesportsfedera@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-background/80 text-sm">+267 74152137</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-background/80 text-sm">Gaborone, Botswana</span>
              </li>
            </ul>
          </div>


        </div>

        <div className="mt-8 pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-background/60 text-sm">
              © 2024 Botswana Electronic Sports Federation. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-background/60 hover:text-primary text-sm transition-smooth">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-background/60 hover:text-primary text-sm transition-smooth">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;