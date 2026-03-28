import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useProgress } from "./hooks/useProgress.js";
import { useAuth } from "./context/AuthContext.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PageLoader from "./components/PageLoader.jsx";

// --- Lazy loading — Pages publiques ---
const Home = lazy(() => import("./pages/Home.jsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const ModulesOverview = lazy(() => import("./pages/ModulesOverview.jsx"));
const S4HANAOverview = lazy(() => import("./pages/S4HANAOverview.jsx"));
const AIJoule = lazy(() => import("./pages/AIJoule.jsx"));
const ProcessusMetier = lazy(() => import("./pages/ProcessusMetier.jsx"));
const Roadmap = lazy(() => import("./pages/Roadmap.jsx"));

// --- Lazy loading — Modules SAP (pages lourdes 23-29 KB) ---
const FI = lazy(() => import("./pages/FI.jsx"));
const CO = lazy(() => import("./pages/CO.jsx"));
const MM = lazy(() => import("./pages/MM.jsx"));
const SD = lazy(() => import("./pages/SD.jsx"));
const HCM = lazy(() => import("./pages/HCM.jsx"));
const PP = lazy(() => import("./pages/PP.jsx"));

// --- Lazy loading — Authentification & Profil ---
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

// Wrapper qui marque un module SAP comme visité dès que la page est affichée
const ModuleTracker = ({ module, children }) => {
  const { isAuthenticated } = useAuth();
  const { markVisited } = useProgress();
  useEffect(() => {
    if (isAuthenticated) markVisited(module);
  }, [module, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Pages principales */}
              <Route path="/" element={<Home />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/modules-sap" element={<ModulesOverview />} />
              <Route path="/s4hana" element={<S4HANAOverview />} />
              <Route path="/ai-joule" element={<AIJoule />} />
              <Route path="/processus-metier" element={<ProcessusMetier />} />
              <Route path="/roadmap" element={<Roadmap />} />

              {/* Modules SAP — tracking automatique de progression */}
              <Route path="/modules-sap/fi"  element={<ModuleTracker module="fi"><FI /></ModuleTracker>} />
              <Route path="/modules-sap/co"  element={<ModuleTracker module="co"><CO /></ModuleTracker>} />
              <Route path="/modules-sap/mm"  element={<ModuleTracker module="mm"><MM /></ModuleTracker>} />
              <Route path="/modules-sap/sd"  element={<ModuleTracker module="sd"><SD /></ModuleTracker>} />
              <Route path="/modules-sap/hcm" element={<ModuleTracker module="hcm"><HCM /></ModuleTracker>} />
              <Route path="/modules-sap/pp"  element={<ModuleTracker module="pp"><PP /></ModuleTracker>} />

              {/* Authentification */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Zone protégée */}
              <Route
                path="/dashboard"
                element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
              />
              <Route
                path="/profil"
                element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
