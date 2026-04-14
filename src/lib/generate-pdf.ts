import jsPDF from "jspdf";
import { DriftProfile, DriftAxis, ChoiceRecord } from "@/engine/types";
import { computeCumulativeDrift } from "@/engine/drift-model";
import { ArchetypeResult } from "@/components/rpg/FinalDiagnostic";
import { zones } from "@/engine/zones";

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

const COLORS = {
  bg: "#0a0a0a",
  surface: "#141414",
  text: "#e8e8e8",
  muted: "#737373",
  accent: "#c4b5a0",
  border: "#1f1f1f",
};

async function loadImageAsDataUrl(src: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Generate and download a PDF report of the user's Narrative Drift results.
 */
export async function downloadDiagnosticPdf({
  userName,
  archetype,
  baselineProfile,
  currentProfile,
  choices,
}: {
  userName: string | null;
  archetype: ArchetypeResult;
  baselineProfile: DriftProfile;
  currentProfile: DriftProfile;
  choices: ChoiceRecord[];
}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 0;

  // --- Helpers ---
  function checkPageBreak(needed: number) {
    if (y + needed > pageH - margin) {
      doc.addPage();
      drawPageBg();
      y = margin;
    }
  }

  function drawPageBg() {
    doc.setFillColor(COLORS.bg);
    doc.rect(0, 0, pageW, pageH, "F");
  }

  function drawDivider() {
    checkPageBreak(8);
    doc.setDrawColor(COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + 24, y);
    y += 8;
  }

  // --- Page 1: Logo + Header + Archetype + Axes ---
  drawPageBg();
  y = margin;

  // Logo
  const logoDataUrl = await loadImageAsDataUrl("/logo.png");
  if (logoDataUrl) {
    const logoSize = 18;
    doc.addImage(logoDataUrl, "PNG", margin, y, logoSize, logoSize);
    y += logoSize + 6;
  }

  // Title
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.muted);
  doc.text("NARRATIVE DRIFT — SUBJECT DIAGNOSTIC", margin, y);
  y += 12;

  // Subject
  if (userName) {
    doc.setFontSize(7);
    doc.setTextColor(COLORS.muted);
    doc.text(`SUBJECT: ${userName.toUpperCase()}`, margin, y);
    y += 10;
  }

  // Archetype
  doc.setFontSize(28);
  doc.setTextColor(COLORS.accent);
  doc.text(archetype.designation, margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(COLORS.muted);
  doc.text(archetype.description, margin, y);
  y += 12;

  // Displacement
  const drift = computeCumulativeDrift(baselineProfile, currentProfile);
  const driftPct = Math.round(drift * 100);
  doc.setFontSize(7);
  doc.setTextColor(COLORS.muted);
  doc.text("TOTAL DISPLACEMENT", margin, y);
  y += 8;
  doc.setFontSize(36);
  doc.setTextColor(COLORS.accent);
  doc.text(`${driftPct}%`, margin, y);
  y += 14;

  drawDivider();

  // Analysis
  doc.setFontSize(7);
  doc.setTextColor(COLORS.muted);
  doc.text("DIAGNOSTIC INTERPRETATION", margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setTextColor(COLORS.text);
  const analysisLines = doc.splitTextToSize(archetype.analysis, contentW);
  checkPageBreak(analysisLines.length * 4.5 + 4);
  doc.text(analysisLines, margin, y);
  y += analysisLines.length * 4.5 + 8;

  drawDivider();

  // Axis readings
  doc.setFontSize(7);
  doc.setTextColor(COLORS.muted);
  doc.text("AXIS READINGS — ORIGIN → TERMINAL STATE", margin, y);
  y += 8;

  for (const axis of AXES) {
    checkPageBreak(20);
    const baseline = baselineProfile[axis];
    const current = currentProfile[axis];
    const delta = current - baseline;

    // Axis name
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text);
    doc.text(axis.toUpperCase(), margin, y);

    // Values
    const valStr = `${baseline > 0 ? "+" : ""}${(baseline * 100).toFixed(0)}  →  ${current > 0 ? "+" : ""}${(current * 100).toFixed(0)}  (${delta >= 0 ? "+" : ""}${Math.round(delta * 100)})`;
    doc.setFontSize(8);
    doc.setTextColor(COLORS.accent);
    doc.text(valStr, margin + 50, y);
    y += 5;

    // Bar visualization
    const barY = y;
    const barW = contentW - 50;
    const barH = 2.5;
    const barX = margin + 50;

    // Background bar
    doc.setFillColor("#1a1a1a");
    doc.rect(barX, barY, barW, barH, "F");

    // Value indicator
    const centerX = barX + barW / 2;
    const valueX = centerX + (current * barW) / 2;
    const indicatorW = Math.abs(current) * barW / 2;

    doc.setFillColor(COLORS.accent);
    if (current >= 0) {
      doc.rect(centerX, barY, indicatorW, barH, "F");
    } else {
      doc.rect(centerX - indicatorW, barY, indicatorW, barH, "F");
    }

    // Center line
    doc.setDrawColor(COLORS.muted);
    doc.setLineWidth(0.2);
    doc.line(centerX, barY - 0.5, centerX, barY + barH + 0.5);

    y += barH + 8;
  }

  drawDivider();

  // --- Choice history ---
  doc.setFontSize(7);
  doc.setTextColor(COLORS.muted);
  doc.text("DECISION RECORD", margin, y);
  y += 8;

  const zoneIds = Array.from(new Set(choices.map((c) => c.zoneId)));

  for (const zoneId of zoneIds) {
    const zone = zones.find((z) => z.id === zoneId);
    const zoneChoices = choices.filter((c) => c.zoneId === zoneId);

    checkPageBreak(16);
    doc.setFontSize(7);
    doc.setTextColor(COLORS.muted);
    doc.text(`ZONE ${zoneId} — ${(zone?.title ?? "Unknown").toUpperCase()}`, margin, y);
    y += 6;

    for (const choice of zoneChoices) {
      checkPageBreak(16);

      // Choice label
      doc.setFontSize(9);
      doc.setTextColor(COLORS.text);
      const choiceLines = doc.splitTextToSize(choice.choiceLabel, contentW - 6);
      doc.text(choiceLines, margin + 4, y);
      y += choiceLines.length * 4.5;

      // Drift vectors
      for (const v of choice.driftVectors) {
        checkPageBreak(6);
        doc.setFontSize(7);
        doc.setTextColor(COLORS.muted);
        const vLine = `${v.axis}: ${v.delta > 0 ? "+" : ""}${v.delta.toFixed(2)} — ${v.description}`;
        const vLines = doc.splitTextToSize(vLine, contentW - 10);
        doc.text(vLines, margin + 8, y);
        y += vLines.length * 3.5;
      }

      y += 4;
    }

    y += 4;
  }

  // Footer on last page
  checkPageBreak(16);
  drawDivider();
  doc.setFontSize(7);
  doc.setTextColor(COLORS.muted);
  doc.text("Narrative Drift — An interactive exploration of algorithmic influence", margin, y);
  y += 4;
  doc.text("narrativedrift.org", margin, y);

  // Download
  const filename = userName
    ? `narrative-drift-${userName.toLowerCase().replace(/\s+/g, "-")}.pdf`
    : "narrative-drift-diagnostic.pdf";
  doc.save(filename);
}
