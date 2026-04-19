import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Alert from '../components/Alert';
import PageLayout from '../components/PageLayout';
import { Colours, Typography } from '../definitions';
import apiFetch from '../functions/apiFetch';

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [needsAuth, setNeedsAuth] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const getTodoItems = async () => {
            setLoading(true);
            setError(null);
            setNeedsAuth(false);

            const response = await apiFetch('/todo');
            if (cancelled) {
                return;
            }

            if (response.status === 200) {
                setTodos(Array.isArray(response.body) ? response.body : []);
            } else if (response.status === 401) {
                setError('You need to sign in to view your todos.');
                setNeedsAuth(true);
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

    return (
        <PageLayout title="My todos">
            <Container>
                <div className="content">
                    <h1>My todos</h1>
                    <Alert message={error} onClose={() => setError(null)} />
                    {loading ? (
                        <p className="muted">Loading…</p>
                    ) : todos.length > 0 ? (
                        <ul className="todoList">
                            {todos.map((todo) => (
                                <li key={todo.todoID} className="todoItem">
                                    <span className="todoName">{todo.name}</span>
                                    <span className="todoMeta">
                                        {dayjs(todo.created).format('MMM D, YYYY h:mm A')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : !error ? (
                        <p className="muted">You don’t have any todos yet.</p>
                    ) : null}
                    {needsAuth && (
                        <Link className="authLink" href="/signin">
                            Sign in
                        </Link>
                    )}
                </div>
            </Container>
        </PageLayout>
    );
};

export default Todos;

const Container = styled.div`
    width: 100%;

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

        .todoList {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .todoItem {
            align-items: baseline;
            border-bottom: 1px solid ${Colours.GRAY_LIGHT};
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            padding: 1rem 0;

            &:last-child {
                border-bottom: none;
            }
        }

        .todoName {
            color: ${Colours.BLACK};
            font-size: ${Typography.BODY_SIZES.L};
            font-weight: ${Typography.WEIGHTS.MEDIUM};
            word-break: break-word;
        }

        .todoMeta {
            color: ${Colours.BLACK};
            font-size: ${Typography.BODY_SIZES.S};
            opacity: 0.65;
        }

        .authLink {
            color: ${Colours.NAVIGATION_BAR};
            display: inline-block;
            font-size: ${Typography.BODY_SIZES.M};
            margin-top: 1rem;
            text-align: center;
            width: 100%;
        }
    }
`;
