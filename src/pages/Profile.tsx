
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Celebrity } from "@/lib/types";
import { ArrowLeft, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CelebrityMatch from "@/components/CelebrityMatch";

interface MatchHistoryItem {
  id: string;
  created_at: string;
  user_image: string;
  celebrities: Celebrity[];
}

const Profile = () => {
  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<MatchHistoryItem | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMatchHistory = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("celebrity_matches")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        // Type assertion to ensure data conforms to the MatchHistoryItem interface
        const typedData = data.map(item => {
          return {
            ...item,
            celebrities: Array.isArray(item.celebrities) 
              ? item.celebrities as Celebrity[] 
              : []
          } as MatchHistoryItem;
        });

        setMatchHistory(typedData);
      } catch (error) {
        console.error("Error fetching match history:", error);
        toast({
          title: "Error",
          description: "Failed to load your match history.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchHistory();
  }, [user, navigate, toast]);

  const viewMatch = (match: MatchHistoryItem) => {
    setSelectedMatch(match);
  };

  const goBack = () => {
    setSelectedMatch(null);
  };

  if (selectedMatch) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={goBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to History
          </Button>
          
          <CelebrityMatch
            userImage={selectedMatch.user_image}
            celebrities={selectedMatch.celebrities}
            matchId={selectedMatch.id}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
              <History className="h-4 w-4 mr-1" />
              <span className="px-2 py-0.5 text-xs font-medium">Match History</span>
            </div>
            
            <h1 className="text-3xl font-bold mt-2 mb-3">Your Celebrity Matches</h1>
            <p className="text-muted-foreground">
              View your past celebrity match results.
            </p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin-slow">
              <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24">
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
        ) : matchHistory.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">You haven't made any celebrity matches yet.</p>
            <Button onClick={() => navigate("/upload")}>
              Try Your First Match
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchHistory.map((match) => (
              <div
                key={match.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => viewMatch(match)}
              >
                <div className="aspect-square relative">
                  <img
                    src={match.user_image}
                    alt="Your uploaded photo"
                    className="w-full h-full object-cover"
                  />
                  {match.celebrities[0] && (
                    <div className="absolute bottom-0 right-0 p-2">
                      <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
                        <img
                          src={match.celebrities[0].image}
                          alt={match.celebrities[0].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium">
                    {match.celebrities[0]
                      ? `Matched with ${match.celebrities[0].name}`
                      : "No match found"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(match.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {matchHistory.length > 0 && (
          <div className="mt-8 text-center">
            <Button onClick={() => navigate("/upload")} variant="outline">
              Try Another Match
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
