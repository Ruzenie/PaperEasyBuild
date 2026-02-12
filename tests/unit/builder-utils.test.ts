import { describe, expect, it } from "vitest";
import { estimateQuestionHeight, getQuestionTypeLabel } from "../../src/renderer/pages/Builder/utils";

describe("Builder utils", () => {
  it("getQuestionTypeLabel: returns expected labels", () => {
    expect(getQuestionTypeLabel("singleChoice")).toBe("单选题");
    expect(getQuestionTypeLabel("multiChoice")).toBe("多选题");
    expect(getQuestionTypeLabel("longText")).toBe("多行输入");
  });

  it("getQuestionTypeLabel: falls back to raw type", () => {
    const unknownType = "unknown" as unknown as Parameters<typeof getQuestionTypeLabel>[0];
    expect(getQuestionTypeLabel(unknownType)).toBe("unknown");
  });

  it("estimateQuestionHeight: accounts for description and options", () => {
    const base = {
      id: "q1",
      title: "题目",
      required: false,
      titleStyle: undefined,
      descriptionStyle: undefined,
      optionStyle: undefined
    };

    const choiceNoDesc = estimateQuestionHeight({
      ...base,
      type: "singleChoice",
      options: ["A", "B"]
    });

    const choiceWithDesc = estimateQuestionHeight({
      ...base,
      type: "singleChoice",
      description: "描述",
      options: ["A", "B"]
    });

    expect(choiceWithDesc).toBeGreaterThan(choiceNoDesc);

    const longText = estimateQuestionHeight({
      ...base,
      type: "longText"
    });
    expect(longText).toBeGreaterThan(choiceNoDesc);
  });
});
