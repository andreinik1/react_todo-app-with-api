import React from 'react';
import { Todo } from '../types/Todo';
import * as todosApi from '../api/todos';

const FILTERS = [
  { label: 'All', value: '', cy: 'FilterLinkAll' },
  { label: 'Active', value: 'active', cy: 'FilterLinkActive' },
  { label: 'Completed', value: 'completed', cy: 'FilterLinkCompleted' },
];

type Props = {
  leftItems: number;
  query: string;
  setQuery: (query: string) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setError: (error: string) => void;
};

export const Footer: React.FC<Props> = ({
  leftItems,
  query,
  setQuery,
  todos,
  setTodos,
  setError,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftItems} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {FILTERS.map(({ label, value, cy }) => (
          <a
            key={value}
            href={`#/${value}`}
            className={`filter__link ${query === value ? 'selected' : ''}`}
            data-cy={cy}
            onClick={() => setQuery(value)}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={() => {
          const completedTodos = todos.filter(todo => todo.completed);
          const deletePromises = completedTodos.map(todo =>
            todosApi
              .deleteTodo(todo.id)
              .then(() => ({ id: todo.id, success: true }))
              .catch(() => ({ id: todo.id, success: false })),
          );

          Promise.all(deletePromises).then(results => {
            const failedIds = results
              .filter(result => !result.success)
              .map(result => result.id);

            const updatedTodos = todos.filter(todo => {
              if (todo.completed && !failedIds.includes(todo.id)) {
                return false;
              }

              return true;
            });

            setTodos(updatedTodos);

            if (failedIds.length > 0) {
              setError('Unable to delete a todo');
              setTimeout(() => {
                setError('');
              }, 3000);
            }
          });
        }}
      >
        {todos.some(todo => todo.completed) && 'Clear completed'}
      </button>
    </footer>
  );
};
