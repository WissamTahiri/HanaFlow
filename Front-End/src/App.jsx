import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useProgress } from "./hooks/useProgress.js";
import { useAuth } from "./context/AuthContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PageLoader from "./components/PageLoader.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

// --- Lazy loading — Pages publiques ---
const Home             = lazy(() => import("./pages/Home.jsx"));
const AboutPage        = lazy(() => import("./pages/AboutPage.jsx"));
const ModulesOverview  = lazy(() => import("./pages/ModulesOverview.jsx"));
const S4HANAOverview   = lazy(() => import("./pages/S4HANAOverview.jsx"));
const AIJoule          = lazy(() => import("./pages/AIJoule.jsx"));
const ProcessusMetier  = lazy(() => import("./pages/ProcessusMetier.jsx"));
const Roadmap          = lazy(() => import("./pages/Roadmap.jsx"));

// --- Lazy loading — Modules SAP ---
const FI  = lazy(() => import("./pages/FI.jsx"));
const CO  = lazy(() => import("./pages/CO.jsx"));
const MM  = lazy(() => import("./pages/MM.jsx"));
const SD  = lazy(() => import("./pages/SD.jsx"));
const HCM = lazy(() => import("./pages/HCM.jsx"));
const PP  = lazy(() => import("./pages/PP.jsx"));

// --- Lazy loading — Certifications ---
const Certifications      = lazy(() => import("./pages/Certifications.jsx"));
const CertificationFI     = lazy(() => import("./pages/CertificationFI.jsx"));
const ExamSimulator       = lazy(() => import("./pages/ExamSimulator.jsx"));
const CertificationCO     = lazy(() => import("./pages/CertificationCO.jsx"));
const ExamSimulatorCO     = lazy(() => import("./pages/ExamSimulatorCO.jsx"));
const CertificationMM     = lazy(() => import("./pages/CertificationMM.jsx"));
const ExamSimulatorMM     = lazy(() => import("./pages/ExamSimulatorMM.jsx"));

// --- Lazy loading — Auth & Profil ---
const LoginPage     = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage  = lazy(() => import("./pages/RegisterPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const ProfilePage   = lazy(() => import("./pages/ProfilePage.jsx"));
const NotFound      = lazy(() => import("./pages/NotFound.jsx"));

// Wrapper qui marque un module SAP comme visité dès que la page est affichée
const ModuleTracker = ({ module, children }) => {
  const { isAuthenticated } = useAuth();
  const { markVisited } = useProgress();
  useEffect(() => {
    if (isAuthenticated) markVisited(module);
  }, [module, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps
  return children;
};

// AppInner is inside Router so it can call useLocation for page transitions
function AppInner() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-sapDark">
      <ScrollToTop />
      <Navbar />

      {/* pt-16 pour compenser la navbar fixe (h-16) */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="flex-1 pt-16"
        >
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Pages principales */}
              <Route path="/"                  element={<Home />} />
              <Route path="/a-propos"          element={<AboutPage />} />
              <Route path="/modules-sap"       element={<ModulesOverview />} />
              <Route path="/s4hana"            element={<S4HANAOverview />} />
              <Route path="/ai-joule"          element={<AIJoule />} />
              <Route path="/processus-metier"  element={<ProcessusMetier />} />
              <Route path="/roadmap"           element={<Roadmap />} />

              {/* Certifications */}
              <Route path="/certifications"             element={<Certifications />} />
              <Route path="/certifications/fi"          element={<ProtectedRoute><CertificationFI /></ProtectedRoute>} />
              <Route path="/certifications/fi/examen"   element={<ProtectedRoute><ExamSimulator /></ProtectedRoute>} />
              <Route path="/certifications/co"          element={<ProtectedRoute><CertificationCO /></ProtectedRoute>} />
              <Route path="/certifications/co/examen"   element={<ProtectedRoute><ExamSimulatorCO /></ProtectedRoute>} />
              <Route path="/certifications/mm"          element={<ProtectedRoute><CertificationMM /></ProtectedRoute>} />
              <Route path="/certifications/mm/examen"   element={<ProtectedRoute><ExamSimulatorMM /></ProtectedRoute>} />

              {/* Modules SAP — tracking automatique */}
              <Route path="/modules-sap/fi"  element={<ModuleTracker module="fi"><FI /></ModuleTracker>} />
              <Route path="/modules-sap/co"  element={<ModuleTracker module="co"><CO /></ModuleTracker>} />
              <Route path="/modules-sap/mm"  element={<ModuleTracker module="mm"><MM /></ModuleTracker>} />
              <Route path="/modules-sap/sd"  element={<ModuleTracker module="sd"><SD /></ModuleTracker>} />
              <Route path="/modules-sap/hcm" element={<ModuleTracker module="hcm"><HCM /></ModuleTracker>} />
              <Route path="/modules-sap/pp"  element={<ModuleTracker module="pp"><PP /></ModuleTracker>} />

              {/* Auth */}
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Zone protégée */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profil"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
