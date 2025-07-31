import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
// Remove duplicate import since it's already imported at the bottom of the imports
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext"; // Assuming this exists from AdminDashboard

interface Gamer {
  id: string;
  name: string;
  surname: string;
  games: {
    id: string;
    name: string;
    gamer_id_for_game: string;
  }[];
}

const Database = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [games, setGames] = useState<{ id: string; name: string }[]>([]);
  const [searchResults, setSearchResults] = useState<Gamer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalGamers, setTotalGamers] = useState(0);

  // Fetch all available games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase
        .from("games")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Error fetching games:", error);
        return;
      }

      setGames(data || []);
    };

    fetchGames();
  }, []);

  // Fetch total number of gamers
  useEffect(() => {
    const fetchTotalGamers = async () => {
      const { count, error } = await supabase
        .from("gamers")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching total gamers:", error);
        return;
      }

      setTotalGamers(count || 0);
    };

    fetchTotalGamers();
  }, []);

  // Search gamers based on filters
  const searchGamers = async () => {
    setIsLoading(true);

    try {
      // Base query to get gamers
      let query = supabase.from("gamers").select(`
        id, 
        name, 
        surname
      `);

      // Apply name search filter if provided
      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,surname.ilike.%${searchTerm}%`
        );
      }

      // Execute the query
      const { data: gamersData, error: gamersError } = await query;

      if (gamersError) throw gamersError;

      // If we have gamers and need to filter by game
      if (gamersData && gamersData.length > 0) {
        const gamersWithGames: Gamer[] = [];

        // For each gamer, fetch their games
        for (const gamer of gamersData) {
          let gamerGamesQuery = supabase
            .from("gamer_games")
            .select(`
              game_id,
              gamer_id_for_game,
              games:game_id(id, name)
            `)
            .eq("gamer_id", gamer.id);

          // If a game filter is applied
          if (selectedGame) {
            gamerGamesQuery = gamerGamesQuery.eq("game_id", selectedGame);
          }

          const { data: gamerGames, error: gamerGamesError } = await gamerGamesQuery;

          if (gamerGamesError) throw gamerGamesError;

          // Only include gamers who have games matching the filter (if any)
          if (!selectedGame || (gamerGames && gamerGames.length > 0)) {
            // Format the games data
            const formattedGames = gamerGames?.map((gg) => ({
              id: gg.game_id,
              name: gg.games?.name || "",
              gamer_id_for_game: gg.gamer_id_for_game,
            })) || [];

            gamersWithGames.push({
              ...gamer,
              games: formattedGames,
            });
          }
        }

        setSearchResults(gamersWithGames);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching gamers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchGamers();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGame("");
    setSearchResults([]);
    searchGamers();
  };

  // Load all gamers on component mount for preview
  useEffect(() => {
    searchGamers();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Player Database</h1>
          <p className="text-muted-foreground">
            Search and discover players in our community. Total players: {totalGamers}
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Players
            </CardTitle>
            <CardDescription>
              Find players by name or filter by the games they play
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Search by name or surname..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Select value={selectedGame} onValueChange={setSelectedGame}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by game" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Games</SelectItem>
                      {games.map((game) => (
                        <SelectItem key={game.id} value={game.id}>
                          {game.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            <div className="grid gap-4">
              {searchResults.map((gamer) => (
                <Card key={gamer.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {gamer.name} {gamer.surname}
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-2">
                            Games played:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {gamer.games.length > 0 ? (
                              gamer.games.map((game) => (
                                <Badge key={game.id} variant="secondary">
                                  {game.name}
                                  {game.gamer_id_for_game && (
                                    <span className="ml-2 text-xs opacity-75">
                                      ID: {game.gamer_id_for_game}
                                    </span>
                                  )}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                No games registered
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <p className="mt-2 text-muted-foreground">Loading players...</p>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm || selectedGame
                    ? "No players found matching your search criteria."
                    : "Use the search form above to find players."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Database;
