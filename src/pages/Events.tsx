import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Users, ArrowRight, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  game: string;
  gameId: string;
  prizePool: string;
  registrationOpen: boolean;
  participants: number;
  maxParticipants: number;
  image: string;
  category: "upcoming" | "ongoing" | "past";
}

const Events = () => {
  const [filter, setFilter] = useState<"all" | string>("all");
  
  const events: Event[] = [
    {
      id: "1",
      title: "VALORANT Championship 2024",
      description: "Join Botswana's biggest VALORANT tournament with a prize pool of P50,000",
      date: "December 15, 2024",
      location: "Gaborone International Convention Centre",
      game: "VALORANT",
      gameId: "2",
      prizePool: "P50,000",
      registrationOpen: true,
      participants: 32,
      maxParticipants: 64,
      image: "/events/valorant-championship.jpg",
      category: "upcoming"
    },
    {
      id: "2",
      title: "CS:GO Masters Tournament",
      description: "The ultimate test of skill for Counter-Strike teams across Botswana",
      date: "November 5-6, 2024",
      location: "University of Botswana Sports Complex",
      game: "CS:GO",
      gameId: "1",
      prizePool: "P35,000",
      registrationOpen: true,
      participants: 24,
      maxParticipants: 32,
      image: "/events/csgo-masters.jpg",
      category: "upcoming"
    },
    {
      id: "3",
      title: "Mobile Legends Cup",
      description: "Botswana's premier mobile esports competition",
      date: "October 22, 2024",
      location: "Molapo Crossing Mall",
      game: "Mobile Legends",
      gameId: "7",
      prizePool: "P20,000",
      registrationOpen: true,
      participants: 45,
      maxParticipants: 64,
      image: "/events/mobile-legends-cup.jpg",
      category: "upcoming"
    },
    {
      id: "4",
      title: "FIFA 24 National Championship",
      description: "Find out who is Botswana's best FIFA player",
      date: "September 30, 2024",
      location: "Game City Mall",
      game: "FIFA",
      gameId: "5",
      prizePool: "P25,000",
      registrationOpen: false,
      participants: 128,
      maxParticipants: 128,
      image: "/events/fifa-championship.jpg",
      category: "ongoing"
    },
    {
      id: "5",
      title: "League of Legends Showdown",
      description: "Teams battle for supremacy in this MOBA tournament",
      date: "August 15-16, 2024",
      location: "Gaborone Technical College",
      game: "League of Legends",
      gameId: "4",
      prizePool: "P30,000",
      registrationOpen: false,
      participants: 16,
      maxParticipants: 16,
      image: "/events/lol-showdown.jpg",
      category: "past"
    },
    {
      id: "6",
      title: "PUBG Mobile Invitational",
      description: "The battle royale event of the year",
      date: "July 8, 2024",
      location: "Riverwalk Mall",
      game: "PUBG Mobile",
      gameId: "8",
      prizePool: "P15,000",
      registrationOpen: false,
      participants: 100,
      maxParticipants: 100,
      image: "/events/pubg-invitational.jpg",
      category: "past"
    },
  ];

  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.game === filter);

  const uniqueGames = Array.from(new Set(events.map(event => event.game)));

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-background">
            Esports Events
          </h1>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            Discover and participate in exciting tournaments and competitions across Botswana.
            From amateur leagues to professional championships, there's something for everyone.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold">Tournament Schedule</h2>
              
              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                <Filter className="h-4 w-4 text-muted-foreground ml-2" />
                <select 
                  className="bg-transparent border-none text-sm focus:ring-0 focus:outline-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Games</option>
                  {uniqueGames.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>

              {["upcoming", "ongoing", "past"].map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents
                      .filter(event => event.category === category)
                      .map((event) => (
                        <Card key={event.id} className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
                          <div className="h-48 bg-muted rounded-t-lg overflow-hidden">
                            <div 
                              className="w-full h-full bg-cover bg-center" 
                              style={{ backgroundImage: `url(${event.image})` }}
                            >
                              <div className="w-full h-full flex items-center justify-center bg-foreground/50">
                                <Trophy className="h-16 w-16 text-background/80" />
                              </div>
                            </div>
                          </div>
                          <CardHeader>
                            <Badge className="w-fit mb-2 bg-gaming-accent text-white">{event.game}</Badge>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>{event.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-sm">{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="text-sm">{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-primary" />
                                <span className="text-sm">Prize Pool: {event.prizePool}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                <span className="text-sm">{event.participants}/{event.maxParticipants} Participants</span>
                              </div>
                            </div>
                            
                            {category === "upcoming" && event.registrationOpen ? (
                              <Button variant="gaming" className="w-full" asChild>
                                <Link to={`/register?event=${event.id}&game=${event.gameId}`}>
                                  Register Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            ) : category === "upcoming" ? (
                              <Button variant="outline" className="w-full" disabled>
                                Registration Closed
                              </Button>
                            ) : category === "ongoing" ? (
                              <Button variant="outline" className="w-full" asChild>
                                <Link to={`/events/${event.id}`}>
                                  View Brackets
                                </Link>
                              </Button>
                            ) : (
                              <Button variant="outline" className="w-full" asChild>
                                <Link to={`/events/${event.id}`}>
                                  View Results
                                </Link>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                  
                  {filteredEvents.filter(event => event.category === category).length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No {category} events found for the selected filter.</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-card">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to host your own tournament?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground">
            BESF provides support for community-organized tournaments.
            Get in touch with us to learn how we can help you organize a successful esports event.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">
              Contact Us
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Events;