import React from 'react';
import { Todo, TodoCollection } from './../../model/todo';
import {
    fetchAll,
    addListener,
    removeListener,
} from './../../infrastructure/repository/todoRepository';

export type TodoSelector = (props: {}, todo: Todo) => boolean;

export type AddedProps = {
    todos: TodoCollection;
};

type State = {
    todos: TodoCollection | null;
};

const withTodos = (todoSelector: TodoSelector) => <P extends AddedProps>(
    WrappedComponent: React.ComponentType<P>
) => {
    type WrappedComponentPropsExceptProvided = Exclude<
        keyof P,
        keyof AddedProps
    >;
    type ForwardedProps = Pick<P, WrappedComponentPropsExceptProvided>;

    return class TodosProvider extends React.Component<ForwardedProps, State> {
        private listenerKey: string | undefined;

        constructor(props: P) {
            super(props);

            this.state = {
                todos: null,
            };
        }

        public componentDidMount() {
            this.fetchTodos().then(() => {
                this.listenerKey = addListener(this.onTodosChanged);
            });
        }

        public componentWillUnmount() {
            if (this.listenerKey) {
                removeListener(this.listenerKey);
            }
        }

        private async fetchTodos(): Promise<void> {
            const todos = await fetchAll();

            this.setState(currentState => ({ ...currentState, todos }));
        }

        private onTodosChanged = () => {
            this.fetchTodos();
        };

        public render() {
            const { todos } = this.state;

            if (todos === null) {
                return <p>Loading..</p>; // @todo replace with loader?
            }

            const todosToSupply = todos.filter(todo =>
                todoSelector(this.props, todo)
            );

            // @ts-ignore
            return <WrappedComponent {...this.props} todos={todosToSupply} />;
        }
    };
};

export default withTodos;
