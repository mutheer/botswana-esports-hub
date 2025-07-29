import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GamepadIcon, Trophy, Users, Star } from "lucide-react";
import Layout from "@/components/layout/Layout";

const Games = () => {
  const supportedGames = [
    {
      id: "1",
      name: "CS:GO",
      description: "Counter-Strike: Global Offensive - A tactical first-person shooter game.",
      players: "120+",
      tournaments: "8",
      category: "FPS",
      image: "/games/csgo.jpg"
    },
    {
      id: "2",
      name: "VALORANT",
      description: "A 5v5 character-based tactical shooter developed by Riot Games.",
      players: "150+",
      tournaments: "10",
      category: "FPS",
      image: "/games/valorant.jpg"
    },
    {
      id: "3",
      name: "Dota 2",
      description: "A multiplayer online battle arena (MOBA) game by Valve Corporation.",
      players: "80+",
      tournaments: "5",
      category: "MOBA",
      image: "/games/dota2.jpg"
    },
    {
      id: "4",
      name: "League of Legends",
      description: "A team-based strategy game developed by Riot Games.",
      players: "100+",
      tournaments: "7",
      category: "MOBA",
      image: "/games/lol.jpg"
    },
    {
      id: "5",
      name: "FIFA",
      description: "The popular football simulation game by EA Sports.",
      players: "90+",
      tournaments: "6",
      category: "Sports",
      image: "/games/fifa.jpg"
    },
    {
      id: "6",
      name: "Call of Duty",
      description: "A first-person shooter franchise with multiple game modes.",
      players: "110+",
      tournaments: "8",
      category: "FPS",
      image: "/games/cod.jpg"
    },
    {
      id: "7",
      name: "Mobile Legends",
      description: "A mobile MOBA game popular in the esports community.",
      players: "130+",
      tournaments: "9",
      category: "Mobile MOBA",
      image: "/games/ml.jpg"
    },
    {
      id: "8",
      name: "PUBG Mobile",
      description: "A battle royale game optimized for mobile devices.",
      players: "95+",
      tournaments: "7",
      category: "Battle Royale",
      image: "/games/pubgm.jpg"
    },
    {
      id: "9",
      name: "Call of Duty Mobile",
      description: "The mobile version of the popular Call of Duty franchise.",
      players: "85+",
      tournaments: "6",
      category: "Mobile FPS",
      image: "/games/codm.jpg"
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-background">
            Supported Games
          </h1>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            BESF officially supports and organizes tournaments for these competitive gaming titles.
            Join our community and compete in your favorite games!
          </p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportedGames.map((game) => (
              <Card key={game.id} className="shadow-card hover:shadow-elegant transition-spring hover:scale-105">
                <div className="h-48 bg-muted rounded-t-lg overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${game.image})` }}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-foreground/50">
                      <GamepadIcon className="h-16 w-16 text-background/80" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-gaming-accent text-white">{game.category}</Badge>
                  <CardTitle>{game.name}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{game.players} Players</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{game.tournaments} Tournaments</span>
                    </div>
                  </div>
                  <Button variant="gaming" size="sm" className="w-full" asChild>
                    <Link to={`/register?game=${game.id}`}>
                      <Star className="mr-2 h-4 w-4" />
                      Register for this game
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-card">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to suggest a new game?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground">
            We're always looking to expand our supported games based on community interest.
            Let us know what you'd like to see added!
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

export default Games;