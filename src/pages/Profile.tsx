
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Celebrity } from "@/lib/types";
import CelebrityMatch from "@/components/CelebrityMatch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface MatchHistory {
  id: string;
  created_at: string;
  user_id: string;
  user_image: string;
  celebrities: Celebrity[];
}

const Profile = () => {
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>([]);
  const [activeTab, setActiveTab] = useState("history");
  const { user } = useAuth();

  useEffect(() => {
    const fetchMatchHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("match_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching match history:", error);
          return;
        }

        // Transform the data to ensure celebrities are properly typed
        const typedData = data.map(match => ({
          ...match,
          celebrities: match.celebrities as unknown as Celebrity[]
        }));

        setMatchHistory(typedData);
      } catch (error) {
        console.error("Error fetching match history:", error);
      }
    };

    fetchMatchHistory();
  }, [user]);

  return (
    <Layout>
      <div className="container max-w-4xl py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            View your match history and account settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Match History</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="mt-6">
            {matchHistory.length > 0 ? (
              <div className="space-y-6">
                {matchHistory.map((match) => (
                  <div key={match.id} className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-muted/50 flex items-center justify-between border-b">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Celebrity Match</h3>
                          <Badge variant="outline" className="text-xs">
                            {new Date(match.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your top {match.celebrities.length} celebrity matches
                        </p>
                      </div>
                      <Link 
                        to="/results" 
                        state={{ 
                          userImage: match.user_image, 
                          celebrities: match.celebrities,
                          matchId: match.id,
                          fromHistory: true
                        }}
                      >
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                      {match.celebrities.slice(0, 3).map((celebrity, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CelebrityMatch 
                            celebrity={celebrity} 
                            rank={index + 1}
                            minimal={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No matches yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't matched with any celebrities yet.
                </p>
                <Link to="/upload">
                  <Button>Find Your Celebrity Match</Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{user?.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account created</p>
                  <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      await supabase.auth.signOut();
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
