"use client";

import { Document, Page, Text, View, StyleSheet, Link, Font } from "@react-pdf/renderer";

/**
 * CV PDF text-based, ATS-friendly.
 *
 * Choix techniques :
 *  - Single-column, pas de tableau : les ATS lisent gauche→droite haut→bas.
 *  - Fonts standards (Helvetica) : pas de Web Font (pas de couche de rasterization).
 *  - Pas de SVG/images : un parseur ATS ne lit que le texte.
 *  - Sections ordonnées par poids ATS : Summary → XP → Skills → Certifs → Edu → Languages.
 *  - Bullets en plain text avec "• " préfixe — universellement parsé.
 */

// On évite tout chargement de font externe (risque de bloquer le rendu serveur)
// et on s'appuie sur Helvetica qui est builtin @react-pdf/renderer.
Font.registerHyphenationCallback((word) => [word]);

const colors = {
  primary: "#2563EB",
  text: "#0F172A",
  muted: "#475569",
  divider: "#E2E8F0",
};

const styles = StyleSheet.create({
  page: {
    padding: 38,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: colors.text,
    lineHeight: 1.45,
  },
  // Header
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  title: { fontSize: 11, color: colors.primary, marginBottom: 6 },
  contactRow: { fontSize: 9, color: colors.muted, marginBottom: 14 },
  // Section
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: 12,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingBottom: 2,
  },
  // Experience
  expRow: { marginBottom: 9 },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 1,
  },
  expTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  expCompany: { fontSize: 10, color: colors.muted, marginBottom: 3 },
  expDates: { fontSize: 9, color: colors.muted },
  bullet: { fontSize: 9.5, marginBottom: 1.5, paddingLeft: 8 },
  // Skills
  skillsBlock: { marginBottom: 4 },
  skillCategory: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
  },
  skillList: { fontSize: 9.5, marginBottom: 4 },
  // Two-col layout (cert/lang)
  twoCol: { flexDirection: "row", gap: 24, marginTop: 4 },
  col: { flex: 1 },
  itemRow: { fontSize: 9.5, marginBottom: 2 },
  itemBold: { fontFamily: "Helvetica-Bold" },
  // Summary
  summary: { fontSize: 10, marginBottom: 6, textAlign: "justify" },
});

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

function dateRange(start: string, end?: string, current?: boolean) {
  const e = current ? "Présent" : (end ?? "");
  return e ? `${start} — ${e}` : start;
}

function contactLine(id: CvData["identity"]): string {
  const parts: string[] = [];
  if (id.email) parts.push(id.email);
  if (id.phone) parts.push(id.phone);
  if (id.location) parts.push(id.location);
  if (id.linkedin) parts.push(id.linkedin);
  return parts.join("  •  ");
}

export default function CvDocument({ cv }: { cv: CvData }) {
  const skillsHas =
    (cv.skills.sap?.length ?? 0) +
      (cv.skills.technical?.length ?? 0) +
      (cv.skills.methods?.length ?? 0) +
      (cv.skills.soft?.length ?? 0) >
    0;

  return (
    <Document
      title={`CV — ${cv.identity.name}`}
      author={cv.identity.name}
      creator="HanaFlow CV Builder"
      producer="HanaFlow"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.name}>{cv.identity.name}</Text>
        <Text style={styles.title}>{cv.identity.title}</Text>
        <Text style={styles.contactRow}>{contactLine(cv.identity)}</Text>

        {/* Summary */}
        {cv.summary && (
          <>
            <Text style={styles.sectionTitle}>Profil</Text>
            <Text style={styles.summary}>{cv.summary}</Text>
          </>
        )}

        {/* Experience */}
        {cv.experiences.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Expérience professionnelle</Text>
            {cv.experiences.map((exp, i) => (
              <View key={i} style={styles.expRow} wrap={false}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                  <Text style={styles.expDates}>
                    {dateRange(exp.startDate, exp.endDate, exp.current)}
                  </Text>
                </View>
                <Text style={styles.expCompany}>
                  {exp.company}
                  {exp.location ? `  •  ${exp.location}` : ""}
                </Text>
                {exp.bullets.map((b, j) => (
                  <Text key={j} style={styles.bullet}>
                    • {b}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}

        {/* Skills */}
        {skillsHas && (
          <>
            <Text style={styles.sectionTitle}>Compétences</Text>
            <View style={styles.skillsBlock}>
              {cv.skills.sap && cv.skills.sap.length > 0 && (
                <>
                  <Text style={styles.skillCategory}>SAP</Text>
                  <Text style={styles.skillList}>{cv.skills.sap.join(" · ")}</Text>
                </>
              )}
              {cv.skills.technical && cv.skills.technical.length > 0 && (
                <>
                  <Text style={styles.skillCategory}>Technique</Text>
                  <Text style={styles.skillList}>{cv.skills.technical.join(" · ")}</Text>
                </>
              )}
              {cv.skills.methods && cv.skills.methods.length > 0 && (
                <>
                  <Text style={styles.skillCategory}>Méthodologies</Text>
                  <Text style={styles.skillList}>{cv.skills.methods.join(" · ")}</Text>
                </>
              )}
              {cv.skills.soft && cv.skills.soft.length > 0 && (
                <>
                  <Text style={styles.skillCategory}>Savoir-faire transverses</Text>
                  <Text style={styles.skillList}>{cv.skills.soft.join(" · ")}</Text>
                </>
              )}
            </View>
          </>
        )}

        {/* Certifs + Languages — deux colonnes */}
        {(cv.certifications.length > 0 || cv.languages.length > 0) && (
          <View style={styles.twoCol} wrap={false}>
            {cv.certifications.length > 0 && (
              <View style={styles.col}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {cv.certifications.map((c, i) => (
                  <Text key={i} style={styles.itemRow}>
                    <Text style={styles.itemBold}>{c.name}</Text>
                    {c.code ? ` — ${c.code}` : ""}
                    {c.year ? ` (${c.year})` : ""}
                    {c.issuer ? `  ·  ${c.issuer}` : ""}
                  </Text>
                ))}
              </View>
            )}
            {cv.languages.length > 0 && (
              <View style={styles.col}>
                <Text style={styles.sectionTitle}>Langues</Text>
                {cv.languages.map((l, i) => (
                  <Text key={i} style={styles.itemRow}>
                    <Text style={styles.itemBold}>{l.name}</Text> — {l.level}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Formation</Text>
            {cv.education.map((e, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{e.degree}</Text>
                  {(e.startDate || e.endDate) && (
                    <Text style={styles.expDates}>
                      {dateRange(e.startDate ?? "", e.endDate)}
                    </Text>
                  )}
                </View>
                <Text style={styles.expCompany}>
                  {e.school}
                  {e.location ? `  •  ${e.location}` : ""}
                </Text>
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
}

/**
 * Re-export pour pouvoir le rendre côté client sans dynamic import (le module
 * @react-pdf/renderer est gros mais le composant doit être utilisable directement
 * dans une page client component).
 */
export { Link };
