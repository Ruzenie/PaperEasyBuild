import type { QuestionAnswerValue, QuestionDefinition, QuestionnaireAnswers } from "@renderer/type/Builder";

export const isAnswerEmpty = (answer: QuestionAnswerValue | undefined): boolean => {
  if (answer == null) return true;
  if (Array.isArray(answer)) return answer.length === 0;
  return answer.trim().length === 0;
};

export const isAnswerableQuestion = (question: QuestionDefinition): boolean => question.type !== "note";

export const isQuestionAnswered = (
  question: QuestionDefinition,
  answers: QuestionnaireAnswers
): boolean => {
  if (!isAnswerableQuestion(question)) return true;
  return !isAnswerEmpty(answers[question.id]);
};

export const getMissingRequiredQuestions = (
  questions: QuestionDefinition[],
  answers: QuestionnaireAnswers
): QuestionDefinition[] =>
  questions.filter((question) => question.required && !isQuestionAnswered(question, answers));

export const countAnswerableQuestions = (questions: QuestionDefinition[]): number =>
  questions.filter(isAnswerableQuestion).length;

export const countAnsweredQuestions = (
  questions: QuestionDefinition[],
  answers: QuestionnaireAnswers
): number =>
  questions.filter((question) => isAnswerableQuestion(question) && isQuestionAnswered(question, answers)).length;

export const formatAnswerValue = (answer: QuestionAnswerValue | undefined): string => {
  if (answer == null) return "未填写";
  if (Array.isArray(answer)) return answer.length ? answer.join("、") : "未填写";
  return answer.trim() ? answer : "未填写";
};
