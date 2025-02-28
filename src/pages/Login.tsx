
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AuthForm from "@/components/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, loading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoggingIn(true);
    
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
      } else {
        // Navigate happens automatically through the useEffect in AuthContext
        // The toast is also handled there
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Redirect if already logged in
  if (user && !loading) {
    return <Navigate to="/profile" />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <AuthForm 
          type="login" 
          onSubmit={handleLogin} 
          isSubmitting={isLoggingIn}
        />
      </div>
    </Layout>
  );
};

export default Login;
