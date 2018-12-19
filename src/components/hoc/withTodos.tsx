import React from 'react';
import { Todo, TodoCollection } from './../../model/todo';
import { fetchAll } from './../../repository/todoRepository';

export type TodoSelector = <FP extends object>(
    props: FP,
    todo: Todo
) => boolean;

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
        constructor(props: P) {
            super(props);

            this.state = {
                todos: null,
            };
        }

        public componentDidMount() {
            fetchAll().then(todos =>
                this.setState(currentState => ({ ...currentState, todos }))
            );
        }

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
