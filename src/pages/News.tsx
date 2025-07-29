import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  featured: boolean;
}

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const newsArticles: NewsArticle[] = [
    {
      id: "1",
      title: "BESF Partners with International Esports Federation",
      description: "Botswana Electronic Sports Federation officially joins the International Esports Federation (IESF), marking our entry into the global esports community.",
      date: "June 15, 2024",
      category: "Partnership",
      image: "/news/iesf-partnership.jpg",
      featured: true
    },
    {
      id: "2",
      title: "Botswana Team Wins Regional CS:GO Championship",
      description: "Local CS:GO team 'Desert Eagles' claims victory in the SADC Championship, bringing home the trophy and P100,000 prize money.",
      date: "May 28, 2024",
      category: "Success Story",
      image: "/news/csgo-victory.jpg",
      featured: true
    },
    {
      id: "3",
      title: "BESF Secures Major Sponsorship Deal",
      description: "A leading telecommunications company has signed on as the main sponsor for BESF activities for the next three years.",
      date: "May 10, 2024",
      category: "Sponsorship",
      image: "/news/sponsorship-deal.jpg",
      featured: true
    },
    {
      id: "4",
      title: "New Gaming Center Opens in Gaborone",
      description: "State-of-the-art gaming facility opens its doors, offering high-end PCs and a venue for BESF tournaments.",
      date: "April 22, 2024",
      category: "Facilities",
      image: "/news/gaming-center.jpg",
      featured: false
    },
    {
      id: "5",
      title: "BESF Launches Youth Development Program",
      description: "New initiative aims to nurture young gaming talent through coaching, mentorship, and structured competition.",
      date: "April 15, 2024",
      category: "Development",
      image: "/news/youth-program.jpg",
      featured: false
    },
    {
      id: "6",
      title: "Botswana to Host African Esports Championship",
      description: "BESF announces that Gaborone will host the upcoming African Esports Championship in 2025.",
      date: "March 30, 2024",
      category: "Events",
      image: "/news/african-championship.jpg",
      featured: false
    },
    {
      id: "7",
      title: "Local Schools Embrace Esports in Education",
      description: "Several secondary schools in Botswana are introducing esports as part of their extracurricular activities.",
      date: "March 15, 2024",
      category: "Education",
      image: "/news/schools-esports.jpg",
      featured: false
    },
    {
      id: "8",
      title: "BESF Announces New Board Members",
      description: "The federation welcomes three new board members with extensive experience in sports management and technology.",
      date: "February 28, 2024",
      category: "Organization",
      image: "/news/board-members.jpg",
      featured: false
    },
  ];

  const filteredNews = newsArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredNews = filteredNews.filter(article => article.featured);
  const regularNews = filteredNews.filter(article => !article.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-background">
            News & Updates
          </h1>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            Stay informed about the latest developments in Botswana's esports scene,
            from tournament results to community initiatives and industry partnerships.
          </p>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="mb-12">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search news..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Featured News */}
          {featuredNews.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Featured News</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredNews.map((article) => (
                  <Card key={article.id} className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
                    <div className="h-48 bg-muted rounded-t-lg overflow-hidden">
                      <div 
                        className="w-full h-full bg-cover bg-center" 
                        style={{ backgroundImage: `url(${article.image})` }}
                      >
                        <div className="w-full h-full flex items-end p-4 bg-gradient-to-t from-foreground/80 to-transparent">
                          <Badge className="bg-primary text-primary-foreground">{article.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{article.date}</span>
                      </div>
                      <CardTitle>{article.title}</CardTitle>
                      <CardDescription>{article.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/news/${article.id}`}>
                          Read Full Story <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular News */}
          <div>
            <h2 className="text-3xl font-bold mb-8">All News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {regularNews.map((article) => (
                <Card key={article.id} className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
                  <div className="h-40 bg-muted rounded-t-lg overflow-hidden">
                    <div 
                      className="w-full h-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${article.image})` }}
                    >
                      <div className="w-full h-full flex items-end p-4 bg-gradient-to-t from-foreground/80 to-transparent">
                        <Badge className="bg-primary text-primary-foreground">{article.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{article.date}</span>
                    </div>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to={`/news/${article.id}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No news articles found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-card">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Get the latest esports news and updates delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Your email address" className="flex-1" />
            <Button variant="hero">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default News;