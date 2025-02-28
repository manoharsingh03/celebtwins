
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import CelebrityMatch from "@/components/CelebrityMatch";
import { Button } from "@/components/ui/button";
import { Celebrity } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Camera, ArrowLeft } from "lucide-react";

interface LocationState {
  userImage: string;
  celebrities: Celebrity[];
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  const state = location.state as LocationState;
  
  useEffect(() => {
    // If there's no state (e.g., user navigated directly to this URL),
    // redirect to the upload page
    if (!state?.userImage || !state?.celebrities) {
      toast({
        title: "No results available",
        description: "Please upload an image to see results.",
        variant: "destructive",
      });
      navigate("/upload");
      return;
    }
    
    // Simulate loading delay for a smoother experience
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [state, navigate, toast]);

  if (!state?.userImage || !state?.celebrities) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="mb-8 animate-slide-up">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
              <Camera className="h-4 w-4 mr-1" />
              <span className="px-2 py-0.5 text-xs font-medium">Your Results</span>
            </div>
            
            <h1 className="text-3xl font-bold mt-2 mb-3">Your Celebrity Matches</h1>
            <p className="text-muted-foreground">
              Here are the celebrities that look most like you based on our AI analysis.
            </p>
          </div>
        </div>
        
        {isLoaded ? (
          <CelebrityMatch
            userImage={state.userImage}
            celebrities={state.celebrities}
          />
        ) : (
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
        )}
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Want to try with a different photo?
          </p>
          <Button
            onClick={() => navigate("/upload")}
            variant="outline"
          >
            Upload Another Photo
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Results;
