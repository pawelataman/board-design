import { SignIn } from "@clerk/react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#123047_0%,#081321_42%,#04070d_100%)]">
      <SignIn
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/boards"
      />
    </div>
  );
}
