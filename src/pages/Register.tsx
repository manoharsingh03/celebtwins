
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AuthForm from "@/components/AuthForm";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = (data: any) => {
    // In a real app, this would send registration data to an API
    // For now, we'll simulate a successful registration and redirect
    
    // Simulate successful registration
    navigate("/profile");
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <AuthForm type="register" onSubmit={handleRegister} />
      </div>
    </Layout>
  );
};

export default Register;
