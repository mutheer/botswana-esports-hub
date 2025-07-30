import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Calendar, MapPin, ExternalLink } from 'lucide-react';

type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  registration_link: string;
};

type EventRegistrationProps = {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const EventRegistration = ({ event, isOpen, onClose, onSuccess }: EventRegistrationProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  useEffect(() => {
    if (isOpen && user && event) {
      checkExistingRegistration();
    }
  }, [isOpen, user, event]);

  const checkExistingRegistration = async () => {
    try {
      const { data, error } = await supabase
        .from('user_events')
        .select('id')
        .eq('user_id', user?.id)
        .eq('event_id', event.id)
        .single();

      if (data) {
        setIsAlreadyRegistered(true);
      }
    } catch (error) {
      // No existing registration found, which is fine
      setIsAlreadyRegistered(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to register for events');
      return;
    }

    setIsRegistering(true);

    try {
      // Insert into user_events table
      const { error: userEventError } = await supabase
        .from('user_events')
        .insert({
          user_id: user.id,
          event_id: event.id
        });

      if (userEventError) throw userEventError;

      // Log the activity
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action: 'event_registration',
          details: `Registered for event: ${event.title}`
        });

      toast.success(`Successfully registered for ${event.title}!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error registering for event:', error);
      if (error.code === '23505') {
        toast.error('You are already registered for this event');
      } else {
        toast.error(error.message || 'Failed to register for event');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleClose = () => {
    setIsAlreadyRegistered(false);
    onClose();
  };

  const handleExternalLink = () => {
    if (event.registration_link) {
      window.open(event.registration_link, '_blank');
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You must be logged in to register for events.
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {event.title}
          </DialogTitle>
          <DialogDescription>
            {isAlreadyRegistered 
              ? "You are already registered for this event."
              : "Register for this event to secure your spot."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Details */}
          <div className="space-y-2">
            {event.event_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(event.event_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
            
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            )}
          </div>

          {event.description && (
            <div className="text-sm text-muted-foreground">
              {event.description}
            </div>
          )}

          {isAlreadyRegistered ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                You are already registered for this event. Check your profile to view your registration details.
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
            <div className="space-y-4">
              {event.registration_link && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    This event requires external registration:
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExternalLink}
                    className="w-full"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Registration Link
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleRegister} disabled={isRegistering}>
                  {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistration;