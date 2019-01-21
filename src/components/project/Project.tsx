import React from 'react';
import { Project as ProjectModel } from './../../model/project';
import './Project.scss';
import TodoOverview from '../calendarOverview/components/TodoOverview';
import { Todo as TodoModel } from '../../model/todo';
import Todo from '../todo/Todo';
import QuickCreateTodo from './../quickCreateTodo/QuickCreateTodo';
import { connect, DispatchProp } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import createClassName from 'classnames';
import { createSetCurrentTodoIndexAction } from '../../storage/actions/factory/currentTodoIndexActionFactories';
import { RootAction } from '../../storage/actions/rootAction';
import { OnCancelCallback } from '../createTodo/components/TodoForm';
import { createSetCurrentProjectIndexAction } from '../../storage/actions/factory/currentProjectIndexActionFactories';

type Props = {
    project: ProjectModel;
    isCurrent: boolean;
    index: number;
};

type ReduxSuppliedProps = {
    todos: TodoModel[];
    currentTodoIndex: number | null;
};

type CombinedProps = Props & ReduxSuppliedProps & DispatchProp<RootAction>;

type State = {
    isEditingTodo: boolean;
};

class Project extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            isEditingTodo: false,
        };
    }

    private onTodoEditClick = (todoIndex: number) => {
        const { dispatch, index } = this.props;

        dispatch(createSetCurrentProjectIndexAction(index));
        dispatch(createSetCurrentTodoIndexAction(todoIndex));

        this.startEditingTodo();
    };

    private startEditingTodo() {
        this.setState(currentState => ({
            ...currentState,
            isEditingTodo: true,
        }));
    }

    private stopEditingTodo() {
        this.setState(currentState => ({
            ...currentState,
            isEditingTodo: false,
        }));
    }

    private onEditCancel: OnCancelCallback = () => {
        this.stopEditingTodo();
    };

    private renderTodo(todo: TodoModel, index: number) {
        const { project, isCurrent, currentTodoIndex } = this.props;
        const { isEditingTodo } = this.state;

        const isEditMode =
            isCurrent && isEditingTodo && currentTodoIndex === index;

        console.log('is edit mode', isEditMode);

        return (
            <Todo
                onEditClick={() => this.onTodoEditClick(index)}
                showProject={false}
                project={project}
                key={todo.id}
                isEditMode={isEditMode}
                onEditCancel={this.onEditCancel}
                todo={todo}
                isCurrent={false}
                onCompletedChange={complete => {
                    console.log('on complete change', complete);
                }}
            />
        );
    }

    public render() {
        const { project, todos, isCurrent } = this.props;

        const className = createClassName('project', {
            project__current: isCurrent,
        });

        return (
            <div className={className}>
                <h3 className="project--title">
                    {project.abbrevation} | {project.title}
                </h3>
                <QuickCreateTodo project={project} />
                <TodoOverview droppableId={project.id}>
                    {todos.map((todo, index) => this.renderTodo(todo, index))}
                </TodoOverview>
            </div>
        );
    }
}

function mapGlobalStateToProps(
    globalState: GlobalState,
    props: Props
): ReduxSuppliedProps {
    const { project } = props;

    const allTodos = globalState.todos || {};
    const projectTodos = allTodos[project.id] || [];
    const currentTodoIndex = globalState.currentTodoIndex || null;

    return { todos: projectTodos, currentTodoIndex };
}

export default connect<ReduxSuppliedProps, {}, Props>(mapGlobalStateToProps)(
    Project
);
