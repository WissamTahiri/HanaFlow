import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/AboutPage.jsx";
import ModulesOverview from "../pages/ModulesOverview.jsx";
import S4HANAOverview from "../pages/S4HANAOverview.jsx";
import FI from "../pages/FI.jsx";
import CO from "../pages/CO.jsx";
import MM from "../pages/MM.jsx";
import SD from "../pages/SD.jsx";
import HCM from "../pages/HCM.jsx";
import PP from "../pages/PP.jsx";
import AIJoule from "../pages/AIJoule.jsx";
import ProcessusMetier from "../pages/ProcessusMetier.jsx";
import Roadmap from "../pages/Roadmap.jsx";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/a-propos" element={<About />} />
      <Route path="/modules-sap" element={<ModulesOverview />} />
      <Route path="/s4hana" element={<S4HANAOverview />} />

      <Route path="/modules-sap/fi" element={<FI />} />
      <Route path="/modules-sap/co" element={<CO />} />
      <Route path="/modules-sap/mm" element={<MM />} />
      <Route path="/modules-sap/sd" element={<SD />} />
      <Route path="/modules-sap/hcm" element={<HCM />} />
      <Route path="/modules-sap/pp" element={<PP />} />
      <Route path="/ai-joule" element={<AIJoule />} />
      <Route path="/processus-metier" element={<ProcessusMetier />} />
      <Route path="/roadmap" element={<Roadmap />} />

      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default Router;
