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
            Join Botswana's
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Esports Future
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-background/90 max-w-2xl mx-auto">
            Be part of the official launch of Botswana Electronic Sports Federation. Register as a gamer and help us build the nation's first organized esports community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">
                Register as a Gamer <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-background/10 border-background/30 text-background hover:bg-background/20" asChild>
              <Link to="/database">Browse Gamer Profiles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2 sm:mb-4">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">20</h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Active Members</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2 sm:mb-4">
                <GamepadIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">9</h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Supported Games</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2 sm:mb-4">
                <Trophy className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">Oct 2024</h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Officially Registered</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2 sm:mb-4">
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">2025</h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">First Tournament Year</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Register Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Join the Foundation?</h2>
            <p className="text-xl text-muted-foreground">Be a founding member of Botswana's esports revolution</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center shadow-card hover:shadow-elegant transition-spring">
              <CardHeader>
                <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Founding Member Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Be recognized as a founding member of BESF when we officially launch. Help shape the future of esports in Botswana.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-card hover:shadow-elegant transition-spring">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Future Tournament Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Get priority registration for our upcoming tournaments and events when we launch our competitive programs in 2025.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-card hover:shadow-elegant transition-spring">
              <CardHeader>
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Global Representation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Represent Botswana in international competitions through our partnerships with IESF and Global Esports Federation.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="gaming" size="lg" asChild>
              <Link to="/register">
                Become a Founding Member <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured News/Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Foundation Updates</h2>
            <p className="text-xl text-muted-foreground">Latest news from BESF as we prepare for our official launch</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured Event Card */}
            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-gaming-accent text-white">Coming Soon</Badge>
                <CardTitle>Official BESF Launch Event</CardTitle>
                <CardDescription>
                  Join us for the official launch of Botswana Electronic Sports Federation in 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Early 2025</span>
                  <Button variant="gaming" size="sm" asChild>
                    <Link to="/events">Learn More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* News Article Card */}
            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary text-primary-foreground">News</Badge>
                <CardTitle>BESF Joins International Bodies</CardTitle>
                <CardDescription>
                  Botswana officially affiliated with IESF and Global Esports Federation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">October 2024</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/news">Read More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Foundation Story Card */}
            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-success text-white">Foundation</Badge>
                <CardTitle>Building Botswana's Esports Future</CardTitle>
                <CardDescription>
                  Learn about our mission to promote youth empowerment through gaming
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Our Vision</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/about">Learn More</Link>
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
            Ready to Shape Botswana's Esports Future?
          </h2>
          <p className="text-xl mb-8 text-background/90">
            Join BESF as a founding member and help us build the nation's first organized esports ecosystem. Register your games and be part of history.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="bg-background text-primary hover:bg-background/90" asChild>
              <Link to="/register">
                <GamepadIcon className="mr-2 h-5 w-5" />
                Become a Founding Member
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-background/10 border-background/30 text-background hover:bg-background/20" asChild>
              <Link to="/database">
                <Users className="mr-2 h-5 w-5" />
                View Member Directory
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
