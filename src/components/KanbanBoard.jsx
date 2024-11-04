import { css } from "@emotion/react";
import { useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import React from "react";

const COLUMN_BG_COLORS = {
  loading: "#E3E3E3",
  todo: "#C9AF97",
  ongoing: "#FFE799",
  done: "#C0E8BA",
};
export const COLUMN_KEY_TODO = "todo",
  COLUMN_KEY_ONGOING = "ongoing",
  COLUMN_KEY_DONE = "done";

const kanbanBoardStyle = css`
  flex: 10; /* 占据父容器较大的空间，类似于 10:1 的比例 */
  display: flex; /* 使用 flex 布局 */
  flex-direction: row; /* 子元素水平排列 */
  gap: 1rem; /* 子元素之间的间距为 1rem */
  margin: 0 1rem 1rem; /* 外边距，左右和底部为 1rem，顶部为 0 */
`;

function KanbanBoard({
  isLoading = true,
  todoList,
  ongoingList,
  doneList,
  onAdd,
  onRemove,
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);

  const handleDrop = () => {
    if (
      !draggedItem ||
      !dragSource ||
      !dragTarget ||
      dragSource === dragTarget
    ) {
      return;
    }

    dragSource && onRemove(dragSource, draggedItem);
    dragTarget && onAdd(dragTarget, draggedItem);
  };

  return (
    <main css={kanbanBoardStyle}>
      {isLoading ? (
        <KanbanColumn
          title="读取中..."
          bgColor={COLUMN_BG_COLORS.loading}
        ></KanbanColumn>
      ) : (
        <>
          <KanbanColumn
            bgColor={COLUMN_BG_COLORS.todo}
            title={"待处理"}
            setIsDragSource={(isSrc) =>
              setDragSource(isSrc ? COLUMN_KEY_TODO : null)
            }
            setIsDragTarget={(isTgt) =>
              setDragTarget(isTgt ? COLUMN_KEY_TODO : null)
            }
            onAdd={onAdd}
            onDrop={handleDrop}
            onRemove={onRemove.bind(null, COLUMN_KEY_TODO)}
            setDraggedItem={setDraggedItem}
            cardList={todoList}
            canAddNew
          ></KanbanColumn>
          <KanbanColumn
            bgColor={COLUMN_BG_COLORS.ongoing}
            title={"进行中"}
            setIsDragSource={(isSrc) =>
              setDragSource(isSrc ? COLUMN_KEY_ONGOING : null)
            }
            setIsDragTarget={(isTgt) =>
              setDragTarget(isTgt ? COLUMN_KEY_ONGOING : null)
            }
            onDrop={handleDrop}
            onRemove={onRemove.bind(null, COLUMN_KEY_ONGOING)}
            setDraggedItem={setDraggedItem}
            cardList={ongoingList}
          ></KanbanColumn>
          <KanbanColumn
            bgColor={COLUMN_BG_COLORS.done}
            title={"已处理"}
            setIsDragSource={(isSrc) =>
              setDragSource(isSrc ? COLUMN_KEY_DONE : null)
            }
            setIsDragTarget={(isTgt) =>
              setDragTarget(isTgt ? COLUMN_KEY_DONE : null)
            }
            setDraggedItem={setDraggedItem}
            onDrop={handleDrop}
            onRemove={onRemove.bind(null, COLUMN_KEY_DONE)}
            cardList={doneList}
          ></KanbanColumn>
        </>
      )}
    </main>
  );
}

export { KanbanBoard };
