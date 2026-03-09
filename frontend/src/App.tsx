import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Designer = lazy(() => import("./pages/Designer"));

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center bg-[#04070d] text-[var(--text-secondary)]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Designer />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
