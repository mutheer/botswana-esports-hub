import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Gamepad2, Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { gameRegistrationSchema, rateLimiter } from '@/lib/validation';
import { z } from 'zod';

interface Game {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

interface UserGame {
  id: string;
  game_id: string;
  gamer_tag?: string;
  skill_level?: string;
  joined_at: string;
  games: {
    name: string;
    description?: string;
  };
}

const skillLevels = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-500' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
  { value: 'advanced', label: 'Advanced', color: 'bg-orange-500' },
  { value: 'expert', label: 'Expert', color: 'bg-red-500' },
];

export default function UserGameRegistration() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [userGames, setUserGames] = useState<UserGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [gamerTag, setGamerTag] = useState('');
  const [skillLevel, setSkillLevel] = useState<string>('beginner');
  const [editingGame, setEditingGame] = useState<UserGame | null>(null);

  useEffect(() => {
    fetchGames();
    if (user) {
      fetchUserGames();
    }
  }, [user]);

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('id, name, description, is_active')
      .eq('is_active', true)
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
      .from('user_games')
      .select(`
        id,
        game_id,
        gamer_tag,
        skill_level,
        joined_at,
        games:game_id(name, description)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching user games:', error);
      return;
    }

    setUserGames(data || []);
  };

  const handleRegisterGame = async () => {
    if (!user || !selectedGame) return;

    try {
      setIsLoading(true);
      
      // Validate input if gamer tag is provided
      if (gamerTag) {
        const validatedData = gameRegistrationSchema.parse({
          gamer_tag: gamerTag,
          skill_level: skillLevel,
        });
        
        // Check rate limiting
        if (rateLimiter.isRateLimited(`game_register_${user.id}`, 5, 60000)) {
          toast({
            title: "Rate Limited",
            description: "Too many game registrations. Please wait a minute before trying again.",
            variant: "destructive",
          });
          return;
        }
        
        const { error } = await supabase.from('user_games').insert({
          user_id: user.id,
          game_id: selectedGame,
          gamer_tag: validatedData.gamer_tag || null,
          skill_level: validatedData.skill_level,
        });

        if (error) throw error;

        // Log activity
        await supabase.rpc('log_user_activity', {
          p_user_id: user.id,
          p_action: 'game_registered',
          p_resource_type: 'game',
          p_resource_id: selectedGame,
          p_details: { gamer_tag: validatedData.gamer_tag, skill_level: validatedData.skill_level }
        });
      } else {
        // No validation needed if no gamer tag
        const { error } = await supabase.from('user_games').insert({
          user_id: user.id,
          game_id: selectedGame,
          gamer_tag: null,
          skill_level: skillLevel,
        });

        if (error) throw error;

        // Log activity
        await supabase.rpc('log_user_activity', {
          p_user_id: user.id,
          p_action: 'game_registered',
          p_resource_type: 'game',
          p_resource_id: selectedGame,
          p_details: { skill_level: skillLevel }
        });
      }

      await fetchUserGames();
      setSelectedGame('');
      setGamerTag('');
      setSkillLevel('beginner');

      toast({
        title: "Success",
        description: "Game added to your profile!",
      });
    } catch (error) {
      console.error('Error registering game:', error);
      
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message || "Invalid input data",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add game to your profile. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGame = async () => {
    if (!user || !editingGame) return;

    try {
      setIsLoading(true);
      
      // Validate input if gamer tag is provided
      if (gamerTag) {
        const validatedData = gameRegistrationSchema.parse({
          gamer_tag: gamerTag,
          skill_level: skillLevel,
        });
        
        const { error } = await supabase
          .from('user_games')
          .update({
            gamer_tag: validatedData.gamer_tag || null,
            skill_level: validatedData.skill_level,
          })
          .eq('id', editingGame.id)
          .eq('user_id', user.id);

        if (error) throw error;

        // Log activity
        await supabase.rpc('log_user_activity', {
          p_user_id: user.id,
          p_action: 'game_updated',
          p_resource_type: 'game',
          p_resource_id: editingGame.game_id,
          p_details: { gamer_tag: validatedData.gamer_tag, skill_level: validatedData.skill_level }
        });
      } else {
        const { error } = await supabase
          .from('user_games')
          .update({
            gamer_tag: null,
            skill_level: skillLevel,
          })
          .eq('id', editingGame.id)
          .eq('user_id', user.id);

        if (error) throw error;

        // Log activity
        await supabase.rpc('log_user_activity', {
          p_user_id: user.id,
          p_action: 'game_updated',
          p_resource_type: 'game',
          p_resource_id: editingGame.game_id,
          p_details: { skill_level: skillLevel }
        });
      }

      await fetchUserGames();
      setEditingGame(null);
      setGamerTag('');
      setSkillLevel('beginner');

      toast({
        title: "Success",
        description: "Game updated successfully!",
      });
    } catch (error) {
      console.error('Error updating game:', error);
      
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message || "Invalid input data",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update game. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveGame = async (gameId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_games')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('game_id', gameId);

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_user_activity', {
        p_user_id: user.id,
        p_action: 'game_removed',
        p_resource_type: 'game',
        p_resource_id: gameId
      });

      await fetchUserGames();
      toast({
        title: "Success",
        description: "Game removed from your profile!",
      });
    } catch (error) {
      console.error('Error removing game:', error);
      toast({
        title: "Error",
        description: "Failed to remove game.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const availableGames = games.filter(
    game => !userGames.some(ug => ug.game_id === game.id)
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Please log in to manage your games.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Gamepad2 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">My Games</h2>
      </div>

      {/* Add New Game */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Game
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="game">Select Game</Label>
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a game" />
                </SelectTrigger>
                <SelectContent>
                  {availableGames.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gamerTag">Gamer Tag (Optional)</Label>
              <Input
                id="gamerTag"
                value={gamerTag}
                onChange={(e) => setGamerTag(e.target.value)}
                placeholder="Your username in this game"
              />
            </div>
            <div>
              <Label htmlFor="skillLevel">Skill Level</Label>
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={handleRegisterGame} 
            disabled={!selectedGame || isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? "Adding..." : "Add Game"}
          </Button>
        </CardContent>
      </Card>

      {/* User's Games */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {userGames.map((userGame) => {
          const skillLevelData = skillLevels.find(s => s.value === userGame.skill_level);
          return (
            <Card key={userGame.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{userGame.games.name}</CardTitle>
                    {userGame.gamer_tag && (
                      <p className="text-sm text-muted-foreground">@{userGame.gamer_tag}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingGame(userGame);
                            setGamerTag(userGame.gamer_tag || '');
                            setSkillLevel(userGame.skill_level || 'beginner');
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit {userGame.games.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="editGamerTag">Gamer Tag</Label>
                            <Input
                              id="editGamerTag"
                              value={gamerTag}
                              onChange={(e) => setGamerTag(e.target.value)}
                              placeholder="Your username in this game"
                            />
                          </div>
                          <div>
                            <Label htmlFor="editSkillLevel">Skill Level</Label>
                            <Select value={skillLevel} onValueChange={setSkillLevel}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {skillLevels.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleUpdateGame} disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Game"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGame(userGame.game_id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {skillLevelData && (
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                      <div className={`w-2 h-2 rounded-full ${skillLevelData.color}`} />
                      {skillLevelData.label}
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(userGame.joined_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {userGames.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="text-center py-8">
            <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No games registered</h3>
            <p className="text-muted-foreground">Add your first game to showcase your gaming skills!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}