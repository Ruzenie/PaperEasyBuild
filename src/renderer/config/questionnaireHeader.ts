/** 问卷页眉（标题/副标题）默认样式与归一化逻辑。 */
import type { QuestionnaireHeaderConfig } from "@renderer/type/Builder";
import type { TextStyleConfig } from "@renderer/type/ComponentMarket";

export const DEFAULT_QUESTIONNAIRE_TITLE_STYLE: TextStyleConfig = {
  align: "center",
  fontSize: 24,
  color: "#111827",
  bold: true,
  italic: false
};

export const DEFAULT_QUESTIONNAIRE_SUBTITLE_STYLE: TextStyleConfig = {
  align: "center",
  fontSize: 14,
  color: "#6b7280",
  bold: false,
  italic: false
};

export type NormalizedQuestionnaireHeader = Required<
  Pick<QuestionnaireHeaderConfig, "title" | "subtitle" | "titleStyle" | "subtitleStyle">
>;

const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const normalizeTextStyle = (value: unknown, fallback: TextStyleConfig): TextStyleConfig => {
  if (!value || typeof value !== "object") return { ...fallback };
  const candidate = value as Partial<TextStyleConfig>;

  return {
    align: candidate.align === "left" || candidate.align === "center" ? candidate.align : fallback.align,
    fontSize:
      typeof candidate.fontSize === "number" && Number.isFinite(candidate.fontSize)
        ? clampNumber(candidate.fontSize, 8, 60)
        : fallback.fontSize,
    color: typeof candidate.color === "string" && candidate.color ? candidate.color : fallback.color,
    bold: typeof candidate.bold === "boolean" ? candidate.bold : fallback.bold,
    italic: typeof candidate.italic === "boolean" ? candidate.italic : fallback.italic
  };
};

const normalizeText = (value: unknown, maxLen: number) => {
  if (typeof value !== "string") return "";
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
};

export const normalizeQuestionnaireHeader = (header: unknown): NormalizedQuestionnaireHeader => {
  const candidate = header && typeof header === "object" ? (header as QuestionnaireHeaderConfig) : undefined;

  return {
    title: normalizeText(candidate?.title, 80),
    subtitle: normalizeText(candidate?.subtitle, 200),
    titleStyle: normalizeTextStyle(candidate?.titleStyle, DEFAULT_QUESTIONNAIRE_TITLE_STYLE),
    subtitleStyle: normalizeTextStyle(candidate?.subtitleStyle, DEFAULT_QUESTIONNAIRE_SUBTITLE_STYLE)
  };
};

