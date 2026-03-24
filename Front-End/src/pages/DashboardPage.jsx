import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-sapDark text-white">
      <div className="bg-sapCard border border-white/5 rounded-2xl p-6 max-w-md w-full">
        <h1 className="text-xl font-semibold mb-2">Dashboard</h1>
        <p className="text-sm text-sapMuted mb-1">
          Bienvenue {user?.name || "utilisateur"} !
        </p>
        <p className="text-xs text-sapMuted mb-6">{user?.email}</p>

        <button
          onClick={handleLogout}
          className="text-xs text-red-400 hover:text-red-300 transition"
        >
          Se déconnecter
        </button>
      </div>
    </section>
  );
};

export default DashboardPage;
