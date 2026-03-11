import type { QuestionDefinition, QuestionType, QuestionnaireAnswers } from "@renderer/type/Builder";

const CONDITION_SOURCE_TYPES = new Set<QuestionType>([
  "singleChoice",
  "multiChoice",
  "rating",
  "judge",
  "slider"
]);

export const isConditionSourceQuestion = (question: QuestionDefinition): boolean =>
  CONDITION_SOURCE_TYPES.has(question.type) && Array.isArray(question.options) && question.options.length > 0;

export const getConditionSourceQuestions = (
  questions: QuestionDefinition[],
  currentQuestionId: string
): QuestionDefinition[] => {
  const currentIndex = questions.findIndex((question) => question.id === currentQuestionId);
  if (currentIndex <= 0) return [];
  return questions.slice(0, currentIndex).filter(isConditionSourceQuestion);
};

export const isQuestionVisible = (
  question: QuestionDefinition,
  answers: QuestionnaireAnswers,
  questionMap: Map<string, QuestionDefinition>
): boolean => {
  const rule = question.visibilityRule;
  if (!rule) return true;

  const sourceQuestion = questionMap.get(rule.sourceQuestionId);
  if (!sourceQuestion || !isConditionSourceQuestion(sourceQuestion)) return true;

  const sourceOptions = sourceQuestion.options ?? [];
  if (!sourceOptions.includes(rule.expectedValue)) return true;

  const sourceAnswer = answers[rule.sourceQuestionId];
  if (sourceAnswer == null) return false;
  if (Array.isArray(sourceAnswer)) return sourceAnswer.includes(rule.expectedValue);
  return sourceAnswer === rule.expectedValue;
};

export const getVisibleQuestions = (
  questions: QuestionDefinition[],
  answers: QuestionnaireAnswers
): QuestionDefinition[] => {
  const questionMap = new Map(questions.map((question) => [question.id, question] as const));
  return questions.filter((question) => isQuestionVisible(question, answers, questionMap));
};

export const clearVisibilityRulesForSource = (
  questions: QuestionDefinition[],
  sourceQuestionId: string
): QuestionDefinition[] =>
  questions.map((question) => {
    if (question.visibilityRule?.sourceQuestionId !== sourceQuestionId) return question;
    return {
      ...question,
      visibilityRule: undefined
    };
  });
