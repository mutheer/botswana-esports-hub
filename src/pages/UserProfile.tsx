import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Loader2, Calendar, GameController2, User, Shield } from 'lucide-react';

type UserGame = {
  id: string;
  game_name: string;
  gamer_id_for_game: string;
  joined_at: string;
};

type UserEvent = {
  id: string;
  event_title: string;
  event_date: string;
  registered_at: string;
};

const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userGames, setUserGames] = useState<UserGame[]>([]);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserGames();
      fetchUserEvents();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        username: data.username || '',
        first_name: data.first_name || '',
        last_name: data.last_name || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchUserGames = async () => {
    try {
      const { data, error } = await supabase
        .from('user_games')
        .select(`
          id,
          gamer_id_for_game,
          joined_at,
          games:game_id (
            name
          )
        `)
        .eq('user_id', user?.id)
        .order('joined_at', { ascending: false });

      if (error) throw error;

      const formattedGames = data.map(item => ({
        id: item.id,
        game_name: item.games?.name || 'Unknown Game',
        gamer_id_for_game: item.gamer_id_for_game,
        joined_at: item.joined_at
      }));

      setUserGames(formattedGames);
    } catch (error) {
      console.error('Error fetching user games:', error);
    }
  };

  const fetchUserEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('user_events')
        .select(`
          id,
          registered_at,
          events:event_id (
            title,
            event_date
          )
        `)
        .eq('user_id', user?.id)
        .order('registered_at', { ascending: false });

      if (error) throw error;

      const formattedEvents = data.map(item => ({
        id: item.id,
        event_title: item.events?.title || 'Unknown Event',
        event_date: item.events?.event_date || '',
        registered_at: item.registered_at
      }));

      setUserEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching user events:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      fetchUserProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading || profileLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="mt-4 text-lg">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile, games, and event registrations
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <GameController2 className="h-4 w-4" />
              My Games
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              My Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Account Role</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.role === 'admin' ? 'Administrator' : 'User'}
                      </p>
                    </div>
                  </div>

                  <Button type="submit" disabled={updating} className="w-full">
                    {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games">
            <Card>
              <CardHeader>
                <CardTitle>My Games</CardTitle>
                <CardDescription>
                  Games you are registered for and your gamer IDs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userGames.length === 0 ? (
                  <div className="text-center py-8">
                    <GameController2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      You haven't registered for any games yet
                    </p>
                    <Button onClick={() => window.location.href = '/games'}>
                      Browse Games
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userGames.map((game) => (
                      <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{game.game_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Gamer ID: {game.gamer_id_for_game}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined: {new Date(game.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary">Registered</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>My Events</CardTitle>
                <CardDescription>
                  Events you are registered for
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      You haven't registered for any events yet
                    </p>
                    <Button onClick={() => window.location.href = '/events'}>
                      Browse Events
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{event.event_title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Event Date: {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBA'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Registered: {new Date(event.registered_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary">Registered</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserProfile;