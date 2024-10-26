/** @jsxImportSource @emotion/react */
import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";

const DATA_STORE_KEY = "kanban-data-store";
const COLUMN_KEY_TODO = "todo",
  COLUMN_KEY_ONGOING = "ongoing",
  COLUMN_KEY_DONE = "done";

const COLUMN_BG_COLORS = {
  loading: "#E3E3E3",
  todo: "#C9AF97",
  ongoing: "#FFE799",
  done: "#C0E8BA",
};

const kanbanCardStyles = css`
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  border: 1px solid gray;
  border-radius: 1rem;
  list-style: none;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: left;

  &:hover {
    box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.2), inset 0 1px #fff;
  }
`;

const kanbanCardTitleStyles = css`
  min-height: 3rem;
`;

const MINUTE = 60 * 1000,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR,
  UPDATE_INTERVAL = MINUTE;

const KanbanBoard = ({ children }) => (
  <main
    css={css`
      flex: 10; /* 占据父容器较大的空间，类似于 10:1 的比例 */
      display: flex; /* 使用 flex 布局 */
      flex-direction: row; /* 子元素水平排列 */
      gap: 1rem; /* 子元素之间的间距为 1rem */
      margin: 0 1rem 1rem; /* 外边距，左右和底部为 1rem，顶部为 0 */
    `}
  >
    {children}
  </main>
);

const KanbanColumn = ({
  children,
  bgColor,
  title,
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  onDrop
}) => {
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
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
};

const KanbanCard = ({ title, status, onDragStart }) => {
  const [displayTime, setDisplayTime] = useState(status);
  useEffect(() => {
    const updateDisplayTime = () => {
      const timePassed = new Date() - new Date(status);
      let relativeTime = "刚刚";
      if (MINUTE <= timePassed && timePassed < HOUR) {
        relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
      } else if (HOUR < timePassed && timePassed < DAY) {
        relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
      } else if (DAY <= timePassed) {
        relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
      }
      setDisplayTime(relativeTime);
    };

    const intervalId = setInterval(updateDisplayTime, UPDATE_INTERVAL);
    updateDisplayTime();

    return function clean() {
      clearInterval(intervalId);
    };
  }, [status]);

  const handleDragStart = (evt) => {
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("text/plain", title);
    onDragStart && onDragStart(evt);
  };

  return (
    <li css={kanbanCardStyles} draggable onDragStart={handleDragStart}>
      <div css={kanbanCardTitleStyles}>{title}</div>
      <div
        css={css`
          text-align: right;
          font-size: 0.8rem;
          color: #333;
        `}
        title={status}
      >
        {displayTime}
      </div>
    </li>
  );
};

const KanbanNewCard = ({ onSubmit }) => {
  const [title, setTitle] = useState("");

  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };

  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
      onSubmit(title);
    }
  };

  return (
    <li css={kanbanCardStyles}>
      <h3>添加新卡片</h3>
      <div
        css={css`
          ${kanbanCardTitleStyles}
          & > input[type="text"] {
            width: 80%;
          }
        `}
      >
        <input
          type="text"
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </li>
  );
};

function App() {
  const [isLoading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState([
    { title: "开发任务-1", status: "2024-05-22 18:15" },
    { title: "开发任务-3", status: "2024-05-22 18:15" },
    { title: "开发任务-5", status: "2024-05-21 18:15" },
    { title: "测试任务-3", status: "2024-05-22 18:15" },
  ]);
  const [ongoingList, setOngoingList] = useState([
    { title: "开发任务-4", status: "2024-8-22 18:15" },
    { title: "开发任务-6", status: "2024-05-22 18:15" },
    { title: "测试任务-2", status: "2024-05-22 18:15" },
  ]);
  const [doneList, setDoneList] = useState([
    { title: "开发任务-2", status: "2024-05-22 18:15" },
    { title: "测试任务-1", status: "2024-05-22 18:15" },
  ]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);
  const handleDrop = (evt) => {
    if (!draggedItem || !dragSource || !dragTarget || dragSource === dragTarget) {
      return;
    }

    const updaters = {
      [COLUMN_KEY_TODO]: setTodoList,
      [COLUMN_KEY_ONGOING]: setOngoingList,
      [COLUMN_KEY_DONE]: setDoneList
    }

    if (dragSource) {
      updaters[dragSource]((currentStat) => 
        currentStat.filter((item) => !Object.is(item, draggedItem))
      );
    }

    if (dragTarget) {
      updaters[dragTarget]((currentStat) => [draggedItem, ...currentStat]);
    }
  }

  useEffect(() => {
    const data = window.localStorage.getItem(DATA_STORE_KEY);
    setTimeout(() => {
      if (data) {
        const kanbanColumnData = JSON.parse(data);
        setTodoList(kanbanColumnData.todoList);
        setOngoingList(kanbanColumnData.ongoingList);
        setDoneList(kanbanColumnData.doneList);
      }
      setLoading(false);
    }, 1000);
  }, []);

  const handleSaveAll = () => {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList,
    });
    window.localStorage.setItem(DATA_STORE_KEY, data);
  };

  const handleAdd = (evt) => {
    setShowAdd(true);
  };

  const handleSubmit = (title) => {
    todoList.unshift({ title, status: new Date().toDateString() });
    setTodoList(todoList);
    setShowAdd(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          我的看板
          <button onClick={handleSaveAll}>保存所有卡片</button>
        </h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard>
        {isLoading ? (
          <KanbanColumn
            title="读取中..."
            bgColor={COLUMN_BG_COLORS.loading}
          ></KanbanColumn>
        ) : (
          <>
            <KanbanColumn
              bgColor={COLUMN_BG_COLORS.todo}
              title={
                <>
                  <span>待处理</span>
                  <button onClick={handleAdd} disabled={showAdd}>
                    &#8853; 添加新卡片
                  </button>
                </>
              }
              setIsDragSource={(isSrc) =>
                setDragSource(isSrc ? COLUMN_KEY_TODO : null)
              }
              setIsDragTarget={(isTgt) =>
                setDragTarget(isTgt ? COLUMN_KEY_TODO : null)
              }
              onDrop={handleDrop}
            >
              {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
              {todoList.map((props, index) => (
                <KanbanCard
                  key={index}
                  onDragStart={() => setDraggedItem(props)}
                  {...props}
                ></KanbanCard>
              ))}
            </KanbanColumn>
            <KanbanColumn
              bgColor={COLUMN_BG_COLORS.ongoing}
              title="进行中"
              setIsDragSource={(isSrc) =>
                setDragSource(isSrc ? COLUMN_KEY_ONGOING : null)
              }
              setIsDragTarget={(isTgt) =>
                setDragTarget(isTgt ? COLUMN_KEY_ONGOING : null)
              }
              onDrop={handleDrop}
            >
              {ongoingList.map((props, index) => (
                <KanbanCard
                  key={index}
                  onDragStart={() => setDraggedItem(props)}
                  {...props}
                ></KanbanCard>
              ))}
            </KanbanColumn>
            <KanbanColumn
              bgColor={COLUMN_BG_COLORS.done}
              title="已处理"
              setIsDragSource={(isSrc) =>
                setDragSource(isSrc ? COLUMN_KEY_DONE : null)
              }
              setIsDragTarget={(isTgt) =>
                setDragTarget(isTgt ? COLUMN_KEY_DONE : null)
              }
              onDrop={handleDrop}
            >
              {doneList.map((props, index) => (
                <KanbanCard
                  key={index}
                  onDragStart={() => setDraggedItem(props)}
                  {...props}
                ></KanbanCard>
              ))}
            </KanbanColumn>
          </>
        )}
      </KanbanBoard>
    </div>
  );
}

export default App;
