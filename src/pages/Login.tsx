
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AuthForm from "@/components/AuthForm";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (data: any) => {
    // In a real app, this would send credentials to an API
    // For now, we'll simulate a successful login and redirect
    
    // Simulate successful login
    navigate("/profile");
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <AuthForm type="login" onSubmit={handleLogin} />
      </div>
    </Layout>
  );
};

export default Login;
