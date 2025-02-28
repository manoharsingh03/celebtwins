
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CelebrityMatch, Celebrity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, History, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Updated ProfileData type to match our database structure
type ProfileData = {
  id: string;
  name: string;
  avatar_url: string | null;
};

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [matches, setMatches] = useState<CelebrityMatch[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    async function loadProfileData() {
      if (!user) return;

      try {
        // Fetch profile data
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (profile) {
          setProfileData(profile);
        }
      } catch (error: any) {
        console.error('Error loading profile:', error.message);
        toast({
          title: 'Error loading profile',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoadingProfile(false);
      }
    }

    async function loadMatches() {
      if (!user) return;

      try {
        // Fetch celebrity matches
        const { data, error } = await supabase
          .from('celebrity_matches')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          // Transform the data to match our CelebrityMatch type
          const formattedMatches: CelebrityMatch[] = data.map(match => ({
            id: match.id,
            userId: match.user_id,
            userImage: match.user_image,
            celebrities: match.celebrities as Celebrity[],
            createdAt: new Date(match.created_at)
          }));
          
          setMatches(formattedMatches);
        }
      } catch (error: any) {
        console.error('Error loading matches:', error.message);
        toast({
          title: 'Error loading matches',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoadingMatches(false);
      }
    }

    if (user) {
      loadProfileData();
      loadMatches();
    } else if (!loading) {
      setIsLoadingProfile(false);
      setIsLoadingMatches(false);
    }
  }, [user, loading, toast]);

  const handleLogout = async () => {
    try {
      await signOut();
      // The navigation and toast notification are handled in the AuthContext
    } catch (error: any) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Show loading state
  if (isLoadingProfile || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="animate-spin-slow">
            <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  // Fallback avatar for users without a profile image
  const avatarUrl = profileData?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="mb-8 animate-slide-up">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4 mr-1" />
              <span className="px-2 py-0.5 text-xs font-medium">Your Profile</span>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20">
                <img
                  src={avatarUrl}
                  alt={profileData?.name || 'User'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mt-2 mb-1">{profileData?.name || 'User'}</h1>
            <p className="text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="history" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="history" className="text-sm">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Your Celebrity Matches</h2>
            
            {isLoadingMatches ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin-slow">
                  <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </div>
            ) : matches.length > 0 ? (
              <div className="space-y-6">
                {matches.map((match) => (
                  <div 
                    key={match.id}
                    className="bg-background border border-border rounded-lg p-4 transition-all hover:shadow-subtle"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-muted-foreground">
                        {match.createdAt.toLocaleDateString()}
                      </p>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View Details
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="w-20 h-20 rounded-md overflow-hidden">
                        <img
                          src={match.userImage}
                          alt="You"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {match.celebrities.map((celebrity) => (
                        <div key={celebrity.id} className="relative w-20 h-20 rounded-md overflow-hidden">
                          <img
                            src={celebrity.image}
                            alt={celebrity.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                            {celebrity.matchPercentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't made any matches yet.
                </p>
                <Button
                  onClick={() => navigate("/upload")}
                >
                  Try It Now
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="settings">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-background border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your account
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-background border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your password
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-background border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">Privacy Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage how your data is used
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-background border border-destructive/20 rounded-lg">
                  <div>
                    <h3 className="font-medium text-destructive">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="text-destructive border-destructive/50">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 mt-6 border-t border-border">
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
