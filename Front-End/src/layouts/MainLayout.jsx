import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-sapGrayLight dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pt-16 pb-10 px-4 sm:px-8 max-w-6xl mx-auto w-full text-slate-900 dark:text-slate-100">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
