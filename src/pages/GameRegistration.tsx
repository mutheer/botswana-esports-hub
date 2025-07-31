import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
// ... other imports ...
const GameRegistration = () => {
  const { user } = useAuth();
  // State for selected games
  const handleAddGame = async (gameId) => {
    await supabase.from('gamer_games').insert({ gamer_id: user.id, game_id: gameId });
    // Update profile view
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Game Registration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games?.map((game) => (
          <div key={game.id} className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold">{game.name}</h2>
            <button
              onClick={() => handleAddGame(game.id)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Game
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};