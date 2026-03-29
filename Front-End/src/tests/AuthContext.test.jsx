import { render, screen, act, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "../context/AuthContext.jsx";

// --- Composant helper pour accéder au contexte dans les tests ---
const AuthDisplay = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <p>Chargement...</p>;
  return (
    <div>
      <p data-testid="auth-status">{isAuthenticated ? "connecté" : "déconnecté"}</p>
      {user && <p data-testid="user-name">{user.name}</p>}
    </div>
  );
};

const renderWithAuth = (ui) =>
  render(
    <HelmetProvider>
      <AuthProvider>{ui}</AuthProvider>
    </HelmetProvider>
  );

// --- Mock global de fetch ---
beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ============================================================
describe("AuthContext — état initial", () => {
  it("affiche 'déconnecté' si aucun token en localStorage", async () => {
    // Pas de token → silentRefresh échoue aussi
    global.fetch.mockResolvedValue({ ok: false, json: async () => ({}) });

    renderWithAuth(<AuthDisplay />);

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("déconnecté");
    });
  });

  it("restaure la session si un token valide est en localStorage", async () => {
    localStorage.setItem("token", "valid-token");

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: 1, name: "Wissam", email: "w@test.com", role: "student" } }),
    });

    renderWithAuth(<AuthDisplay />);

    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("Wissam");
      expect(screen.getByTestId("auth-status")).toHaveTextContent("connecté");
    });
  });
});

// ============================================================
describe("AuthContext — login", () => {
  it("connecte l'utilisateur et stocke le token", async () => {
    // Init sans token : silentRefresh échoue
    global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });

    const TestLogin = () => {
      const { login, isAuthenticated, user } = useAuth();
      return (
        <div>
          <p data-testid="auth-status">{isAuthenticated ? "connecté" : "déconnecté"}</p>
          {user && <p data-testid="user-name">{user.name}</p>}
          <button
            onClick={() =>
              login({ email: "w@test.com", password: "motdepasse123" })
            }
          >
            Se connecter
          </button>
        </div>
      );
    };

    renderWithAuth(<TestLogin />);
    await waitFor(() => expect(screen.getByTestId("auth-status")).toHaveTextContent("déconnecté"));

    // Mock la réponse du login
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "new-access-token",
        user: { id: 1, name: "Wissam", email: "w@test.com", role: "student" },
      }),
    });

    await act(async () => {
      screen.getByRole("button", { name: /se connecter/i }).click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("connecté");
      expect(screen.getByTestId("user-name")).toHaveTextContent("Wissam");
      expect(localStorage.getItem("token")).toBe("new-access-token");
    });
  });

  it("lève une erreur si le login échoue", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) }); // init

    const TestLoginError = () => {
      const { login } = useAuth();
      const [error, setError] = React.useState(null);
      return (
        <div>
          {error && <p data-testid="error">{error}</p>}
          <button onClick={() => login({ email: "x@x.com", password: "wrong" }).catch((e) => setError(e.message))}>
            Connecter
          </button>
        </div>
      );
    };

    const { default: React } = await import("react");
    renderWithAuth(<TestLoginError />);

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Identifiants invalides" }),
    });

    await act(async () => {
      screen.getByRole("button", { name: /connecter/i }).click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("Identifiants invalides");
    });
  });
});

// ============================================================
describe("AuthContext — logout", () => {
  it("déconnecte l'utilisateur et vide le localStorage", async () => {
    localStorage.setItem("token", "valid-token");

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 1, name: "Wissam", email: "w@test.com", role: "student" } }),
      }) // /auth/me
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // /auth/logout

    const TestLogout = () => {
      const { logout, isAuthenticated } = useAuth();
      return (
        <div>
          <p data-testid="auth-status">{isAuthenticated ? "connecté" : "déconnecté"}</p>
          <button onClick={logout}>Déconnexion</button>
        </div>
      );
    };

    renderWithAuth(<TestLogout />);
    await waitFor(() => expect(screen.getByTestId("auth-status")).toHaveTextContent("connecté"));

    await act(async () => {
      screen.getByRole("button", { name: /déconnexion/i }).click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("déconnecté");
      expect(localStorage.getItem("token")).toBeNull();
    });
  });
});
