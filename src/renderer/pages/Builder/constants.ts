import type { PaperSizeId } from "@renderer/type/Builder";
import type { TextStyleConfig } from "@renderer/type/ComponentMarket";

export type PaperSizePreset = {
  label: string;
  width: number;
  height: number;
  description: string;
};

export const PAPER_SIZE_PRESETS: Record<PaperSizeId, PaperSizePreset> = {
  A4: {
    label: "A4 纵向",
    width: 794,
    height: 1123,
    description: "210 × 297 mm"
  },
  A5: {
    label: "A5 纵向",
    width: 559,
    height: 794,
    description: "148 × 210 mm"
  },
  ExamSingle: {
    label: "A4 试卷（单页）",
    width: 794,
    height: 1123,
    description: "适合单页考试试卷"
  },
  ExamDouble: {
    label: "A4 试卷（双页）",
    width: 794 * 2 + 48,
    height: 1123,
    description: "左右两页双栏试卷版式"
  },
  Letter: {
    label: "Letter 纵向",
    width: 816,
    height: 1056,
    description: "8.5 × 11 in"
  }
};

export const DEFAULT_TITLE_STYLE: TextStyleConfig = {
  align: "left",
  fontSize: 18,
  color: "#111827",
  bold: true,
  italic: false
};

export const DEFAULT_DESCRIPTION_STYLE: TextStyleConfig = {
  align: "left",
  fontSize: 13,
  color: "#6b7280",
  bold: false,
  italic: false
};

export const DEFAULT_OPTION_STYLE: TextStyleConfig = {
  align: "left",
  fontSize: 14,
  color: "#374151",
  bold: false,
  italic: false
};
