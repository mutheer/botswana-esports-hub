import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';

interface Game {
  id: string;
  name: string;
  description?: string;
}

const GameRegistration = () => {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [userGames, setUserGames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGames();
    if (user) {
      fetchUserGames();
    }
  }, [user]);

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('id, name, description')
      .order('name');

    if (error) {
      console.error('Error fetching games:', error);
      return;
    }

    setGames(data || []);
  };

  const fetchUserGames = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('gamer_games')
      .select('game_id')
      .eq('gamer_id', user.id);

    if (error) {
      console.error('Error fetching user games:', error);
      return;
    }

    setUserGames(data?.map(ug => ug.game_id) || []);
  };

  const handleAddGame = async (gameId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('gamer_games').insert({
        gamer_id: user.id,
        game_id: gameId,
        gamer_id_for_game: `${user.email?.split('@')[0]}_${Date.now()}`,
      });

      if (error) throw error;

      setUserGames([...userGames, gameId]);
      toast({
        title: "Success",
        description: "Game added to your profile!",
      });
    } catch (error) {
      console.error('Error adding game:', error);
      toast({
        title: "Error",
        description: "Failed to add game to your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveGame = async (gameId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('gamer_games')
        .delete()
        .eq('gamer_id', user.id)
        .eq('game_id', gameId);

      if (error) throw error;

      setUserGames(userGames.filter(id => id !== gameId));
      toast({
        title: "Success",
        description: "Game removed from your profile!",
      });
    } catch (error) {
      console.error('Error removing game:', error);
      toast({
        title: "Error",
        description: "Failed to remove game from your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="text-center py-8">
              <p>Please log in to register for games.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Game Registration</h1>
          <p className="text-muted-foreground">
            Select the games you play to showcase them on your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => {
            const isRegistered = userGames.includes(game.id);
            return (
              <Card key={game.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{game.name}</CardTitle>
                  {game.description && (
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => isRegistered ? handleRemoveGame(game.id) : handleAddGame(game.id)}
                    disabled={isLoading}
                    variant={isRegistered ? "destructive" : "default"}
                    className="w-full"
                  >
                    {isRegistered ? "Remove Game" : "Add Game"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default GameRegistration;