
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Celebrity, UploadStatus } from "@/lib/types";
import { Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { loadFaceApiModels, precomputeCelebrityDescriptors, findCelebrityMatch } from "@/lib/faceMatching";

const Upload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [modelsLoading, setModelsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Load face-api.js models on component mount
    const initializeFaceApi = async () => {
      try {
        await loadFaceApiModels();
        await precomputeCelebrityDescriptors();
        setModelsLoading(false);
        toast({
          title: "Ready to match!",
          description: "Face recognition models loaded successfully.",
        });
      } catch (error) {
        console.error('Error initializing face-api:', error);
        setModelsLoading(false);
        toast({
          title: "Model loading failed",
          description: "Some features may not work properly. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    initializeFaceApi();
  }, [toast]);

  const handleImageUpload = async (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    setUploadStatus("idle");
  };

  const handleProcessImage = async () => {
    if (!uploadedImageUrl) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    if (modelsLoading) {
      toast({
        title: "Please wait",
        description: "Face recognition models are still loading...",
        variant: "destructive",
      });
      return;
    }

    setUploadStatus("processing");

    try {
      // Use client-side face matching
      const celebrities = await findCelebrityMatch(uploadedImageUrl);
      
      // Save match to database if user is logged in
      let matchId = undefined;
      if (user && celebrities.length > 0) {
        try {
          const { data, error } = await supabase
            .from("celebrity_matches")
            .insert({
              user_id: user.id,
              user_image: uploadedImageUrl,
              celebrities: celebrities as any, // Cast to any to satisfy Json type
            })
            .select()
            .single();

          if (error) {
            console.error("Error saving match:", error);
          } else {
            matchId = data.id;
          }
        } catch (dbError) {
          console.error("Database error:", dbError);
          // Continue without saving to database
        }
      }
      
      // Navigate to results page with the processed data
      navigate("/results", {
        state: {
          userImage: uploadedImageUrl,
          celebrities: celebrities,
          matchId: matchId,
        },
      });

      setUploadStatus("success");
    } catch (error) {
      console.error("Error processing image:", error);
      setUploadStatus("error");
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="mb-8 animate-slide-up">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
              <Camera className="h-4 w-4 mr-1" />
              <span className="px-2 py-0.5 text-xs font-medium">Celebrity Twin Finder</span>
            </div>
            
            <h1 className="text-3xl font-bold mt-2 mb-3">Find Your Celebrity Twin! 🎭</h1>
            <p className="text-muted-foreground">
              Upload a clear, front-facing photo and discover which celebrity you look like most.
              Share your match with friends and see who gets the highest score!
            </p>
            
            {modelsLoading && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  🧠 Loading AI face recognition models... This may take a moment.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="max-w-md mx-auto">
          <ImageUploader 
            onImageSelected={(file) => {
              setUploadStatus("uploading");
              
              // Create object URL for immediate preview
              const imageUrl = URL.createObjectURL(file);
              handleImageUpload(imageUrl);
            }}
            status={uploadStatus}
          />
          
          {uploadedImageUrl && uploadStatus !== "uploading" && (
            <div className="mt-8 text-center animate-fade-in">
              <Button 
                size="lg" 
                onClick={handleProcessImage}
                disabled={uploadStatus === "processing" || modelsLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {uploadStatus === "processing" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing your face...
                  </>
                ) : modelsLoading ? (
                  "Loading AI models..."
                ) : "🔍 Find My Celebrity Twin!"}
              </Button>
              
              <p className="text-sm text-muted-foreground mt-2">
                {modelsLoading 
                  ? "Please wait for the AI models to finish loading" 
                  : "Our AI will analyze your facial features and find your celebrity doppelgänger!"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
