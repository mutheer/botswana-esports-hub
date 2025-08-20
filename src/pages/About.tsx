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
                  The mission of BESF is to promote, regulate, and support the development of esports in Botswana. 
                  We raise national awareness about the opportunities within the esports industry, foster partnerships 
                  that enhance digital literacy and skills among Botswana's youth, create structured pathways for careers 
                  in esports and related digital fields, and ensure inclusivity, fair play, and national representation 
                  in regional and global esports events.
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
                  To be the leading catalyst for the growth, professionalization, and recognition of esports 
                  in Botswana, while promoting youth empowerment, digital inclusion, and innovation through gaming.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Foundation Story</h2>
            <p className="text-xl text-muted-foreground">
              The establishment of Botswana's first esports federation
            </p>
          </div>

          <div className="space-y-8">
            <Card className="shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Badge className="bg-primary text-primary-foreground mt-1">Oct 2024</Badge>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Official Registration</h3>
                    <p className="text-muted-foreground">
                      Botswana Electronic Sports Federation was officially registered as the national 
                      governing body for esports development and promotion in Botswana. The federation 
                      was formed with a 7-member Executive Committee and 20 founding members, committed 
                      to building a structured and inclusive esports ecosystem.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Badge className="bg-gaming-accent text-white mt-1">2024</Badge>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">International Affiliations</h3>
                    <p className="text-muted-foreground">
                      BESF established official partnerships with the International Esports Federation 
                      (IESF) and Global Esports Federation (GEF), positioning Botswana within the global 
                      esports community and opening pathways for international competition and representation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Badge className="bg-success text-white mt-1">2025</Badge>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Launch Preparation</h3>
                    <p className="text-muted-foreground">
                      BESF is preparing for its official launch event, which will introduce the federation 
                      to stakeholders and the public, while establishing partnerships with government bodies 
                      including the Botswana National Sports Commission and Ministry of Education.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Future Programs</h2>
            <p className="text-xl text-muted-foreground">
              Planned initiatives for Botswana's esports development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Official Launch Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Host BESF's official launch to introduce the federation, share our vision, 
                  and engage stakeholders in building Botswana's esports future.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Youth Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Target Botswana's 450,000 young people aged 10-24 with digital skills training, 
                  esports education, and career pathway development programs.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>International Competition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Represent Botswana in global esports competitions through our partnerships 
                  with IESF and Global Esports Federation.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>National Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Work with government bodies including BNSC, BOC, and various ministries 
                  to establish esports as a recognized sport in Botswana.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Educational Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Collaborate with schools and tertiary institutions to introduce esports 
                  clubs, digital literacy programs, and gaming-based STEM education.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
              <CardHeader className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Career Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Create opportunities in esports roles including professional gaming, coaching, 
                  shoutcasting, content creation, and game development.
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