import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Alert from '../components/Alert';
import PageLayout from '../components/PageLayout';
import Tabs from '../components/Tabs';
import TodoList from '../components/TodoList';
import { Colours, Typography } from '../definitions';
import apiFetch from '../functions/apiFetch';

function normalizePatchedTodo(body) {
    if (!body || typeof body !== 'object') {
        return null;
    }
    if (body.todoID && body.status) {
        return body;
    }
    return null;
}

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Incomplete');

    useEffect(() => {
        let cancelled = false;

        const getTodoItems = async () => {
            setLoading(true);
            setError(null);

            const response = await apiFetch('/todo', { method: 'GET' });

            if (cancelled) {
                return;
            }

            if (response.status === 200) {
                setTodos(Array.isArray(response.body) ? response.body : []);
            } else {
                setError(response.body?.error ?? 'Something went wrong while loading your todos.');
            }
            setLoading(false);
        };

        getTodoItems()

        return () => {
            cancelled = true;
        };
    }, []);

    const incompleteTodos = todos.filter((todo) => todo.status === 'incomplete');
    const completeTodos = todos.filter((todo) => todo.status === 'completed');

    const handleToggleStatus = async (todo) => {
        const nextStatus =
            todo.status === 'completed' ? 'incomplete' : 'completed';

        const response = await apiFetch(`/todo/${todo.todoID}`, {
            method: 'PATCH',
            body: { status: nextStatus },
        });

        if (response.status === 200) {
            const updated = normalizePatchedTodo(response.body);
            if (updated?.todoID) {
                setTodos((prev) =>
                    prev.map((t) =>
                        t.todoID === updated.todoID ? { ...t, ...updated } : t,
                    ),
                );
            }
        } else {
            setError(
                response.body?.error ??
                    'Something went wrong while updating the todo.',
            );
        }
    };

    const tabs = [
        {
            title: 'Incomplete',
            content: (
                <TodoList
                    items={incompleteTodos}
                    emptyLabel="All done! Great job champ!"
                    onToggleStatus={handleToggleStatus}
                />
            ),
            onClick: () => setActiveTab('Incomplete'),
        },
        {
            title: 'Completed',
            content: (
                <TodoList
                    items={completeTodos}
                    emptyLabel="No completed todos."
                    onToggleStatus={handleToggleStatus}
                />
            ),
            onClick: () => setActiveTab('Completed'),
        },
    ];

    return (
        <PageLayout title="My todos">
            <Container>
                <div className="content">
                    <h1>My todos</h1>
                    <Alert message={error} onClose={() => setError(null)} />
                    {loading ? (
                        <p className="muted">Loading…</p>
                    ) : !error ? (
                        <Tabs activeTab={activeTab} tabs={tabs} />
                    ) : null}
                </div>
            </Container>
        </PageLayout>
    );
};

export default Todos;

const Container = styled.div`
    width: 100%;
    min-height: 50vh;
    .content {
        text-align: left;

        h1 {
            color: ${Colours.BLACK};
            font-size: ${Typography.HEADING_SIZES.M};
            font-weight: ${Typography.WEIGHTS.LIGHT};
            line-height: 2.625rem;
            margin-bottom: 2rem;
            margin-top: 1rem;
            text-align: center;
        }

        .muted {
            color: ${Colours.GRAY_DARK};
            font-size: ${Typography.BODY_SIZES.M};
            margin-top: 0.5rem;
            opacity: 0.8;
            text-align: center;
        }
    }
`;
