import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Lock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useGames } from "@/hooks/useGames";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/contexts/AuthContext";

interface Player {
  id: string;
  gamer_tag: string;
  games: {
    id: string;
    name: string;
    gamer_id_for_game: string;
  }[];
}

const Database = () => {
  const { user, isLoading: loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPlayers, setTotalPlayers] = useState(0);

  // Use custom hook for games data
  const { games } = useGames(true);
  
  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
              <p className="text-muted-foreground mb-4">
                You must be logged in to view the Players directory.
              </p>
              <Button asChild>
                <a href="/login">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Fetch total number of players (from user_games)
  useEffect(() => {
    const fetchTotalPlayers = async () => {
      const { count, error } = await supabase
        .from("user_games")
        .select("user_id", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching total players:", error);
        return;
      }

      // Count unique users
      const { data: uniqueUsers } = await supabase
        .from("user_games")
        .select("user_id", { count: "exact" })
        .not("user_id", "is", null);

      setTotalPlayers(uniqueUsers?.length || 0);
    };

    fetchTotalPlayers();
  }, []);

  // Secure search using user_games to show only gamer tags
  const searchPlayers = async () => {
    setIsLoading(true);

    try {
      // Get user games with profiles for gamer tags
      let userGamesQuery = supabase
        .from("user_games")
        .select(`
          user_id,
          gamer_tag,
          game_id,
          games:game_id(id, name),
          profiles:user_id(username)
        `)
        .not("gamer_tag", "is", null)
        .eq("is_active", true);

      // Apply game filter if selected
      if (selectedGame && selectedGame !== "all") {
        userGamesQuery = userGamesQuery.eq("game_id", selectedGame);
      }

      const { data: userGamesData, error: userGamesError } = await userGamesQuery;
      if (userGamesError) throw userGamesError;

      if (!userGamesData || userGamesData.length === 0) {
        setSearchResults([]);
        return;
      }

      // Group by user and create player objects with gamer tags
      const playersMap = new Map<string, Player>();

      userGamesData.forEach((userGame) => {
        const userId = userGame.user_id;
        const primaryGamerTag = userGame.gamer_tag || (userGame.profiles as any)?.username || "Anonymous";
        
        if (!playersMap.has(userId)) {
          playersMap.set(userId, {
            id: userId,
            gamer_tag: primaryGamerTag,
            games: []
          });
        }

        const player = playersMap.get(userId)!;
        player.games.push({
          id: userGame.game_id,
          name: userGame.games?.name || "",
          gamer_id_for_game: userGame.gamer_tag || ""
        });
      });

      let results = Array.from(playersMap.values());

      // Apply search filter if provided
      if (debouncedSearchTerm) {
        results = results.filter(player => 
          player.gamer_tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          player.games.some(game => 
            game.gamer_id_for_game.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            game.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          )
        );
      }

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching players:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPlayers();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGame("all");
    setSearchResults([]);
    searchPlayers();
  };

  // Load players when debounced search term or game filter changes
  useEffect(() => {
    searchPlayers();
  }, [debouncedSearchTerm, selectedGame]);

  // Memoize available games for performance
  const gameOptions = useMemo(() => games.map(game => ({ id: game.id, name: game.name })), [games]);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Player Database</h1>
          <p className="text-muted-foreground">
            Search and discover players in our community. Total players: {totalPlayers}
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
              Find players by gamer tag or filter by the games they play
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Search by gamer tag or game..."
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
                      <SelectItem value="all">All Games</SelectItem>
                      {gameOptions.map((game) => (
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
        <div className="space-y-6">
          {searchResults.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {searchResults.length} Player{searchResults.length !== 1 ? 's' : ''} Found
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((player) => (
                  <Card key={player.id} className="group hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Player Info */}
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-xl font-bold text-primary-foreground">
                              {player.gamer_tag.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {player.gamer_tag}
                          </h3>
                        </div>

                        {/* Games Section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Games Played
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {player.games.length}
                            </Badge>
                          </div>
                          
                          {player.games.length > 0 ? (
                            <div className="space-y-2">
                              {player.games.slice(0, 3).map((game) => (
                                <div key={game.id} className="flex items-center justify-between p-2 bg-accent/50 rounded-lg">
                                  <span className="text-sm font-medium text-foreground">
                                    {game.name}
                                  </span>
                                  {game.gamer_id_for_game && (
                                    <code className="text-xs bg-background/80 px-2 py-1 rounded text-muted-foreground">
                                      {game.gamer_id_for_game}
                                    </code>
                                  )}
                                </div>
                              ))}
                              {player.games.length > 3 && (
                                <div className="text-center">
                                  <Badge variant="outline" className="text-xs">
                                    +{player.games.length - 3} more
                                  </Badge>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-xs text-muted-foreground">?</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                No games registered
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Searching players...</p>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || (selectedGame && selectedGame !== "all")
                    ? "No players found"
                    : "Discover Players"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || (selectedGame && selectedGame !== "all")
                    ? "Try adjusting your search criteria to find more players."
                    : "Use the search form above to find players in our community."}
                </p>
                {(searchTerm || (selectedGame && selectedGame !== "all")) && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Database;
