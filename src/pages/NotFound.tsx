import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-card">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8 text-primary text-9xl font-bold">404</div>
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Return to Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
