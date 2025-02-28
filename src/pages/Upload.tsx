
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Celebrity, UploadStatus } from "@/lib/types";
import { Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Upload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

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

    setUploadStatus("processing");

    try {
      // Get token for authenticated requests
      let authHeader = null;
      if (user) {
        const { data } = await supabase.auth.getSession();
        authHeader = data.session?.access_token 
          ? `Bearer ${data.session.access_token}` 
          : null;
      }

      // Call our celebrity match API function
      const response = await fetch('/functions/v1/celebrity-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        },
        body: JSON.stringify({
          imageUrl: uploadedImageUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process image");
      }

      const data = await response.json();
      
      // Navigate to results page with the processed data
      navigate("/results", {
        state: {
          userImage: uploadedImageUrl,
          celebrities: data.celebrities as Celebrity[],
          matchId: data.matchId,
        },
      });

      setUploadStatus("success");
    } catch (error) {
      console.error("Error processing image:", error);
      setUploadStatus("error");
      toast({
        title: "Processing failed",
        description: "Failed to analyze the image. Please try again.",
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
              <span className="px-2 py-0.5 text-xs font-medium">Celebrity Match</span>
            </div>
            
            <h1 className="text-3xl font-bold mt-2 mb-3">Upload Your Photo</h1>
            <p className="text-muted-foreground">
              Upload a clear, front-facing photo of yourself to find your celebrity doppelgänger.
            </p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto">
          <ImageUploader 
            onImageSelected={(file) => {
              setUploadStatus("uploading");
              
              // Create a FormData object to send the file
              const formData = new FormData();
              formData.append('file', file);
              
              // Upload the file to Supabase storage through our edge function
              fetch('/functions/v1/upload-image', {
                method: 'POST',
                body: formData,
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Failed to upload image');
                  }
                  return response.json();
                })
                .then(data => {
                  handleImageUpload(data.imageUrl);
                })
                .catch(error => {
                  console.error('Error uploading image:', error);
                  setUploadStatus("error");
                  toast({
                    title: "Upload failed",
                    description: "Failed to upload the image. Please try again.",
                    variant: "destructive",
                  });
                });
            }}
            status={uploadStatus}
          />
          
          {uploadedImageUrl && uploadStatus !== "uploading" && (
            <div className="mt-8 text-center animate-fade-in">
              <Button 
                size="lg" 
                onClick={handleProcessImage}
                disabled={uploadStatus === "processing"}
              >
                {uploadStatus === "processing" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : "Find My Celebrity Match"}
              </Button>
              
              <p className="text-sm text-muted-foreground mt-2">
                Our AI will analyze your photo and find your celebrity look-alike
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
