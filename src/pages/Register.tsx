
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AuthForm from "@/components/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, user, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async (data: { email: string; password: string; name: string }) => {
    setIsRegistering(true);
    
    try {
      const { error } = await signUp(data.email, data.password, data.name);
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message || "Please check your information and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please check your email for verification.",
        });
        // Navigate to login page after successful registration
        navigate("/login");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
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
          type="register" 
          onSubmit={handleRegister} 
          isSubmitting={isRegistering}
        />
      </div>
    </Layout>
  );
};

export default Register;
