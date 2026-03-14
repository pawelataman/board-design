import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ClerkProvider } from "@clerk/react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL || "/sign-in"}
    signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL || "/sign-up"}
    signInFallbackRedirectUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL || "/boards"}
    signUpFallbackRedirectUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL || "/boards"}
    afterSignOutUrl="/"
  >
    <App />
  </ClerkProvider>,
);
