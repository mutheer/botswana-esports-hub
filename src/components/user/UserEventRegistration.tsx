import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Calendar, MapPin, Users, Trophy, Edit, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date?: string;
  location?: string;
  is_published: boolean;
}

interface UserEvent {
  id: string;
  event_id: string;
  registered_at: string;
  status: string;
  team_name?: string;
  notes?: string;
  events: {
    title: string;
    description?: string;
    event_date?: string;
    location?: string;
  };
}

const statusOptions = [
  { value: 'registered', label: 'Registered', color: 'bg-blue-500' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-green-500' },
  { value: 'attended', label: 'Attended', color: 'bg-purple-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
];

export default function UserEventRegistration() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [teamName, setTeamName] = useState('');
  const [notes, setNotes] = useState('');
  const [editingEvent, setEditingEvent] = useState<UserEvent | null>(null);

  // Memoize fetch functions for better performance
  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, description, event_date, location, is_published')
      .eq('is_published', true)
      .gte('event_date', new Date().toISOString())
      .order('event_date');

    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    setEvents(data || []);
  }, []);

  const fetchUserEvents = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_events')
      .select(`
        id,
        event_id,
        registered_at,
        status,
        team_name,
        notes,
        events:event_id(title, description, event_date, location)
      `)
      .eq('user_id', user.id)
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Error fetching user events:', error);
      return;
    }

    setUserEvents(data || []);
  }, [user]);

  useEffect(() => {
    // Batch initial data loading
    const loadInitialData = async () => {
      await Promise.all([
        fetchEvents(),
        user ? fetchUserEvents() : Promise.resolve()
      ]);
    };
    
    loadInitialData();
  }, [user, fetchEvents, fetchUserEvents]);

  const handleRegisterEvent = async () => {
    if (!user || !selectedEvent) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('user_events').insert({
        user_id: user.id,
        event_id: selectedEvent,
        team_name: teamName || null,
        notes: notes || null,
        status: 'registered',
      });

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_user_activity', {
        p_user_id: user.id,
        p_action: 'event_registered',
        p_resource_type: 'event',
        p_resource_id: selectedEvent,
        p_details: { team_name: teamName, notes: notes }
      });

      await fetchUserEvents();
      setSelectedEvent('');
      setTeamName('');
      setNotes('');

      toast({
        title: "Success",
        description: "Successfully registered for the event!",
      });
    } catch (error: any) {
      console.error('Error registering for event:', error);
      if (error.code === '23505') {
        toast({
          title: "Already Registered",
          description: "You're already registered for this event.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to register for the event.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEvent = async (status: string) => {
    if (!user || !editingEvent) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_events')
        .update({
          team_name: teamName || null,
          notes: notes || null,
          status: status,
        })
        .eq('id', editingEvent.id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_user_activity', {
        p_user_id: user.id,
        p_action: 'event_updated',
        p_resource_type: 'event',
        p_resource_id: editingEvent.event_id,
        p_details: { team_name: teamName, notes: notes, status }
      });

      await fetchUserEvents();
      setEditingEvent(null);
      setTeamName('');
      setNotes('');

      toast({
        title: "Success",
        description: "Event registration updated!",
      });
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_events')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_user_activity', {
        p_user_id: user.id,
        p_action: 'event_cancelled',
        p_resource_type: 'event',
        p_resource_id: eventId
      });

      await fetchUserEvents();
      toast({
        title: "Registration Cancelled",
        description: "Your event registration has been cancelled.",
      });
    } catch (error) {
      console.error('Error cancelling registration:', error);
      toast({
        title: "Error",
        description: "Failed to cancel registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const availableEvents = events.filter(
    event => !userEvents.some(ue => ue.event_id === event.id && ue.status !== 'cancelled')
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Please log in to manage your event registrations.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">My Events</h2>
      </div>

      {/* Register for New Event */}
      {availableEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Register for Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event">Select Event</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          {event.event_date && (
                            <div className="text-xs text-muted-foreground">
                              {new Date(event.event_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teamName">Team Name (Optional)</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name if applicable"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information..."
                rows={3}
              />
            </div>
            <Button 
              onClick={handleRegisterEvent} 
              disabled={!selectedEvent || isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? "Registering..." : "Register for Event"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* User's Event Registrations */}
      <div className="space-y-4">
        {userEvents.map((userEvent) => {
          const status = statusOptions.find(s => s.value === userEvent.status);
          const isUpcoming = userEvent.events.event_date && new Date(userEvent.events.event_date) > new Date();
          
          return (
            <Card key={userEvent.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{userEvent.events.title}</CardTitle>
                      {status && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${status.color}`} />
                          {status.label}
                        </Badge>
                      )}
                    </div>
                    {userEvent.events.event_date && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(userEvent.events.event_date).toLocaleDateString()}
                      </div>
                    )}
                    {userEvent.events.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {userEvent.events.location}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {userEvent.status !== 'cancelled' && isUpcoming && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingEvent(userEvent);
                                setTeamName(userEvent.team_name || '');
                                setNotes(userEvent.notes || '');
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Registration - {userEvent.events.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="editTeamName">Team Name</Label>
                                <Input
                                  id="editTeamName"
                                  value={teamName}
                                  onChange={(e) => setTeamName(e.target.value)}
                                  placeholder="Enter team name if applicable"
                                />
                              </div>
                              <div>
                                <Label htmlFor="editNotes">Notes</Label>
                                <Textarea
                                  id="editNotes"
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  placeholder="Any additional information..."
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={() => handleUpdateEvent('confirmed')} disabled={isLoading}>
                                  {isLoading ? "Updating..." : "Confirm Attendance"}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleUpdateEvent('registered')} 
                                  disabled={isLoading}
                                >
                                  Update Details
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelRegistration(userEvent.event_id)}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userEvent.team_name && (
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Team:</span> {userEvent.team_name}
                    </div>
                  )}
                  {userEvent.notes && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Notes:</span> {userEvent.notes}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Registered {new Date(userEvent.registered_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {userEvents.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="text-center py-8">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No event registrations</h3>
            <p className="text-muted-foreground">Register for your first event to start competing!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}