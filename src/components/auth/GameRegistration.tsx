import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, GameController2 } from 'lucide-react';

type Game = {
  id: string;
  name: string;
  description: string;
};

type GameRegistrationProps = {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const GameRegistration = ({ game, isOpen, onClose, onSuccess }: GameRegistrationProps) => {
  const { user, isAuthenticated } = useAuth();
  const [gamerIdForGame, setGamerIdForGame] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  useEffect(() => {
    if (isOpen && user && game) {
      checkExistingRegistration();
    }
  }, [isOpen, user, game]);

  const checkExistingRegistration = async () => {
    try {
      const { data, error } = await supabase
        .from('user_games')
        .select('id')
        .eq('user_id', user?.id)
        .eq('game_id', game.id)
        .single();

      if (data) {
        setIsAlreadyRegistered(true);
      }
    } catch (error) {
      // No existing registration found, which is fine
      setIsAlreadyRegistered(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to register for games');
      return;
    }

    if (!gamerIdForGame.trim()) {
      toast.error('Please enter your gamer ID for this game');
      return;
    }

    setIsRegistering(true);

    try {
      // Insert into user_games table
      const { error: userGameError } = await supabase
        .from('user_games')
        .insert({
          user_id: user.id,
          game_id: game.id,
          gamer_id_for_game: gamerIdForGame.trim()
        });

      if (userGameError) throw userGameError;

      // Log the activity
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action: 'game_registration',
          details: `Registered for game: ${game.name}`
        });

      toast.success(`Successfully registered for ${game.name}!`);
      setGamerIdForGame('');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error registering for game:', error);
      if (error.code === '23505') {
        toast.error('You are already registered for this game');
      } else {
        toast.error(error.message || 'Failed to register for game');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleClose = () => {
    setGamerIdForGame('');
    setIsAlreadyRegistered(false);
    onClose();
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You must be logged in to register for games.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => window.location.href = '/auth'}>
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GameController2 className="h-5 w-5" />
            Register for {game.name}
          </DialogTitle>
          <DialogDescription>
            {isAlreadyRegistered 
              ? "You are already registered for this game."
              : "Enter your gamer ID to register for this game."
            }
          </DialogDescription>
        </DialogHeader>

        {isAlreadyRegistered ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              You are already registered for this game. Check your profile to view your registration details.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => window.location.href = '/profile'}>
                View Profile
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gamerIdForGame">
                Your Gamer ID for {game.name}
              </Label>
              <Input
                id="gamerIdForGame"
                value={gamerIdForGame}
                onChange={(e) => setGamerIdForGame(e.target.value)}
                placeholder={`Enter your ${game.name} username/ID`}
                required
                maxLength={100}
              />
              <p className="text-sm text-muted-foreground">
                This should be your in-game username or player ID
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isRegistering}>
                {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GameRegistration;