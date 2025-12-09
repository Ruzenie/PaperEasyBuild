import React from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent, SensorDescriptor } from "@dnd-kit/core";
import type { QuestionDefinition, PaperSizeId } from "@renderer/type/Builder";
import DraggableQuestion from "./DraggableQuestion";
import QuestionPreview from "./QuestionPreview";
import type { PaperSizePreset } from "../constants";
import { estimateQuestionHeight, getQuestionTypeLabel } from "../utils";

type QuestionCanvasProps = {
  questions: QuestionDefinition[];
  paperSize: PaperSizeId;
  activeSize: PaperSizePreset;
  sensors: SensorDescriptor<any>[];
  activeQuestionId: string | null;
  activeDragId: string | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: () => void;
  onQuestionClick: (id: string) => void;
};

const QuestionCanvas: React.FC<QuestionCanvasProps> = ({
  questions,
  paperSize,
  activeSize,
  sensors,
  activeQuestionId,
  activeDragId,
  onDragStart,
  onDragEnd,
  onDragCancel,
  onQuestionClick
}) => {
  const columnCount = paperSize === "ExamDouble" ? 2 : 1;
  const usableHeight = Math.max(activeSize.height - 48 - 32 - 40, 200);

  const pages = React.useMemo(() => {
    const createEmptyPage = () => ({
      columns: Array.from({ length: columnCount }, () => [] as QuestionDefinition[]),
      heights: Array(columnCount).fill(0)
    });

    const nextPages: { columns: QuestionDefinition[][]; heights: number[] }[] = [];
    let currentPage = createEmptyPage();
    nextPages.push(currentPage);
    let columnIndex = 0;

    for (const q of questions) {
      const height = estimateQuestionHeight(q);

      for (;;) {
        const currentHeight = currentPage.heights[columnIndex];
        const canFit = currentHeight + height <= usableHeight || currentHeight === 0;

        if (canFit) {
          currentPage.columns[columnIndex].push(q);
          currentPage.heights[columnIndex] += height;
          break;
        }

        if (columnIndex < columnCount - 1) {
          columnIndex += 1;
          continue;
        }

        currentPage = createEmptyPage();
        nextPages.push(currentPage);
        columnIndex = 0;
      }
    }

    return nextPages;
  }, [columnCount, questions, usableHeight]);

  let globalQuestionIndex = 0;

  return (
    <div className="builder-canvas-wrapper">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
        {pages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            className="builder-canvas"
            style={{
              width: activeSize.width,
              height: activeSize.height,
              marginBottom: 24
            }}
          >
            <div className="builder-canvas-size-label">
              {activeSize.label} · {activeSize.description} · 第 {pageIndex + 1} 页
            </div>
            {questions.length === 0 && pageIndex === 0 ? (
              <div className="builder-canvas-placeholder">从左侧选择题型，点击即可添加到试卷中</div>
            ) : columnCount === 1 ? (
              <div className="builder-question-list">
                {page.columns[0].map((q) => {
                  const globalIndex = globalQuestionIndex++;
                  const label = `第 ${globalIndex + 1} 题 · ${getQuestionTypeLabel(q.type)} · ${
                    q.required ? "必答" : "选答"
                  }`;

                  return (
                    <DraggableQuestion
                      key={q.id}
                      question={q}
                      label={label}
                      isActive={q.id === activeQuestionId || q.id === activeDragId}
                      onClick={onQuestionClick}
                      renderContent={(question) => <QuestionPreview question={question} />}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="builder-double">
                {page.columns.map((col, colIndex) => (
                  <React.Fragment key={colIndex}>
                    {colIndex === 1 && <div className="builder-double-divider" />}
                    <div className="builder-double-column">
                      <div className="builder-question-list">
                        {col.map((q) => {
                          const globalIndex = globalQuestionIndex++;
                          const label = `第 ${globalIndex + 1} 题 · ${getQuestionTypeLabel(q.type)} · ${
                            q.required ? "必答" : "选答"
                          }`;

                          return (
                            <DraggableQuestion
                              key={q.id}
                              question={q}
                              label={label}
                              isActive={q.id === activeQuestionId || q.id === activeDragId}
                              onClick={onQuestionClick}
                              renderContent={(question) => <QuestionPreview question={question} />}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        ))}
      </DndContext>
    </div>
  );
};

export default QuestionCanvas;
