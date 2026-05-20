/**
 * Type CV partagé entre la page wizard et le composant PDF.
 *
 * Pourquoi ce fichier séparé : @react-pdf/renderer est un package ESM-only.
 * Importer directement le type depuis `@/components/CvDocument` force webpack
 * à résoudre tout le module au build serveur, ce qui échoue avec
 * "Module not found: ESM packages need to be imported".
 * En séparant les types, la page peut importer le shape sans toucher au
 * runtime react-pdf — qui reste chargé uniquement client-side via next/dynamic.
 */
export type CvData = {
  identity: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  summary: string;
  experiences: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills: {
    sap?: string[];
    technical?: string[];
    methods?: string[];
    soft?: string[];
  };
  certifications: Array<{
    name: string;
    code?: string;
    year?: string;
    issuer?: string;
  }>;
  languages: Array<{ name: string; level: string }>;
};
