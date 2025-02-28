
import { useState } from "react";
import { Celebrity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Twitter, Facebook, Instagram, Download, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CelebrityMatchProps {
  userImage: string;
  celebrities: Celebrity[];
  matchId?: string;
}

const CelebrityMatch = ({ userImage, celebrities, matchId }: CelebrityMatchProps) => {
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(
    celebrities.length > 0 ? celebrities[0] : null
  );
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCelebritySelect = (celebrity: Celebrity) => {
    setSelectedCelebrity(celebrity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Celebrity Match',
        text: `I look ${selectedCelebrity?.matchPercentage}% like ${selectedCelebrity?.name}!`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      toast({
        title: "Sharing not supported",
        description: "Web Share API is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  const handleSaveImage = () => {
    // In a real app, you would implement image saving logic here
    toast({
      title: "Image Saved",
      description: "Your match has been saved to your account.",
    });
  };

  const handleSocialShare = (platform: string) => {
    // In a real app, you would implement social sharing logic here
    toast({
      title: `Shared on ${platform}`,
      description: `Your match has been shared on ${platform}.`,
    });
  };

  const promptLogin = () => {
    toast({
      title: "Login Required",
      description: "Create an account to save your matches.",
    });
    navigate("/login");
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
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
              <h3 className="text-xl font-medium">Match Details</h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Match Accuracy</span>
                    <span className="font-medium">{selectedCelebrity.matchPercentage}%</span>
                  </div>
                  <Progress value={selectedCelebrity.matchPercentage} className="h-2" />
                </div>
              </div>

              <div className="pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={user ? handleSaveImage : promptLogin}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Save
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
                    onClick={() => handleSocialShare("Instagram")}
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
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/80 text-black backdrop-blur-sm hover:bg-white/90">Celebrity</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Celebrity Selection */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 text-center">Other Matches</h3>
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
