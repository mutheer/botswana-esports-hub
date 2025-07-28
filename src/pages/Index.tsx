import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, GamepadIcon, ArrowRight, Star } from "lucide-react";
import Layout from "@/components/layout/Layout";
import heroImage from "@/assets/hero-esports.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-background">
            Welcome to
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              BESF
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-background/90 max-w-2xl mx-auto">
            Botswana Electronic Sports Federation - Uniting gamers, promoting esports, and building the future of competitive gaming in Botswana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">
                Register Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-background/10 border-background/30 text-background hover:bg-background/20" asChild>
              <Link to="/database">View Gamers Database</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">500+</h3>
              <p className="text-muted-foreground">Registered Gamers</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <GamepadIcon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">9</h3>
              <p className="text-muted-foreground">Supported Games</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">25+</h3>
              <p className="text-muted-foreground">Tournaments Hosted</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Calendar className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">12</h3>
              <p className="text-muted-foreground">Monthly Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News/Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest News & Events</h2>
            <p className="text-xl text-muted-foreground">Stay updated with the latest happenings in Botswana esports</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured Event Card */}
            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-gaming-accent text-white">Upcoming Event</Badge>
                <CardTitle>VALORANT Championship 2024</CardTitle>
                <CardDescription>
                  Join Botswana's biggest VALORANT tournament with a prize pool of P50,000
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">December 15, 2024</span>
                  <Button variant="gaming" size="sm" asChild>
                    <Link to="/events">Register</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* News Article Card */}
            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary text-primary-foreground">News</Badge>
                <CardTitle>BESF Partners with IESF</CardTitle>
                <CardDescription>
                  Botswana officially joins the International Esports Federation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">3 days ago</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/news">Read More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Success Story Card */}
            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-success text-white">Success Story</Badge>
                <CardTitle>Botswana Team Wins Regional</CardTitle>
                <CardDescription>
                  Local CS:GO team "Desert Eagles" claims victory in SADC Championship
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">1 week ago</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/news">Learn More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-background">
            Ready to Join the Community?
          </h2>
          <p className="text-xl mb-8 text-background/90">
            Register today and become part of Botswana's growing esports ecosystem
          </p>
          <Button variant="hero" size="lg" className="bg-background text-primary hover:bg-background/90" asChild>
            <Link to="/register">
              <Star className="mr-2 h-5 w-5" />
              Get Started Now
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
