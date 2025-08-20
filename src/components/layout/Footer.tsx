import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="BESF Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
              <span className="font-bold text-lg sm:text-xl">BESF</span>
            </div>
            <p className="text-background/80 text-sm sm:text-base max-w-sm">
              Botswana Electronic Sports Federation - Promoting and developing esports in Botswana.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button variant="ghost" size="icon" className="text-background hover:text-primary touch-manipulation h-10 w-10 sm:h-12 sm:w-12" asChild>
                <a href="https://www.facebook.com/profile.php?id=61565692832196" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary touch-manipulation h-10 w-10 sm:h-12 sm:w-12" asChild>
                <a href="https://www.tiktok.com/@botswana.esport.p?_t=ZM-8y4e3diPRun&_r=1" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary touch-manipulation h-10 w-10 sm:h-12 sm:w-12" asChild>
                <a href="https://www.instagram.com/esportsfed_bw/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary touch-manipulation h-10 w-10 sm:h-12 sm:w-12" asChild>
                <a href="https://chat.whatsapp.com/IadgIVUcL9cLeEPS2Lb5cj" target="_blank" rel="noopener noreferrer">
                  <img src="/whatsapp.svg" alt="WhatsApp" className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/about" className="text-background/80 hover:text-primary transition-smooth text-sm sm:text-base block py-1 touch-manipulation">
                  About Us
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/register" className="text-background/80 hover:text-primary transition-smooth text-sm sm:text-base block py-1 touch-manipulation">
                    Register
                  </Link>
                </li>
              )}
              <li>
                <Link to="/events" className="text-background/80 hover:text-primary transition-smooth text-sm sm:text-base block py-1 touch-manipulation">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-background/80 hover:text-primary transition-smooth text-sm sm:text-base block py-1 touch-manipulation">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Contact Info</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-background/80 text-sm sm:text-base break-all">botswanaesportsfedera@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-background/80 text-sm sm:text-base">+267 74152137</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-background/80 text-sm sm:text-base">Gaborone, Botswana</span>
              </li>
            </ul>
          </div>


        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-background/20">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-background/60 text-xs sm:text-sm text-center sm:text-left">
              © 2024 Botswana Electronic Sports Federation. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
              <Link to="/privacy" className="text-background/60 hover:text-primary text-xs sm:text-sm transition-smooth touch-manipulation py-1">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-background/60 hover:text-primary text-xs sm:text-sm transition-smooth touch-manipulation py-1">
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