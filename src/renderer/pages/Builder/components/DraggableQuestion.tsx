import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { QuestionDefinition } from "@renderer/type/Builder";

type DraggableQuestionProps = {
  question: QuestionDefinition;
  isActive: boolean;
  label: string;
  onClick: (id: string) => void;
  renderContent: (q: QuestionDefinition) => React.ReactNode;
};

const DraggableQuestion: React.FC<DraggableQuestionProps> = ({
  question,
  isActive,
  label,
  onClick,
  renderContent
}) => {
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: question.id
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging
  } = useDraggable({
    id: question.id
  });

  const setRef = (node: HTMLElement | null) => {
    setDropRef(node);
    setDragRef(node);
  };

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10
      }
    : undefined;

  return (
    <div
      ref={setRef}
      className={
        "builder-question-item" +
        (isActive ? " builder-question-item--active" : "") +
        (isDragging ? " builder-question-item--dragging" : "") +
        (!isDragging && isOver ? " builder-question-item--over" : "")
      }
      style={dragStyle}
      onClick={() => onClick(question.id)}
      {...attributes}
      {...listeners}
    >
      <div className="builder-question-meta">{label}</div>
      {renderContent(question)}
    </div>
  );
};

export default DraggableQuestion;
