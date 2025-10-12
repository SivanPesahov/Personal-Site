import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loggedInUser } = useAuth();

  if (loggedInUser === null) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
