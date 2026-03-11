import { describe, expect, it } from "vitest";
import type { QuestionDefinition, QuestionnaireAnswers } from "../../src/renderer/type/Builder";
import {
  getConditionSourceQuestions,
  getVisibleQuestions,
  isQuestionVisible
} from "../../src/renderer/utils/questionLogic";

const question = (patch: Partial<QuestionDefinition>): QuestionDefinition => ({
  id: "q1",
  title: "题目",
  type: "singleChoice",
  options: ["A", "B"],
  ...patch
});

describe("questionLogic", () => {
  it("getConditionSourceQuestions: returns only previous selectable questions", () => {
    const questions: QuestionDefinition[] = [
      question({ id: "q1", type: "singleChoice" }),
      question({ id: "q2", type: "note", options: undefined }),
      question({ id: "q3", type: "longText", options: undefined }),
      question({ id: "q4", type: "multiChoice", options: ["X", "Y"] })
    ];

    const sources = getConditionSourceQuestions(questions, "q4");
    expect(sources.map((item) => item.id)).toEqual(["q1"]);
  });

  it("isQuestionVisible: handles single and multi value answers", () => {
    const source = question({ id: "q1", options: ["A", "B"] });
    const targetSingle = question({
      id: "q2",
      visibilityRule: {
        sourceQuestionId: "q1",
        expectedValue: "A"
      }
    });
    const targetMulti = question({
      id: "q3",
      visibilityRule: {
        sourceQuestionId: "q1",
        expectedValue: "B"
      }
    });
    const map = new Map([
      [source.id, source],
      [targetSingle.id, targetSingle],
      [targetMulti.id, targetMulti]
    ]);

    expect(isQuestionVisible(targetSingle, { q1: "A" }, map)).toBe(true);
    expect(isQuestionVisible(targetSingle, { q1: "B" }, map)).toBe(false);
    expect(isQuestionVisible(targetMulti, { q1: ["A", "B"] }, map)).toBe(true);
  });

  it("getVisibleQuestions: keeps invalid rule as visible fallback", () => {
    const questions: QuestionDefinition[] = [
      question({ id: "q1", options: ["A", "B"] }),
      question({
        id: "q2",
        visibilityRule: {
          sourceQuestionId: "q_missing",
          expectedValue: "A"
        }
      }),
      question({
        id: "q3",
        visibilityRule: {
          sourceQuestionId: "q1",
          expectedValue: "A"
        }
      })
    ];

    const answers: QuestionnaireAnswers = {
      q1: "B"
    };

    const visible = getVisibleQuestions(questions, answers);
    expect(visible.map((item) => item.id)).toEqual(["q1", "q2"]);
  });
});
