import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Trophy, Users, Globe, Zap } from "lucide-react";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-background">
            About BESF
          </h1>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            The Botswana Electronic Sports Federation is the official governing body for 
            esports in Botswana, dedicated to promoting and developing competitive gaming 
            across the nation.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To promote and develop esports in Botswana by creating opportunities for 
                  gamers to compete, learn, and excel. We strive to build a thriving esports 
                  ecosystem that nurtures talent, promotes inclusivity, and positions 
                  Botswana as a competitive force in the global esports arena.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To establish Botswana as an esports hub in Africa, where gaming talent 
                  is recognized, supported, and celebrated. We envision a future where 
                  Botswanan gamers compete on the world stage and inspire the next 
                  generation of esports athletes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gradient-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
            <p className="text-xl text-muted-foreground">
              The journey of esports development in Botswana
            </p>
          </div>

          <div className="space-y-8">
            <Card className="shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Badge className="bg-primary text-primary-foreground mt-1">2024</Badge>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">IESF Membership</h3>
                    <p className="text-muted-foreground">
                      Botswana Electronic Sports Federation officially joins the International 
                      Esports Federation (IESF), marking our entry into the global esports community 
                      and opening doors for international competition opportunities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Badge className="bg-gaming-accent text-white mt-1">2023</Badge>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Foundation</h3>
                    <p className="text-muted-foreground">
                      BESF was established by passionate gamers and industry professionals who 
                      recognized the need for organized esports development in Botswana. Our 
                      founders came together with a shared vision of creating a professional 
                      gaming ecosystem.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Badge className="bg-success text-white mt-1">2022</Badge>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Community Growth</h3>
                    <p className="text-muted-foreground">
                      The esports community in Botswana began to take shape with the formation 
                      of competitive teams and the organization of local tournaments. This 
                      grassroots movement laid the foundation for what would become BESF.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-xl text-muted-foreground">
              Our key initiatives and activities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Tournaments & Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Organize and host competitive tournaments across multiple gaming titles, 
                  providing platforms for gamers to showcase their skills and compete for prizes.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Community Building</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Foster connections between gamers, create networking opportunities, and 
                  build a supportive community that helps players grow and develop their skills.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>International Representation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Represent Botswana in international esports competitions and work with 
                  global organizations to promote Botswanan talent on the world stage.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Player Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Provide training programs, coaching opportunities, and resources to help 
                  gamers improve their skills and reach their competitive potential.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Industry Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Build relationships with gaming companies, sponsors, and other stakeholders 
                  to create opportunities and support for the esports ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Advocacy & Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Advocate for esports recognition as a legitimate sport and work to establish 
                  policies and frameworks that support the industry's growth in Botswana.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;