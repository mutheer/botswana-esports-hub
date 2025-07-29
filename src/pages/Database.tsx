import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";

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
  const [gamers, setGamers] = useState<Gamer[]>([]);
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

        setGamers(gamersWithGames);
      } else {
        setGamers([]);
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
    searchGamers();
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Gamer Database</h1>
            <p className="text-xl text-muted-foreground">
              Search and discover registered gamers in Botswana
            </p>
          </div>

          <Card className="shadow-elegant mb-8">
            <CardHeader>
              <CardTitle>Search Filters</CardTitle>
              <CardDescription>
                Find gamers by name or filter by game
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Name Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name Search</label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or surname"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  {/* Game Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Game</label>
                    <Select
                      value={selectedGame}
                      onValueChange={setSelectedGame}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Games" />
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

                  {/* Search Buttons */}
                  <div className="flex items-end space-x-2">
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        "Search"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearFilters}
                      disabled={isLoading}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Results</CardTitle>
                <Badge variant="outline" className="text-sm">
                  Total Registered: {totalGamers}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : gamers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Games</TableHead>
                        <TableHead>Gamer IDs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gamers.map((gamer) => (
                        <TableRow key={gamer.id}>
                          <TableCell className="font-medium">
                            {gamer.name} {gamer.surname}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {gamer.games.map((game) => (
                                <Badge key={game.id} variant="outline">
                                  {game.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {gamer.games.map((game) => (
                                <div key={game.id} className="text-sm">
                                  <span className="font-medium">{game.name}:</span>{" "}
                                  <span className="text-muted-foreground">
                                    {game.gamer_id_for_game}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchTerm || selectedGame
                      ? "No gamers found matching your search criteria."
                      : "Use the search filters above to find gamers."}
                  </p>
                  {(searchTerm || selectedGame) && (
                    <Button
                      variant="link"
                      onClick={clearFilters}
                      className="mt-2"
                    >
                      Clear filters and try again
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Database;