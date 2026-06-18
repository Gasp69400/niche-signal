import { jsPDF } from "jspdf";
import type { Locale } from "@/i18n/config";
import type { AnalyzeReport } from "@/types/market-report";
import { getReportPdfLabels } from "@/lib/pdf/labels";

const MARGIN = 16;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BRAND_RGB = { r: 59, g: 130, b: 246 } as const;

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

function drawHeader(doc: jsPDF, labels: ReturnType<typeof getReportPdfLabels>) {
  doc.setFillColor(BRAND_RGB.r, BRAND_RGB.g, BRAND_RGB.b);
  doc.rect(0, 0, PAGE_WIDTH, 24, "F");

  doc.setFillColor(255, 255, 255);
  doc.circle(MARGIN + 2, 12, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(labels.brand, MARGIN + 7, 13.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(labels.tagline, MARGIN + 7, 19);

  doc.setFontSize(8);
  doc.text(labels.proBadge, PAGE_WIDTH - MARGIN, 13.5, { align: "right" });
}

function drawFooter(doc: jsPDF, labels: ReturnType<typeof getReportPdfLabels>, page: number, total: number) {
  const y = 287;
  doc.setDrawColor(220, 220, 220);
  doc.line(MARGIN, y - 4, PAGE_WIDTH - MARGIN, y - 4);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(labels.footer, MARGIN, y);
  doc.text(`${page}/${total}`, PAGE_WIDTH - MARGIN, y, { align: "right" });
}

function wrapText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 5): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  lines.forEach((line, index) => {
    doc.text(line, x, y + index * lineHeight);
  });
  return y + lines.length * lineHeight;
}

function sectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setTextColor(BRAND_RGB.r, BRAND_RGB.g, BRAND_RGB.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(title.toUpperCase(), MARGIN, y);
  doc.setDrawColor(BRAND_RGB.r, BRAND_RGB.g, BRAND_RGB.b);
  doc.line(MARGIN, y + 2, MARGIN + 28, y + 2);
  return y + 10;
}

export async function exportReportPdf(
  report: AnalyzeReport,
  locale: Locale
): Promise<void> {
  const labels = getReportPdfLabels(locale);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 34;

  const ensureSpace = (needed: number) => {
    if (y + needed > 272) {
      doc.addPage();
      drawHeader(doc, labels);
      y = 34;
    }
  };

  drawHeader(doc, labels);

  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(report.domain, MARGIN, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`${labels.reportTitle} · ${labels.generatedOn} ${formatDate(locale, report.createdAt)}`, MARGIN, y);
  y += 12;

  const metrics = [
    [labels.opportunityScore, `${report.opportunityScore}/100`],
    [labels.marketSize, report.marketSize],
    [labels.competition, report.competition],
    [labels.buildDifficulty, report.buildDifficulty],
  ] as const;

  const boxWidth = CONTENT_WIDTH / 2 - 2;
  metrics.forEach(([label, value], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = MARGIN + col * (boxWidth + 4);
    const boxY = y + row * 22;

    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(248, 249, 252);
    doc.roundedRect(x, boxY, boxWidth, 18, 2, 2, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(label, x + 4, boxY + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(BRAND_RGB.r, BRAND_RGB.g, BRAND_RGB.b);
    doc.text(String(value), x + 4, boxY + 14);
  });
  y += 48;

  ensureSpace(20);
  y = sectionTitle(doc, labels.marketTrend, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  y = wrapText(
    doc,
    `${report.marketTrend.trend} · ${labels.sixMonthChange}: ${report.marketTrend.sixMonthChange > 0 ? "+" : ""}${report.marketTrend.sixMonthChange}%`,
    MARGIN,
    y,
    CONTENT_WIDTH
  );
  y += 6;

  if (report.radar.length > 0) {
    ensureSpace(16 + report.radar.length * 6);
    y = sectionTitle(doc, labels.radar, y);
    doc.setFontSize(10);
    report.radar.forEach((item) => {
      doc.setTextColor(50, 50, 50);
      doc.text(`${item.dimension}: ${item.score}/${item.fullMark}`, MARGIN, y);
      y += 6;
    });
    y += 4;
  }

  if (report.painPoints.length > 0) {
    ensureSpace(20);
    y = sectionTitle(doc, labels.painPoints, y);
    report.painPoints.forEach((point) => {
      ensureSpace(8);
      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`• ${point.label} (${point.intensity}%)`, MARGIN, y);
      y += 6;
    });
    y += 4;
  }

  if (report.competitors.length > 0) {
    ensureSpace(24);
    y = sectionTitle(doc, labels.competitors, y);
    report.competitors.forEach((competitor) => {
      ensureSpace(28);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text(competitor.name, MARGIN, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      const lines = [
        `${labels.arrMrr}: ${competitor.arrMrrEstimate}`,
        `${labels.founded}: ${competitor.foundedYear}`,
        `${labels.rating}: ${competitor.rating.toFixed(1)}/5`,
        `${labels.price}: ${competitor.price}`,
      ];
      lines.forEach((line) => {
        doc.text(line, MARGIN + 2, y);
        y += 5;
      });
      y += 3;
    });
  }

  ensureSpace(40);
  y = sectionTitle(doc, labels.persona, y);
  const personaLines = [
    [labels.role, report.persona.role],
    [labels.frustration, report.persona.frustration],
    [labels.currentTool, report.persona.currentTool],
    [labels.willingnessToPay, report.persona.willingnessToPay],
    [labels.whereToFind, report.persona.whereToFind],
  ] as const;
  personaLines.forEach(([label, value]) => {
    ensureSpace(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`${label}:`, MARGIN, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    y = wrapText(doc, value, MARGIN, y, CONTENT_WIDTH);
    y += 3;
  });

  ensureSpace(24);
  y = sectionTitle(doc, labels.positioning, y);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  y = wrapText(doc, `"${report.positioning.oneLiner}"`, MARGIN, y, CONTENT_WIDTH);
  y += 4;
  report.positioning.differentiators.forEach((item) => {
    ensureSpace(8);
    doc.setFont("helvetica", "normal");
    doc.text(`• ${item}`, MARGIN, y);
    y += 6;
  });
  y += 4;

  ensureSpace(24);
  y = sectionTitle(doc, labels.verdict, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  y = wrapText(doc, report.verdict, MARGIN, y, CONTENT_WIDTH);
  y += 6;

  if (report.similarNiches.length > 0) {
    ensureSpace(16);
    y = sectionTitle(doc, labels.similarNiches, y);
    report.similarNiches.forEach((niche) => {
      ensureSpace(8);
      doc.text(`• ${niche.name} — ${niche.opportunityScore}/100`, MARGIN, y);
      y += 6;
    });
  }

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    drawFooter(doc, labels, page, totalPages);
  }

  const filename = `niche-signal-${slugify(report.domain)}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
