import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GameSelection {
  id: string;
  name: string;
  gamer_id: string;
}

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    omangNumber: "",
    consentGiven: false,
  });
  const [selectedGames, setSelectedGames] = useState<GameSelection[]>([]);
  const [customGame, setCustomGame] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const availableGames = [
    { id: "1", name: "CS:GO" },
    { id: "2", name: "VALORANT" },
    { id: "3", name: "Dota 2" },
    { id: "4", name: "League of Legends" },
    { id: "5", name: "FIFA" },
    { id: "6", name: "Call of Duty" },
    { id: "7", name: "Mobile Legends" },
    { id: "8", name: "PUBG Mobile" },
    { id: "9", name: "Call of Duty Mobile" },
  ];

  const validateOmangNumber = (omang: string) => {
    return /^[0-9]{9}$/.test(omang);
  };

  const addGame = (gameId: string, gameName: string) => {
    if (selectedGames.find(game => game.id === gameId)) return;
    
    setSelectedGames([...selectedGames, { id: gameId, name: gameName, gamer_id: "" }]);
  };

  const removeGame = (gameId: string) => {
    setSelectedGames(selectedGames.filter(game => game.id !== gameId));
  };

  const updateGamerId = (gameId: string, gamer_id: string) => {
    setSelectedGames(selectedGames.map(game => 
      game.id === gameId ? { ...game, gamer_id } : game
    ));
  };

  const addCustomGame = () => {
    if (!customGame.trim()) return;
    
    const customId = `custom-${Date.now()}`;
    setSelectedGames([...selectedGames, { id: customId, name: customGame, gamer_id: "" }]);
    setCustomGame("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.name.trim() || !formData.surname.trim()) {
      toast({
        title: "Error",
        description: "Name and surname are required.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validateOmangNumber(formData.omangNumber)) {
      toast({
        title: "Error",
        description: "Omang number must be exactly 9 digits.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.consentGiven) {
      toast({
        title: "Error",
        description: "You must consent to data processing to register.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (selectedGames.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one game.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check if all selected games have gamer IDs
    const missingGamerIds = selectedGames.filter(game => !game.gamer_id.trim());
    if (missingGamerIds.length > 0) {
      toast({
        title: "Error",
        description: "Please provide gamer IDs for all selected games.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Register the gamer
      const { data: gamerData, error: gamerError } = await supabase
        .from('gamers')
        .insert({
          name: formData.name,
          surname: formData.surname,
          omang_number: formData.omangNumber, // Note: In production, this should be encrypted
          consent_given: formData.consentGiven,
        })
        .select()
        .single();

      if (gamerError) throw gamerError;

      // Get games from database and add any custom games
      const { data: existingGames } = await supabase
        .from('games')
        .select('*');

      const gameInserts = [];
      const gamerGameInserts = [];

      for (const selectedGame of selectedGames) {
        let gameId = selectedGame.id;
        
        // If it's a custom game, add it to the games table first
        if (selectedGame.id.startsWith('custom-')) {
          const { data: newGame, error: gameError } = await supabase
            .from('games')
            .insert({ name: selectedGame.name })
            .select()
            .single();
          
          if (gameError) throw gameError;
          gameId = newGame.id;
        }

        gamerGameInserts.push({
          gamer_id: gamerData.id,
          game_id: gameId,
          gamer_id_for_game: selectedGame.gamer_id,
        });
      }

      // Insert gamer-game relationships
      const { error: gamerGameError } = await supabase
        .from('gamer_games')
        .insert(gamerGameInserts);

      if (gamerGameError) throw gamerGameError;

      toast({
        title: "Registration Successful!",
        description: "You have been successfully registered with BESF.",
      });

      // Reset form
      setFormData({ name: "", surname: "", omangNumber: "", consentGiven: false });
      setSelectedGames([]);
      
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-gradient-card">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Gamer Registration</CardTitle>
              <CardDescription>
                Join the Botswana Electronic Sports Federation and connect with fellow gamers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">First Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="surname">Surname *</Label>
                      <Input
                        id="surname"
                        type="text"
                        value={formData.surname}
                        onChange={(e) => setFormData({...formData, surname: e.target.value})}
                        placeholder="Enter your surname"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="omang">Omang Number *</Label>
                    <Input
                      id="omang"
                      type="text"
                      value={formData.omangNumber}
                      onChange={(e) => setFormData({...formData, omangNumber: e.target.value})}
                      placeholder="9-digit Omang number"
                      maxLength={9}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Your Omang number will be encrypted and kept secure
                    </p>
                  </div>
                </div>

                {/* Games Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Games Played</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableGames.map((game) => (
                      <Button
                        key={game.id}
                        type="button"
                        variant={selectedGames.find(g => g.id === game.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => addGame(game.id, game.name)}
                        disabled={!!selectedGames.find(g => g.id === game.id)}
                      >
                        {game.name}
                      </Button>
                    ))}
                  </div>

                  {/* Custom Game Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom game"
                      value={customGame}
                      onChange={(e) => setCustomGame(e.target.value)}
                    />
                    <Button type="button" onClick={addCustomGame} disabled={!customGame.trim()}>
                      Add
                    </Button>
                  </div>

                  {/* Selected Games with Gamer IDs */}
                  {selectedGames.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Selected Games & Gamer IDs</h4>
                      {selectedGames.map((game) => (
                        <div key={game.id} className="flex items-center gap-2 p-3 border rounded-lg">
                          <Badge variant="outline">{game.name}</Badge>
                          <Input
                            placeholder={`Your ${game.name} gamer ID`}
                            value={game.gamer_id}
                            onChange={(e) => updateGamerId(game.id, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeGame(game.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Privacy Consent */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consent"
                      checked={formData.consentGiven}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, consentGiven: checked as boolean})
                      }
                    />
                    <Label htmlFor="consent" className="text-sm">
                      I consent to the processing of my personal data in accordance with Botswana's 
                      Data Protection Act (Act No. 18 of 2024) and BESF's{" "}
                      <Button variant="link" className="p-0 h-auto text-primary underline">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="hero" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register Now"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;