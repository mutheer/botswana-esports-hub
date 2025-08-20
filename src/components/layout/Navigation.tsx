import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, signOut, isAdmin } = useAuth();

  const allNavigationItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Register", href: "/register" },
    { name: "Players", href: "/database" },
    { name: "Games", href: "/games" },
    { name: "Events", href: "/events" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  // Filter out Register page for unauthenticated users
  const navigationItems = isAuthenticated 
    ? allNavigationItems 
    : allNavigationItems.filter(item => item.name !== "Register");

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 py-2">
              <img src="/logo.svg" alt="BESF Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
              <span className="font-bold text-lg sm:text-xl bg-gradient-primary bg-clip-text text-transparent">
                BESF
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-smooth ${
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin" className="flex items-center space-x-1">
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={signOut} className="flex items-center space-x-1">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button variant="hero" size="sm" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-10 w-10 touch-manipulation"
            >
              {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-3 pt-3 pb-4 space-y-2 sm:px-4 bg-card rounded-lg shadow-card mt-2 mx-3 sm:mx-0">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 rounded-md text-base font-medium transition-smooth touch-manipulation ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-accent active:bg-accent/80"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 py-3 border-t border-border/50 mt-3">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Button variant="ghost" size="sm" className="w-full justify-start h-11 touch-manipulation" asChild>
                      <Link to="/profile" className="flex items-center space-x-3">
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" className="w-full justify-start h-11 touch-manipulation" asChild>
                        <Link to="/admin" className="flex items-center space-x-3">
                          <Shield className="h-5 w-5" />
                          <span>Admin</span>
                        </Link>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start h-11 touch-manipulation" 
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <span>Logout</span>
                    </Button>
                  </div>
                ) : (
                  <Button variant="hero" size="sm" className="w-full h-11 touch-manipulation" asChild>
                    <Link to="/auth">Login</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;