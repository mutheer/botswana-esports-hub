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

        setGames(gamersWithGames);
      } else {
        setGames([]);
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

  // Inside the component
  const { user } = useAuth(); // Get current user
  
  const { data: gamers, error } = useQuery({
    queryKey: ['gamers'],
    queryFn: async () => {
      if (!user) throw new Error('Authentication required');
      const { data, error } = await supabase.from('gamers').select('*');
      if (error) throw error;
      return data;
    },
    enabled: !!user, // Only run if user is logged in
  });
  
  if (error) {
    return <div>Error loading gamers: {error.message}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Surname</TableHead>
          {/* Add more headers */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {gamers?.map(gamer => (
          <TableRow key={gamer.id}>
            <TableCell>{gamer.name}</TableCell>
            <TableCell>{gamer.surname}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Database;