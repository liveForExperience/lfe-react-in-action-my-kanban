import { css } from "@emotion/react";
import { kanbanCardStyles, kanbanCardTitleStyles } from "./KanbanCard";
import { useState } from "react";
import React from "react";

function KanbanNewCard({ onSubmit }) {
    const [title, setTitle] = useState("");

    const handleChange = (evt) => {
        setTitle(evt.target.value);
    };

    const handleKeyDown = (evt) => {
        if (evt.key === "Enter") {
            const newCard = {title, status: new Date().toString()};
            onSubmit(newCard);
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
                    onKeyDown={handleKeyDown} />
            </div>
        </li>
    );
}

export { KanbanNewCard };
