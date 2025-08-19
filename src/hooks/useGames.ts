import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Game {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

/**
 * Custom hook to fetch and cache games data
 * Reduces redundant API calls across components
 */
export function useGames(activeOnly: boolean = false) {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('games')
          .select('id, name, description, is_active')
          .order('name');

        if (activeOnly) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) throw error;
        setGames(data || []);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to fetch games');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [activeOnly]);

  return { games, isLoading, error, refetch: () => setIsLoading(true) };
}