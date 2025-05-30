
import { useState, useEffect } from "react";
import { Celebrity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Twitter, Facebook, Instagram, Download, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ShareImageGenerator from "./ShareImageGenerator";
import { generateShareableContent } from "@/lib/faceMatching";

interface CelebrityMatchProps {
  userImage: string;
  celebrities: Celebrity[];
  matchId?: string;
}

const CelebrityMatch = ({ userImage, celebrities, matchId }: CelebrityMatchProps) => {
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(
    celebrities.length > 0 ? celebrities[0] : null
  );
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCelebritySelect = (celebrity: Celebrity) => {
    setSelectedCelebrity(celebrity);
    setShareImageUrl(null); // Reset share image when celebrity changes
  };

  const handleShare = () => {
    if (!selectedCelebrity) return;

    const shareContent = generateShareableContent(selectedCelebrity, userImage);
    
    if (navigator.share) {
      navigator.share({
        title: shareContent.title,
        text: `${shareContent.description} ${shareContent.hashtags}`,
        url: shareContent.shareUrl,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback: copy to clipboard
      const shareText = `${shareContent.title}\n${shareContent.description}\n${shareContent.hashtags}\n${shareContent.shareUrl}`;
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "Share text has been copied. Paste it anywhere to share your match!",
        });
      });
    }
  };

  const handleDownload = () => {
    if (shareImageUrl) {
      const link = document.createElement('a');
      link.download = `celebrity-match-${selectedCelebrity?.name}.png`;
      link.href = shareImageUrl;
      link.click();
      
      toast({
        title: "Image Downloaded",
        description: "Your celebrity match image has been saved!",
      });
    } else {
      toast({
        title: "Image not ready",
        description: "Please wait for the share image to generate.",
        variant: "destructive",
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    if (!selectedCelebrity) return;
    
    const shareContent = generateShareableContent(selectedCelebrity, userImage);
    let shareUrl = '';
    
    switch (platform) {
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareContent.title} ${shareContent.description} ${shareContent.hashtags}`)}&url=${encodeURIComponent(shareContent.shareUrl)}`;
        break;
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.shareUrl)}&quote=${encodeURIComponent(`${shareContent.title} ${shareContent.description}`)}`;
        break;
      case 'WhatsApp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareContent.title} ${shareContent.description} ${shareContent.hashtags} ${shareContent.shareUrl}`)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const promptLogin = () => {
    toast({
      title: "Login Required",
      description: "Create an account to save your matches and download images.",
    });
    navigate("/login");
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      {selectedCelebrity && (
        <ShareImageGenerator
          userImage={userImage}
          celebrity={selectedCelebrity}
          onImageGenerated={setShareImageUrl}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Image */}
        <div className="order-1 md:order-1">
          <div className="relative aspect-square rounded-lg overflow-hidden border border-border mb-3">
            <img
              src={userImage}
              alt="Your photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/80 text-black backdrop-blur-sm hover:bg-white/90">You</Badge>
            </div>
          </div>
        </div>

        {/* Comparison Info */}
        <div className="flex flex-col items-center justify-center order-3 md:order-2">
          {selectedCelebrity && (
            <div className="w-full text-center space-y-6">
              <h3 className="text-xl font-medium">🎭 Celebrity Twin Found!</h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Match Accuracy</span>
                    <span className="font-medium">{selectedCelebrity.matchPercentage}%</span>
                  </div>
                  <Progress value={selectedCelebrity.matchPercentage} className="h-3" />
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-semibold text-primary">
                    {selectedCelebrity.matchPercentage >= 80 && "🔥 Incredible match!"}
                    {selectedCelebrity.matchPercentage >= 60 && selectedCelebrity.matchPercentage < 80 && "✨ Great similarity!"}
                    {selectedCelebrity.matchPercentage >= 40 && selectedCelebrity.matchPercentage < 60 && "👀 Nice resemblance!"}
                    {selectedCelebrity.matchPercentage < 40 && "🎭 Unique look!"}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={user ? handleDownload : promptLogin}
                    disabled={!shareImageUrl}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <div className="flex justify-center space-x-3 mt-4">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-full w-8 h-8"
                    onClick={() => handleSocialShare("Twitter")}
                  >
                    <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-full w-8 h-8"
                    onClick={() => handleSocialShare("Facebook")}
                  >
                    <Facebook className="h-4 w-4 text-[#4267B2]" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-full w-8 h-8"
                    onClick={() => handleSocialShare("WhatsApp")}
                  >
                    <Instagram className="h-4 w-4 text-[#E1306C]" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Celebrity Image */}
        <div className="order-2 md:order-3">
          <div className="relative aspect-square rounded-lg overflow-hidden border border-border mb-3">
            {selectedCelebrity ? (
              <img
                src={selectedCelebrity.image}
                alt={selectedCelebrity.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <p className="text-muted-foreground">No celebrity selected</p>
              </div>
            )}
            {selectedCelebrity && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/80 text-black backdrop-blur-sm hover:bg-white/90">
                  {selectedCelebrity.name}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Celebrity Selection */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 text-center">Other Celebrity Matches</h3>
        <div className="flex overflow-x-auto py-2 space-x-4 scrollbar-thin">
          {celebrities.map((celebrity) => (
            <div
              key={celebrity.id}
              className={cn(
                "flex-shrink-0 cursor-pointer transition-all duration-200",
                "w-20 md:w-24 text-center",
                selectedCelebrity?.id === celebrity.id 
                  ? "scale-105" 
                  : "opacity-70 hover:opacity-100"
              )}
              onClick={() => handleCelebritySelect(celebrity)}
            >
              <div className={cn(
                "rounded-lg overflow-hidden mb-2 aspect-square",
                "border-2 transition-colors",
                selectedCelebrity?.id === celebrity.id 
                  ? "border-primary" 
                  : "border-transparent"
              )}>
                <img
                  src={celebrity.image}
                  alt={celebrity.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs truncate">{celebrity.name}</p>
              <p className="text-xs text-muted-foreground">{celebrity.matchPercentage}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CelebrityMatch;
