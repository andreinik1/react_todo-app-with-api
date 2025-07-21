import React, { useEffect } from 'react';
import { USER_ID } from '.././api/todos';
import * as todosApi from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  headerInputRef: React.RefObject<HTMLInputElement>;
  setTempTodo: (todo: Omit<Todo, 'id'> | null) => void;
  isCreating: boolean;
  setIsCreating: (value: boolean) => void;
  currentCreatedTodo: string;
  setCurrentCreatedTodo: (value: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: (error: string) => void;
};

export const Header: React.FC<Props> = ({
  headerInputRef,
  setTempTodo,
  isCreating,
  setIsCreating,
  currentCreatedTodo,
  setCurrentCreatedTodo,
  setTodos,
  setError,
}) => {
  const reset = () => {
    setCurrentCreatedTodo('');
  };

  useEffect(() => {
    if (!isCreating && headerInputRef.current) {
      headerInputRef.current.focus();
    }
  }, [isCreating, headerInputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={e => e.preventDefault()}>
        <input
          ref={headerInputRef}
          autoFocus
          disabled={isCreating}
          data-cy="NewTodoField"
          type="text"
          value={currentCreatedTodo}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => {
            setCurrentCreatedTodo(e.currentTarget.value);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              const newTodo: Omit<Todo, 'id'> = {
                userId: USER_ID,
                title: e.currentTarget.value.trim(),
                completed: false,
              };

              setIsCreating(true);
              setTempTodo({ ...newTodo });

              todosApi
                .addTodo(newTodo)
                .then(addedTodo => {
                  setTodos((prevTodos: Todo[]) => [...prevTodos, addedTodo]);
                  reset();

                  setTempTodo(null);
                  setIsCreating(false);
                })
                .catch(error => {
                  setError('Unable to add a todo');
                  setTimeout(() => {
                    setError('');
                    setIsCreating(false);
                  }, 3000);
                  setTimeout(() => {
                    setTempTodo(null); // This ensures input is enabled after error
                  }, 300);
                  setCurrentCreatedTodo(currentCreatedTodo);
                  throw error;
                });
            } else if (e.key === 'Enter') {
              setError('Title should not be empty');
              setTimeout(() => {
                setError('');
              }, 3000);
            }
          }}
        />
      </form>
    </header>
  );
};
