
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  status: UploadStatus;
}

const ImageUploader = ({ onImageSelected, status }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onImageSelected(file);
  };

  const clearImage = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!preview ? (
        <div
          className={cn(
            "upload-zone",
            dragActive ? "upload-zone-active" : "",
            status === "uploading" ? "opacity-70 pointer-events-none" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
            disabled={status === "uploading" || status === "processing"}
          />
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium mb-1">
                Drag and drop your photo
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                or click to browse from your computer
              </p>
              <Button 
                onClick={handleButtonClick}
                disabled={status === "uploading" || status === "processing"}
                className="mt-2"
              >
                Upload Image
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-4">
              JPG, PNG, GIF • Max 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-border animate-scale-up">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full aspect-square object-cover"
          />
          {status !== "uploading" && status !== "processing" && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {(status === "uploading" || status === "processing") && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex flex-col items-center text-white">
                <div className="animate-spin-slow mb-3">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
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
                <p>{status === "uploading" ? "Uploading..." : "Processing..."}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
