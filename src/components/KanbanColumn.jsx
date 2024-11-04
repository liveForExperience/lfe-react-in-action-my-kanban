import { css } from "@emotion/react";
import { useState } from 'react';
import { KanbanCard } from "./KanbanCard";
import { KanbanNewCard } from "./KanbanNewCard";
import React from "react";

const KanbanColumn = ({
  onAdd,
  bgColor,
  title,
  setDraggedItem,
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  onDrop,
  onRemove,
  cardList = [],
  canAddNew = false,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const handleAdd = () => {
    setShowAdd(true);
  };
  const handleSubmit = (newCard) => {
    onAdd && onAdd(newCard);
    setShowAdd(false);
  };

  return (
    <section
      onDragStart={() => setIsDragSource(true)}
      onDragOver={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move";
        setIsDragTarget(true);
      }}
      onDragLeave={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "none";
        setIsDragTarget(false);
      }}
      onDrop={(evt) => {
        evt.preventDefault();
        onDrop && onDrop(evt);
      }}
      onDragEnd={(evt) => {
        evt.preventDefault();
        setIsDragSource(false);
        setIsDragTarget(false);
      }}
      css={css`
        flex: 1 1; /* 每个列根据需要缩放，且在父容器中等分 */
        display: flex;
        flex-direction: column;
        border: 1px solid gray; /* 灰色边框，宽度为 1px */
        border-radius: 1rem; /* 圆角边框，半径为 1rem */
        background-color: ${bgColor};

        & > h2 {
          margin: 0.6rem, 0.1rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid gray;

          & > button {
            float: right;
            margin-top: 0.2rem;
            padding: 0.2rem 0.5rem;
            border: 0;
            border-radius: 1rem;
            height: 1.8rem;
            line-height: 1rem;
            font-size: 1rem;
          }
        }

        & > ul {
          flex: 1;
          flex-basis: 0;
          margin: 1rem;
          padding: 0;
          overflow: auto;
        }
      `}
    >
      <h2>
        {title}
        {canAddNew && (
          <>
            <button onClick={handleAdd} disabled={showAdd}>
              &#8853; 添加新卡片
            </button>
          </>
        )}
      </h2>
      <ul>
        {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
        {cardList.map((props, index) => (
          <KanbanCard
            key={index}
            onDragStart={() => setDraggedItem(props)}
            onRemove={onRemove}
            {...props}
          ></KanbanCard>
        ))}
      </ul>
    </section>
  );
};

export { KanbanColumn };
