
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <span className="text-xl font-bold text-primary-foreground">AH</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-foreground">AI Hive</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your community feedback hub for AI topics
          </p>
        </div>

        {isLogin ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <SignupForm onToggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default Auth;
