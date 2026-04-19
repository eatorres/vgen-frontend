import dayjs from 'dayjs';
import React from 'react';
import styled from 'styled-components';

import { Colours, Typography } from '../definitions';
import apiFetch from '../functions/apiFetch';

const List = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`;

const Item = styled.li`
    align-items: flex-start;
    border-bottom: 1px solid ${Colours.GRAY_LIGHT};
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    padding: 1rem 0;

    &:last-child {
        border-bottom: none;
    }
`;

const ToggleButton = styled.button`
    background: transparent;
    border: none;
    color: ${Colours.BLACK};
    cursor: pointer;
    flex-shrink: 0;
    line-height: 0;
    margin: 0;
    opacity: 0.85;
    padding: 0.125rem;

    &:hover {
        opacity: 1;
    }

    &:focus-visible {
        outline: 2px solid ${Colours.BLACK};
        outline-offset: 2px;
    }
`;

const ToggleIconSvg = styled.svg.attrs({
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
})`
    display: block;
    height: 22px;
    width: 22px;
`;

const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
`;

const Name = styled.span`
    color: ${Colours.BLACK};
    font-size: ${Typography.BODY_SIZES.L};
    font-weight: ${Typography.WEIGHTS.MEDIUM};
    word-break: break-word;
`;

const Meta = styled.span`
    color: ${Colours.BLACK};
    font-size: ${Typography.BODY_SIZES.S};
    opacity: 0.65;
`;

function StatusToggleIcon({ status }) {
    const isCompleted = status === 'completed';
    return (
        <ToggleIconSvg>
            <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
            {isCompleted ? (
                <path
                    d="M8 12l2.5 2.5L16 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            ) : null}
        </ToggleIconSvg>
    );
}

export default function TodoList({
    items,
    emptyLabel,
    onTodoUpdated,
    onToggleError,
}) {
    const handleToggleStatus = async (todo) => {
        const nextStatus =
            todo.status === 'completed' ? 'incomplete' : 'completed';

        const response = await apiFetch(`/todo/${todo.todoID}`, {
            method: 'PATCH',
            body: { status: nextStatus },
        });

        if (response.status === 200) {
            const updated = response.body;
            if (updated?.todoID) {
                onTodoUpdated?.(updated);
            }
        } else {
            onToggleError?.(
                response.body?.error ??
                    'Something went wrong while updating the todo.',
            );
        }
    };

    return items.length > 0 ? (
        <List>
            {items.map((todo) => (
                <Item key={todo.todoID}>
                    <ToggleButton
                        type="button"
                        onClick={() => handleToggleStatus(todo)}
                        aria-label={
                            todo.status === 'completed'
                                ? 'Mark as incomplete'
                                : 'Mark as complete'
                        }
                    >
                        <StatusToggleIcon status={todo.status} />
                    </ToggleButton>
                    <Body>
                        <Name>{todo.name}</Name>
                        <Meta>
                            {dayjs(todo.created).format('MMM D, YYYY h:mm A')}
                        </Meta>
                    </Body>
                </Item>
            ))}
        </List>
    ) : (
        <p className="muted">{emptyLabel}</p>
    );
}
