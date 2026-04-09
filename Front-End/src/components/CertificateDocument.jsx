import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontFamily: "Helvetica",
  },

  // Bordure décorative extérieure
  outerBorder: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    border: "2px solid #2563EB",
    borderRadius: 4,
  },
  innerBorder: {
    position: "absolute",
    top: 22,
    left: 22,
    right: 22,
    bottom: 22,
    border: "0.5px solid #BFDBFE",
    borderRadius: 2,
  },

  // Contenu principal
  content: {
    flex: 1,
    padding: "48px 56px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  // Header
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    gap: 10,
  },
  logoText: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  logoHana: {
    color: "#2563EB",
  },
  logoFlow: {
    color: "#1E293B",
  },

  // Divider
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 32,
  },
  dividerAccent: {
    width: 80,
    height: 3,
    backgroundColor: "#2563EB",
    borderRadius: 2,
    marginBottom: 32,
    alignSelf: "center",
  },

  // Titre
  certLabel: {
    fontSize: 11,
    color: "#64748B",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 10,
    textAlign: "center",
  },
  certTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  certSubtitle: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    marginBottom: 36,
  },

  // Destinataire
  presentedTo: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1,
  },
  recipientName: {
    fontSize: 32,
    fontFamily: "Helvetica-BoldOblique",
    color: "#2563EB",
    textAlign: "center",
    marginBottom: 28,
    letterSpacing: 0.5,
  },

  // Description
  description: {
    fontSize: 11,
    color: "#475569",
    textAlign: "center",
    lineHeight: 1.7,
    maxWidth: 420,
    marginBottom: 32,
  },

  // Badge module
  moduleBadge: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 36,
    alignItems: "center",
    gap: 8,
  },
  moduleBadgeCode: {
    fontSize: 10,
    color: "#2563EB",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  moduleBadgeName: {
    fontSize: 10,
    color: "#1D4ED8",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    marginBottom: 40,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 9,
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    height: 36,
    alignSelf: "center",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 36,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  footerLabel: {
    fontSize: 8,
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 9,
    color: "#475569",
    fontFamily: "Helvetica-Bold",
  },
  footerCenter: {
    flex: 1,
    alignItems: "center",
  },
  sealOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    border: "2px solid #2563EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
  },
  sealInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    border: "1px solid #BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  sealText: {
    fontSize: 6,
    color: "#2563EB",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  // Coins décoratifs
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
  },
  cornerTL: { top: 30, left: 30, borderTop: "2px solid #2563EB", borderLeft: "2px solid #2563EB" },
  cornerTR: { top: 30, right: 30, borderTop: "2px solid #2563EB", borderRight: "2px solid #2563EB" },
  cornerBL: { bottom: 30, left: 30, borderBottom: "2px solid #2563EB", borderLeft: "2px solid #2563EB" },
  cornerBR: { bottom: 30, right: 30, borderBottom: "2px solid #2563EB", borderRight: "2px solid #2563EB" },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function generateCertId(userName, moduleCode, date) {
  const str = `${userName}-${moduleCode}-${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
  return `HF-${abs.slice(0, 4)}-${abs.slice(4)}`;
}

// ── Composant PDF ─────────────────────────────────────────────────────────────
export default function CertificateDocument({ userName, moduleCode, moduleName, score, totalQuestions, passed }) {
  const date = new Date();
  const certId = generateCertId(userName, moduleCode, date);
  const pct = Math.round((score / totalQuestions) * 100);

  return (
    <Document
      title={`Certificat HanaFlow — ${moduleName}`}
      author="HanaFlow"
      subject={`Certification ${moduleCode}`}
    >
      <Page size="A4" orientation="landscape" style={styles.page}>

        {/* Bordures décoratives */}
        <View style={styles.outerBorder} />
        <View style={styles.innerBorder} />

        {/* Coins décoratifs */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        {/* Contenu */}
        <View style={styles.content}>

          {/* Logo */}
          <View style={styles.header}>
            <Text style={styles.logoText}>
              <Text style={styles.logoHana}>Hana</Text>
              <Text style={styles.logoFlow}>Flow</Text>
            </Text>
          </View>

          <View style={styles.dividerAccent} />

          {/* Titre */}
          <Text style={styles.certLabel}>Certificat de réussite</Text>
          <Text style={styles.certTitle}>Formation SAP Complétée</Text>
          <Text style={styles.certSubtitle}>Préparation à la certification officielle SAP</Text>

          {/* Destinataire */}
          <Text style={styles.presentedTo}>décerné à</Text>
          <Text style={styles.recipientName}>{userName || "Apprenant HanaFlow"}</Text>

          {/* Description */}
          <Text style={styles.description}>
            {`A complété avec succès la formation de préparation à la certification\n${moduleCode} — ${moduleName}\nsur la plateforme HanaFlow`}
          </Text>

          {/* Badge module */}
          <View style={styles.moduleBadge}>
            <Text style={styles.moduleBadgeCode}>{moduleCode}</Text>
            <Text style={{ fontSize: 9, color: "#64748B" }}>·</Text>
            <Text style={styles.moduleBadgeName}>{moduleName}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pct}%</Text>
              <Text style={styles.statLabel}>SCORE OBTENU</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{score}/{totalQuestions}</Text>
              <Text style={styles.statLabel}>BONNES RÉPONSES</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>65%</Text>
              <Text style={styles.statLabel}>SEUIL RÉUSSITE</Text>
            </View>
          </View>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerLabel}>DATE D'OBTENTION</Text>
            <Text style={styles.footerValue}>{formatDate(date)}</Text>
          </View>

          <View style={styles.footerCenter}>
            <View style={styles.sealOuter}>
              <View style={styles.sealInner}>
                <Text style={styles.sealText}>{"HANA\nFLOW\n✓"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footerRight}>
            <Text style={styles.footerLabel}>N° CERTIFICAT</Text>
            <Text style={styles.footerValue}>{certId}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
