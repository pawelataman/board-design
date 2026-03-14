import { useAuth } from "@clerk/react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Wraps a route that requires authentication.
 * While Clerk is loading, shows a spinner.
 * If the user is not signed in, redirects to /sign-in with return URL.
 */
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#04070d] text-[var(--text-secondary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <Navigate
        to={`/sign-in?redirect_url=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}
