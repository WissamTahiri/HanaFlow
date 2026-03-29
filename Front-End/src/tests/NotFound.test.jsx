import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "../pages/NotFound.jsx";

const renderNotFound = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    </HelmetProvider>
  );

describe("NotFound (page 404)", () => {
  it("affiche le code 404", () => {
    renderNotFound();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("affiche le titre 'Page introuvable'", () => {
    renderNotFound();
    expect(screen.getByRole("heading", { name: /page introuvable/i })).toBeInTheDocument();
  });

  it("affiche un lien vers l'accueil", () => {
    renderNotFound();
    const link = screen.getByRole("link", { name: /retour à l'accueil/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("affiche un lien vers les modules SAP", () => {
    renderNotFound();
    const link = screen.getByRole("link", { name: /modules sap/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/modules-sap");
  });
});
