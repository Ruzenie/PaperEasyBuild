import type { QuestionDefinition, QuestionType } from "@renderer/type/Builder";

export const getQuestionTypeLabel = (type: QuestionType): string => {
  switch (type) {
    case "singleChoice":
      return "单选题";
    case "multiChoice":
      return "多选题";
    case "rating":
      return "打分题";
    case "date":
      return "日期题";
    case "shortText":
      return "单行输入";
    case "longText":
      return "多行输入";
    case "name":
      return "姓名";
    case "phone":
      return "手机号";
    case "judge":
      return "判断题";
    case "fillBlank":
      return "填空题";
    case "slider":
      return "滑块题";
    case "note":
      return "备注说明";
    default:
      return type;
  }
};

export const estimateQuestionHeight = (q: QuestionDefinition): number => {
  let height = 56;

  if (q.description) {
    height += 28;
  }

  const optionCount = q.options?.length ?? 0;

  if (q.type === "singleChoice" || q.type === "multiChoice" || q.type === "judge") {
    height += optionCount * 28;
  } else if (q.type === "rating") {
    height += 52;
  } else if (q.type === "slider") {
    height += 64;
  } else if (
    q.type === "shortText" ||
    q.type === "fillBlank" ||
    q.type === "date" ||
    q.type === "name" ||
    q.type === "phone"
  ) {
    height += 40;
  } else if (q.type === "longText") {
    height += 96;
  } else if (q.type === "note") {
    height += 60;
  }
  return height + 12;
};
