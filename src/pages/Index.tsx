
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Camera, Upload, Image, Share2, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: "Easy Upload",
      description: "Upload your photo in seconds with our simple drag-and-drop interface.",
    },
    {
      icon: <Image className="h-8 w-8" />,
      title: "AI Matching",
      description: "Our advanced AI technology finds your celebrity lookalikes with impressive accuracy.",
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: "Share Everywhere",
      description: "Easily share your results on social media or download them to your device.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy First",
      description: "Your photos are processed securely and never stored longer than necessary.",
    },
  ];

  const celebrityExamples = [
    {
      name: "Ryan Reynolds",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    {
      name: "Zendaya",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    {
      name: "Michael B. Jordan",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    {
      name: "Emma Stone",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    },
  ];

  return (
    <Layout fullWidth>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 z-10"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className={cn(
              "transition-all duration-1000 ease-in-expo",
              isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
            )}>
              <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
                <span className="px-3 py-0.5 text-xs font-medium">
                  Find your celebrity twin
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Discover Your Celebrity Doppelgänger
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Upload your photo and our AI will find which celebrities look just like you. 
                Share your results and surprise your friends!
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/upload">
                  <Button size="lg" className="w-full sm:w-auto group">
                    Try It Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Our platform uses advanced facial recognition technology to match your features with thousands of celebrities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "bg-background p-6 rounded-lg border border-border",
                  "transition-all duration-500 hover:shadow-subtle hover:border-primary/20",
                  "transform hover:-translate-y-1"
                )}
              >
                <div className="p-3 mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Celebrity Examples</h2>
            <p className="text-muted-foreground">
              Our database includes thousands of celebrities from movies, music, sports, and more.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {celebrityExamples.map((celebrity, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-lg aspect-[3/4] transition-all duration-300 hover:shadow-elevated"
              >
                <img
                  src={celebrity.image}
                  alt={celebrity.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="font-medium">{celebrity.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Celebrity Twin?
            </h2>
            <p className="text-white/80 text-xl mb-8">
              Join thousands of users who have already discovered their celebrity lookalikes.
            </p>
            <Link to="/upload">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
