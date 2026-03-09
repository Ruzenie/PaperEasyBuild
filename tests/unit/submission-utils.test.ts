import { describe, expect, it } from "vitest";
import type { QuestionDefinition, QuestionnaireAnswers } from "../../src/renderer/type/Builder";
import {
  countAnswerableQuestions,
  countAnsweredQuestions,
  formatAnswerValue,
  getMissingRequiredQuestions,
  isAnswerEmpty
} from "../../src/renderer/pages/Preview/utils";

const buildQuestion = (patch: Partial<QuestionDefinition>): QuestionDefinition => ({
  id: "q1",
  title: "题目",
  type: "shortText",
  ...patch
});

describe("preview submission utils", () => {
  it("isAnswerEmpty: handles null, string and array values", () => {
    expect(isAnswerEmpty(null)).toBe(true);
    expect(isAnswerEmpty("")).toBe(true);
    expect(isAnswerEmpty("   ")).toBe(true);
    expect(isAnswerEmpty([])).toBe(true);
    expect(isAnswerEmpty(["A"])).toBe(false);
    expect(isAnswerEmpty("答案")).toBe(false);
  });

  it("getMissingRequiredQuestions: only checks answerable required questions", () => {
    const questions: QuestionDefinition[] = [
      buildQuestion({ id: "q1", type: "shortText", required: true, title: "姓名" }),
      buildQuestion({ id: "q2", type: "note", required: true, title: "说明" }),
      buildQuestion({ id: "q3", type: "singleChoice", required: true, title: "单选" })
    ];

    const answers: QuestionnaireAnswers = {
      q3: "选项1"
    };

    const missing = getMissingRequiredQuestions(questions, answers);
    expect(missing.map((item) => item.id)).toEqual(["q1"]);
  });

  it("count helpers: counts only answerable and answered questions", () => {
    const questions: QuestionDefinition[] = [
      buildQuestion({ id: "q1", type: "shortText" }),
      buildQuestion({ id: "q2", type: "multiChoice" }),
      buildQuestion({ id: "q3", type: "note" })
    ];

    const answers: QuestionnaireAnswers = {
      q1: "abc",
      q2: ["A"]
    };

    expect(countAnswerableQuestions(questions)).toBe(2);
    expect(countAnsweredQuestions(questions, answers)).toBe(2);
  });

  it("formatAnswerValue: renders user-friendly text", () => {
    expect(formatAnswerValue(null)).toBe("未填写");
    expect(formatAnswerValue("")).toBe("未填写");
    expect(formatAnswerValue(["A", "B"])).toBe("A、B");
    expect(formatAnswerValue("内容")).toBe("内容");
  });
});
