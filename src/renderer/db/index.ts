import Dexie, { type Table } from "dexie";
import type { QuestionDefinition, PaperSizeId } from "@renderer/type/Builder";
import type { QuestionTemplate, TemplateConfig } from "@renderer/type/ComponentMarket";
import { BASE_QUESTION_TEMPLATES, BASE_TEMPLATE_IDS } from "@renderer/config/questionTemplates";

export interface StoredTemplate extends QuestionTemplate {
  createdAt: number;
  updatedAt: number;
}

export interface StoredTemplateConfig {
  id: string;
  config: TemplateConfig;
}

export interface QuestionnaireRecord {
  id: string;
  name: string;
  paperSize: PaperSizeId;
  questions: QuestionDefinition[];
  createdAt: number;
  updatedAt: number;
}

class PaperEasyDB extends Dexie {
  templates!: Table<StoredTemplate, string>;
  templateConfigs!: Table<StoredTemplateConfig, string>;
  questionnaires!: Table<QuestionnaireRecord, string>;

  constructor() {
    super("PaperEasyDB");
    this.version(1).stores({
      templates: "&id, updatedAt",
      templateConfigs: "&id",
      questionnaires: "&id, updatedAt"
    });
  }
}

export const db = new PaperEasyDB();

export const buildDefaultConfigFromTemplate = (template: QuestionTemplate): TemplateConfig => {
  const baseOptions =
    template.defaultOptions && template.defaultOptions.length >= 2
      ? template.defaultOptions
      : ["选项1", "选项2"];

  return {
    title: template.defaultTitle,
    description: template.defaultDescription ?? "",
    options: baseOptions,
    titleStyle: {
      align: "left",
      fontSize: 18,
      color: "#111827",
      bold: true,
      italic: false
    },
    descriptionStyle: {
      align: "left",
      fontSize: 13,
      color: "#6b7280",
      bold: false,
      italic: false
    },
    optionStyle: {
      align: "left",
      fontSize: 14,
      color: "#374151",
      bold: false,
      italic: false
    }
  };
};

export const ensureTemplateSeed = async () => {
  const count = await db.templates.count();
  if (count > 0) return;

  const now = Date.now();
  const seededTemplates: StoredTemplate[] = BASE_QUESTION_TEMPLATES.map((t) => ({
    ...t,
    createdAt: now,
    updatedAt: now
  }));

  await db.transaction("rw", db.templates, db.templateConfigs, async () => {
    await db.templates.bulkAdd(seededTemplates);
    const configs = seededTemplates.map((t) => ({
      id: t.id,
      config: buildDefaultConfigFromTemplate(t)
    }));
    await db.templateConfigs.bulkAdd(configs);
  });
};

export const loadTemplates = async (): Promise<StoredTemplate[]> => {
  await ensureTemplateSeed();
  return db.templates.orderBy("updatedAt").reverse().toArray();
};

export const loadTemplateConfigs = async (): Promise<Record<string, TemplateConfig>> => {
  const rows = await db.templateConfigs.toArray();
  return rows.reduce<Record<string, TemplateConfig>>((acc, cur) => {
    acc[cur.id] = cur.config;
    return acc;
  }, {});
};

export const saveTemplate = async (template: QuestionTemplate) => {
  const now = Date.now();
  const existing = await db.templates.get(template.id);
  const record: StoredTemplate = {
    ...template,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  };
  await db.templates.put(record);
  const configExists = await db.templateConfigs.get(template.id);
  if (!configExists) {
    await db.templateConfigs.put({
      id: template.id,
      config: buildDefaultConfigFromTemplate(template)
    });
  }
};

export const saveTemplateConfig = async (templateId: string, config: TemplateConfig) => {
  await db.templateConfigs.put({ id: templateId, config });
  await db.templates.update(templateId, { updatedAt: Date.now() });
};

export const deleteTemplate = async (templateId: string) => {
  if (BASE_TEMPLATE_IDS.has(templateId)) {
    throw new Error("基础模板不可删除");
  }

  await db.transaction("rw", db.templates, db.templateConfigs, async () => {
    await db.templates.delete(templateId);
    await db.templateConfigs.delete(templateId);
  });
};

export interface SaveQuestionnairePayload {
  id?: string;
  name: string;
  paperSize: PaperSizeId;
  questions: QuestionDefinition[];
}

export const saveQuestionnaire = async (
  payload: SaveQuestionnairePayload
): Promise<QuestionnaireRecord> => {
  const now = Date.now();
  const existing = payload.id ? await db.questionnaires.get(payload.id) : undefined;
  const id = payload.id ?? `qn_${now.toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  const record: QuestionnaireRecord = {
    id,
    name: payload.name || existing?.name || "未命名问卷",
    paperSize: payload.paperSize,
    questions: payload.questions,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  };

  await db.questionnaires.put(record);
  return record;
};

export const listQuestionnaires = async (): Promise<QuestionnaireRecord[]> => {
  return db.questionnaires.orderBy("updatedAt").reverse().toArray();
};

export const getQuestionnaire = async (id: string): Promise<QuestionnaireRecord | undefined> => {
  return db.questionnaires.get(id);
};

export const getLatestQuestionnaire = async (): Promise<QuestionnaireRecord | undefined> => {
  return db.questionnaires.orderBy("updatedAt").reverse().first();
};

export const deleteQuestionnaire = async (id: string) => {
  await db.questionnaires.delete(id);
};
