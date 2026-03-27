import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

// --- Lazy loading — Authentification ---
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

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

              {/* Modules SAP détaillés */}
              <Route path="/modules-sap/fi" element={<FI />} />
              <Route path="/modules-sap/co" element={<CO />} />
              <Route path="/modules-sap/mm" element={<MM />} />
              <Route path="/modules-sap/sd" element={<SD />} />
              <Route path="/modules-sap/hcm" element={<HCM />} />
              <Route path="/modules-sap/pp" element={<PP />} />

              {/* Authentification */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Zone protégée */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
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
