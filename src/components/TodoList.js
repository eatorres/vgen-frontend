import React from 'react';
import styled from 'styled-components';

import TodoItem from './TodoItem';

const List = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`;

export default function TodoList({
    items,
    emptyLabel,
    onTodoUpdated,
    onToggleError,
}) {
    return items.length > 0 ? (
        <List>
            {items.map((todo) => (
                <TodoItem
                    key={todo.todoID}
                    todo={todo}
                    onTodoUpdated={onTodoUpdated}
                    onToggleError={onToggleError}
                />
            ))}
        </List>
    ) : (
        <p className="muted">{emptyLabel}</p>
    );
}
