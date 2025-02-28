
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { UploadStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Camera } from "lucide-react";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Set status to uploading
      setStatus("uploading");
      
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Set status to processing
      setStatus("processing");
      
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Set status to success
      setStatus("success");
      
      // Navigate to results page with mock data
      // In a real app, we'd pass the actual results from the API
      navigate("/results", { 
        state: { 
          userImage: URL.createObjectURL(selectedFile),
          // Mock celebrity matches for demonstration
          celebrities: [
            { 
              id: "1", 
              name: "Ryan Reynolds", 
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80", 
              matchPercentage: 87 
            },
            { 
              id: "2", 
              name: "Zendaya", 
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80", 
              matchPercentage: 82 
            },
            { 
              id: "3", 
              name: "Michael B. Jordan", 
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80", 
              matchPercentage: 75 
            },
            { 
              id: "4", 
              name: "Emma Stone", 
              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80", 
              matchPercentage: 70 
            },
          ]
        } 
      });
      
    } catch (error) {
      setStatus("error");
      toast({
        title: "Error",
        description: "There was a problem processing your image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
            <Camera className="h-4 w-4 mr-1" />
            <span className="px-2 py-0.5 text-xs font-medium">Upload your photo</span>
          </div>
          
          <h1 className="text-3xl font-bold mt-2 mb-3">Find Your Celebrity Lookalike</h1>
          <p className="text-muted-foreground">
            Upload a clear photo of your face, and our AI will find your celebrity doppelgängers.
          </p>
        </div>
        
        <div className="space-y-8 animate-fade-in">
          <ImageUploader
            onImageSelected={handleImageSelected}
            status={status}
          />
          
          {selectedFile && status === "idle" && (
            <div className="text-center">
              <Button 
                onClick={handleSubmit}
                className="mt-4 group"
                size="lg"
              >
                Find My Celebrity Twin
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <p className="mt-4 text-sm text-muted-foreground">
                By uploading, you agree to our{" "}
                <a href="/terms" className="underline">Terms of Service</a>{" "}
                and{" "}
                <a href="/privacy" className="underline">Privacy Policy</a>
              </p>
            </div>
          )}
          
          {status === "uploading" && (
            <div className="text-center animate-pulse">
              <p className="text-muted-foreground">Uploading your photo...</p>
            </div>
          )}
          
          {status === "processing" && (
            <div className="text-center animate-pulse">
              <p className="text-muted-foreground">Analyzing your features...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
