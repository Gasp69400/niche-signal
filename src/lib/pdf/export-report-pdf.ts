import { jsPDF } from "jspdf";
import type { Locale } from "@/i18n/config";
import type { AnalyzeReport } from "@/types/market-report";
import { formatPainLevel } from "@/lib/reports/market-signals";
import { getReportPdfLabels } from "@/lib/pdf/labels";
import { contentWidth, PDF } from "@/lib/pdf/theme";

type Labels = ReturnType<typeof getReportPdfLabels>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function formatDate(locale: Locale, createdAt?: string): string {
  const date = createdAt ? new Date(createdAt) : new Date();
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function refId(report: AnalyzeReport): string {
  const base = report.id?.slice(0, 8).toUpperCase() ?? slugify(report.domain).slice(0, 8).toUpperCase();
  return `NS-${base}`;
}

function wrapText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 5.2
): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  lines.forEach((line, index) => {
    doc.text(line, x, y + index * lineHeight);
  });
  return y + lines.length * lineHeight;
}

function drawCoverPage(
  doc: jsPDF,
  report: AnalyzeReport,
  labels: Labels,
  locale: Locale
) {
  doc.setFillColor(PDF.dark.r, PDF.dark.g, PDF.dark.b);
  doc.rect(0, 0, PDF.pageW, PDF.pageH, "F");

  doc.setFillColor(PDF.accent.r, PDF.accent.g, PDF.accent.b);
  doc.rect(0, 0, PDF.pageW, 3, "F");

  doc.setFillColor(PDF.accent.r, PDF.accent.g, PDF.accent.b);
  doc.circle(PDF.margin, 28, 2.5, "F");
  doc.setTextColor(PDF.white.r, PDF.white.g, PDF.white.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(labels.brand, PDF.margin + 6, 29);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(180, 185, 195);
  doc.text(labels.tagline, PDF.margin + 6, 34);

  const badgeW = 16;
  doc.setFillColor(PDF.accent.r, PDF.accent.g, PDF.accent.b);
  doc.roundedRect(PDF.pageW - PDF.margin - badgeW, 24, badgeW, 7, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(PDF.white.r, PDF.white.g, PDF.white.b);
  doc.text(labels.proBadge, PDF.pageW - PDF.margin - badgeW / 2, 28.5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(130, 135, 145);
  doc.text(labels.confidential.toUpperCase(), PDF.pageW - PDF.margin, 34, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(PDF.sky.r, PDF.sky.g, PDF.sky.b);
  doc.text(labels.reportTitle.toUpperCase(), PDF.margin, 58);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(PDF.white.r, PDF.white.g, PDF.white.b);
  const titleLines = doc.splitTextToSize(report.domain, contentWidth()) as string[];
  titleLines.forEach((line, i) => {
    doc.text(line, PDF.margin, 72 + i * 11);
  });

  const afterTitle = 72 + titleLines.length * 11 + 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(160, 165, 175);
  doc.text(labels.reportSubtitle, PDF.margin, afterTitle);

  doc.setDrawColor(50, 55, 65);
  doc.line(PDF.margin, afterTitle + 10, PDF.pageW - PDF.margin, afterTitle + 10);

  doc.setFontSize(8.5);
  doc.text(
    `${labels.reference} ${refId(report)}  ·  ${labels.generatedOn} ${formatDate(locale, report.createdAt)}`,
    PDF.margin,
    afterTitle + 18
  );

  const scoreX = PDF.pageW - PDF.margin - 38;
  const scoreY = 118;
  doc.setDrawColor(PDF.accent.r, PDF.accent.g, PDF.accent.b);
  doc.setLineWidth(0.8);
  doc.roundedRect(scoreX, scoreY, 38, 38, 4, 4, "S");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(160, 165, 175);
  doc.text(labels.opportunityScore.toUpperCase(), scoreX + 19, scoreY + 10, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(PDF.accent.r, PDF.accent.g, PDF.accent.b);
  doc.text(String(report.opportunityScore), scoreX + 19, scoreY + 24, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(130, 135, 145);
  doc.text("/100", scoreX + 19, scoreY + 31, { align: "center" });

  const metricsY = 168;
  const trendDirectionLabel =
    report.marketTrendDirection === "growing"
      ? labels.trendGrowing
      : report.marketTrendDirection === "declining"
        ? labels.trendDeclining
        : labels.trendStable;

  const metrics = [
    [labels.marketSize, report.marketSize],
    [labels.competition, report.competition],
    [labels.buildDifficulty, report.buildDifficulty],
    [labels.searchVolume, report.searchVolume],
    [labels.painLevel, formatPainLevel(report.painLevel)],
    [labels.monetizationModel, report.monetizationModel],
    [labels.estimatedArrPotential, report.estimatedArrPotential],
    [labels.willingnessToPayEstimate, report.willingnessToPayEstimate],
    [labels.marketTrendLabel, trendDirectionLabel],
    [labels.geographicFocus, report.geographicFocus],
  ] as const;
  const colW = contentWidth() / 3 - 2;
  metrics.forEach(([label, value], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = PDF.margin + col * (colW + 3);
    const y = metricsY + row * 32;
    doc.setFillColor(18, 20, 28);
    doc.setDrawColor(45, 50, 62);
    doc.roundedRect(x, y, colW, 26, 2, 2, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(130, 135, 145);
    doc.text(label.toUpperCase(), x + 4, y + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(PDF.white.r, PDF.white.g, PDF.white.b);
    const valLines = doc.splitTextToSize(String(value), colW - 8) as string[];
    doc.text(valLines[0] ?? "—", x + 4, y + 17);
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 105, 115);
  doc.text(labels.footer, PDF.margin, PDF.pageH - 16);
}

function drawContentHeader(doc: jsPDF, labels: Labels, domain: string) {
  doc.setFillColor(PDF.paper.r, PDF.paper.g, PDF.paper.b);
  doc.rect(0, 0, PDF.pageW, PDF.pageH, "F");

  doc.setFillColor(PDF.dark.r, PDF.dark.g, PDF.dark.b);
  doc.rect(0, 0, PDF.pageW, 14, "F");
  doc.setFillColor(PDF.accent.r, PDF.accent.g, PDF.accent.b);
  doc.circle(PDF.margin, 7, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(PDF.white.r, PDF.white.g, PDF.white.b);
  doc.text(labels.brand, PDF.margin + 4, 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(170, 175, 185);
  const shortDomain = domain.length > 42 ? `${domain.slice(0, 39)}…` : domain;
  doc.text(shortDomain, PDF.pageW - PDF.margin, 8, { align: "right" });
}

function drawFooter(doc: jsPDF, labels: Labels, page: number, total: number) {
  doc.setDrawColor(PDF.line.r, PDF.line.g, PDF.line.b);
  doc.line(PDF.margin, 282, PDF.pageW - PDF.margin, 282);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(PDF.muted.r, PDF.muted.g, PDF.muted.b);
  doc.text(labels.footer, PDF.margin, 287);
  doc.text(`${page} / ${total}`, PDF.pageW - PDF.margin, 287, { align: "right" });
}

function sectionBlock(
  doc: jsPDF,
  labels: Labels,
  index: number,
  title: string,
  y: number
): number {
  doc.setFillColor(PDF.accentSoft.r, PDF.accentSoft.g, PDF.accentSoft.b);
  doc.roundedRect(PDF.margin, y, contentWidth(), 9, 1.5, 1.5, "F");
  doc.setFillColor(PDF.accent.r, PDF.accent.g, PDF.accent.b);
  doc.rect(PDF.margin, y, 2.5, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(PDF.accent.r, PDF.accent.g, PDF.accent.b);
  doc.text(String(index).padStart(2, "0"), PDF.margin + 5, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(PDF.ink.r, PDF.ink.g, PDF.ink.b);
  doc.text(title, PDF.margin + 12, y + 6.2);
  return y + 14;
}

function drawPainBar(doc: jsPDF, label: string, intensity: number, y: number): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(PDF.ink.r, PDF.ink.g, PDF.ink.b);
  doc.text(label, PDF.margin, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PDF.accent.r, PDF.accent.g, PDF.accent.b);
  doc.text(`${intensity}%`, PDF.pageW - PDF.margin, y, { align: "right" });

  const barY = y + 2.5;
  const barW = contentWidth();
  doc.setFillColor(PDF.line.r, PDF.line.g, PDF.line.b);
  doc.roundedRect(PDF.margin, barY, barW, 3, 1, 1, "F");
  doc.setFillColor(PDF.accent.r, PDF.accent.g, PDF.accent.b);
  doc.roundedRect(PDF.margin, barY, barW * (intensity / 100), 3, 1, 1, "F");
  return barY + 8;
}

function drawCompetitorRow(
  doc: jsPDF,
  labels: Labels,
  row: AnalyzeReport["competitors"][0],
  y: number,
  shaded: boolean
): number {
  const h = 16;
  if (shaded) {
    doc.setFillColor(248, 249, 252);
    doc.rect(PDF.margin, y - 4, contentWidth(), h, "F");
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(PDF.ink.r, PDF.ink.g, PDF.ink.b);
  doc.text(row.name, PDF.margin + 2, y + 2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(PDF.muted.r, PDF.muted.g, PDF.muted.b);
  const detail = `${row.arrMrrEstimate}  ·  ${labels.founded} ${row.foundedYear}  ·  ★ ${row.rating.toFixed(1)}  ·  ${row.price}`;
  doc.text(detail, PDF.margin + 2, y + 8);
  return y + h;
}

export async function exportReportPdf(
  report: AnalyzeReport,
  locale: Locale
): Promise<void> {
  const labels = getReportPdfLabels(locale);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let sectionIndex = 1;
  let y = 24;

  const startContentPage = () => {
    doc.addPage();
    drawContentHeader(doc, labels, report.domain);
    y = 24;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > 268) {
      startContentPage();
    }
  };

  drawCoverPage(doc, report, labels, locale);
  startContentPage();

  y = sectionBlock(doc, labels, sectionIndex++, labels.executiveSummary, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(PDF.ink.r, PDF.ink.g, PDF.ink.b);

  const trendDirectionLabel =
    report.marketTrendDirection === "growing"
      ? labels.trendGrowing
      : report.marketTrendDirection === "declining"
        ? labels.trendDeclining
        : labels.trendStable;

  const summaryLines = [
    `${labels.searchVolume}: ${report.searchVolume}`,
    `${labels.painLevel}: ${formatPainLevel(report.painLevel)}`,
    `${labels.monetizationModel}: ${report.monetizationModel}`,
    `${labels.estimatedArrPotential}: ${report.estimatedArrPotential}`,
    `${labels.willingnessToPayEstimate}: ${report.willingnessToPayEstimate}`,
    `${labels.marketTrendLabel}: ${trendDirectionLabel} (${report.trendPercent})`,
    `${labels.geographicFocus}: ${report.geographicFocus}`,
  ];
  summaryLines.forEach((line) => {
    y = wrapText(doc, line, PDF.margin, y, contentWidth());
    y += 2;
  });
  y += 4;

  y = wrapText(
    doc,
    `${report.marketTrend.trend}. ${labels.sixMonthChange}: ${report.marketTrend.sixMonthChange > 0 ? "+" : ""}${report.marketTrend.sixMonthChange}%.`,
    PDF.margin,
    y,
    contentWidth()
  );
  y += 8;

  if (report.radar.length > 0) {
    ensureSpace(12 + report.radar.length * 7);
    report.radar.forEach((item) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(PDF.muted.r, PDF.muted.g, PDF.muted.b);
      doc.text(item.dimension, PDF.margin, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(PDF.ink.r, PDF.ink.g, PDF.ink.b);
      doc.text(`${item.score}/${item.fullMark}`, PDF.pageW - PDF.margin, y, { align: "right" });
      y += 7;
    });
    y += 4;
  }

  if (report.painPoints.length > 0) {
    ensureSpace(24);
    y = sectionBlock(doc, labels, sectionIndex++, labels.painPoints, y);
    report.painPoints.forEach((point) => {
      ensureSpace(14);
      y = drawPainBar(doc, point.label, point.intensity, y);
    });
    y += 4;
  }

  if (report.competitors.length > 0) {
    ensureSpace(28);
    y = sectionBlock(doc, labels, sectionIndex++, labels.competitors, y);
    doc.setDrawColor(PDF.line.r, PDF.line.g, PDF.line.b);
    doc.line(PDF.margin, y - 2, PDF.pageW - PDF.margin, y - 2);
    report.competitors.forEach((competitor, i) => {
      ensureSpace(18);
      y = drawCompetitorRow(doc, labels, competitor, y, i % 2 === 0);
    });
    y += 6;
  }

  ensureSpace(36);
  y = sectionBlock(doc, labels, sectionIndex++, labels.persona, y);
  const personaFields = [
    [labels.role, report.persona.role],
    [labels.frustration, report.persona.frustration],
    [labels.currentTool, report.persona.currentTool],
    [labels.willingnessToPay, report.persona.willingnessToPay],
    [labels.whereToFind, report.persona.whereToFind],
  ] as const;
  personaFields.forEach(([label, value]) => {
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(PDF.muted.r, PDF.muted.g, PDF.muted.b);
    doc.text(label.toUpperCase(), PDF.margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(PDF.ink.r, PDF.ink.g, PDF.ink.b);
    y = wrapText(doc, value, PDF.margin, y, contentWidth());
    y += 4;
  });

  ensureSpace(28);
  y = sectionBlock(doc, labels, sectionIndex++, labels.positioning, y);
  doc.setFillColor(PDF.accentSoft.r, PDF.accentSoft.g, PDF.accentSoft.b);
  doc.roundedRect(PDF.margin, y, contentWidth(), 16, 2, 2, "F");
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(10);
  doc.setTextColor(PDF.ink.r, PDF.ink.g, PDF.ink.b);
  wrapText(doc, report.positioning.oneLiner, PDF.margin + 4, y + 7, contentWidth() - 8);
  y += 22;
  report.positioning.differentiators.forEach((item) => {
    ensureSpace(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`▸  ${item}`, PDF.margin + 2, y);
    y += 6;
  });
  y += 4;

  const positive = report.opportunityScore >= 70;
  ensureSpace(32);
  y = sectionBlock(doc, labels, sectionIndex++, labels.verdict, y);
  const boxColor = positive ? PDF.successSoft : PDF.warningSoft;
  const titleColor = positive ? PDF.success : PDF.warning;
  doc.setFillColor(boxColor.r, boxColor.g, boxColor.b);
  doc.roundedRect(PDF.margin, y, contentWidth(), 22, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(titleColor.r, titleColor.g, titleColor.b);
  doc.text(positive ? labels.verdictPositive : labels.verdictCaution, PDF.margin + 4, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(PDF.ink.r, PDF.ink.g, PDF.ink.b);
  wrapText(doc, report.verdict, PDF.margin + 4, y + 13, contentWidth() - 8, 4.8);
  y += 28;

  if (report.similarNiches.length > 0) {
    ensureSpace(20);
    y = sectionBlock(doc, labels, sectionIndex++, labels.similarNiches, y);
    report.similarNiches.forEach((niche) => {
      ensureSpace(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(PDF.ink.r, PDF.ink.g, PDF.ink.b);
      doc.text(niche.name, PDF.margin, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(PDF.accent.r, PDF.accent.g, PDF.accent.b);
      doc.text(`${niche.opportunityScore}/100`, PDF.pageW - PDF.margin, y, { align: "right" });
      y += 7;
    });
  }

  const totalPages = doc.getNumberOfPages();
  for (let page = 2; page <= totalPages; page += 1) {
    doc.setPage(page);
    drawFooter(doc, labels, page - 1, totalPages - 1);
  }

  doc.setPage(1);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 105, 115);
  doc.text(`${labels.reference} ${refId(report)}`, PDF.pageW - PDF.margin, PDF.pageH - 16, { align: "right" });

  const filename = `NicheFounder-${slugify(report.domain)}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
