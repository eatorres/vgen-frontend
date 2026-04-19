import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Colours, Typography } from '../definitions';
import apiFetch from '../functions/apiFetch';

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
    flex: 1;
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

const NameInput = styled.input`
    border: 1px solid ${Colours.GRAY_LIGHT};
    border-radius: 4px;
    box-sizing: border-box;
    color: ${Colours.BLACK};
    font-family: inherit;
    font-size: ${Typography.BODY_SIZES.L};
    font-weight: ${Typography.WEIGHTS.MEDIUM};
    line-height: 1.35;
    max-width: 100%;
    padding: 0.25rem 0.5rem;
    width: 100%;

    &:focus {
        outline: 2px solid ${Colours.BLACK};
        outline-offset: 2px;
    }
`;

const Meta = styled.span`
    color: ${Colours.BLACK};
    font-size: ${Typography.BODY_SIZES.S};
    opacity: 0.65;
`;

function PencilIcon() {
    return (
        <ToggleIconSvg fill="none" stroke="currentColor">
            <path
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </ToggleIconSvg>
    );
}

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
// Added a separate TodoItem component to keep the code more readable.
// All functionality related to transforming a todo is contained here.
export default function TodoItem({ todo, onTodoUpdated, onToggleError }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState('');
    const [saving, setSaving] = useState(false);
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (isEditing && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    }, [isEditing]);

    const handleToggleStatus = async () => {
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

    const handleStartEdit = () => {
        setIsEditing(true);
        setDraftName(todo.name ?? '');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setDraftName('');
    };

    const handleSaveName = async () => {
        if (saving) {
            return;
        }
        const name = draftName.trim();
        setSaving(true);

        const response = await apiFetch(`/todo/${todo.todoID}`, {
            method: 'PATCH',
            body: { name },
        });

        setSaving(false);

        if (response.status === 200) {
            const updated = response.body;
            if (updated?.todoID) {
                onTodoUpdated?.(updated);
            }
            handleCancelEdit();
        } else {
            onToggleError?.(
                response.body?.error ??
                    'Something went wrong while updating the todo.',
            );
        }
    };

    return (
        <Item>
            <ToggleButton
                type="button"
                onClick={handleToggleStatus}
                // I'm adding aria-labels in my own site, I'm trying to make a force of habit of adding them
                aria-label={
                    todo.status === 'completed'
                        ? 'Mark as incomplete'
                        : 'Mark as complete'
                }
            >
                <StatusToggleIcon status={todo.status} />
            </ToggleButton>
            <Body>
                {isEditing ? (
                    <NameInput
                        ref={nameInputRef}
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSaveName();
                            }
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                handleCancelEdit();
                            }
                        }}
                        aria-label="Todo name"
                        disabled={saving}
                    />
                ) : (
                    <Name>{todo.name}</Name>
                )}
                <Meta>
                    {dayjs(todo.created).format('MMM D, YYYY h:mm A')}
                </Meta>
            </Body>
            {!isEditing ? (
                <ToggleButton
                    type="button"
                    onClick={handleStartEdit}
                    aria-label="Edit name"
                >
                    <PencilIcon />
                </ToggleButton>
            ) : null}
        </Item>
    );
}
