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
import { RootAction } from '../../storage/actions/rootAction';
import { OnCancelCallback } from '../createTodo/components/TodoForm';
import { createSetCurrentProjectIndexAction } from '../../storage/actions/factory/currentProjectIndexActionFactories';
import { TodoSection } from '../../model/TodoSection';
import { createSetCurrentTodoAction } from '../../storage/actions/factory/currentTodoActionFactories';
import { createToggleTodoCompletedAction } from '../../storage/actions/factory/todoActionFactories';
import { createDroppableIdForProject } from '../../utility/dragAndDropHelpers';
import { Button } from 'reactstrap';
import deleteIcon from './../../icons/delete.svg';
import { createRemoveProjectAction } from '../../storage/actions/factory/combinedActionsFactories';

type Props = {
    project: ProjectModel;
    isCurrent: boolean;
    index: number;
};

type ReduxSuppliedProps = {
    todos: TodoModel[];
    currentTodoId: string | null;
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

    private onTodoEditClick = (id: string) => {
        const { dispatch, index } = this.props;

        dispatch(createSetCurrentProjectIndexAction(index));
        dispatch(createSetCurrentTodoAction(id, TodoSection.project));

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

    private onTodoCompleteChange = (todo: TodoModel) => {
        const action = createToggleTodoCompletedAction(todo.id);

        this.props.dispatch(action);
    };

    private onDeleteClick = () => {
        if (confirm('Are you sure you want to delete this project?')) {
            const { dispatch, project } = this.props;

            dispatch(
                // @ts-ignore @todo fix problem where thunks are not allowed to be dispatched
                createRemoveProjectAction(project.id)
            );
        }
    };

    private renderTodo(todo: TodoModel) {
        const { project, currentTodoId } = this.props;
        const { isEditingTodo } = this.state;

        const isEditMode = isEditingTodo && todo.id === currentTodoId;

        return (
            <Todo
                onEditClick={() => this.onTodoEditClick(todo.id)}
                showProject={false}
                project={project}
                key={todo.id}
                isEditMode={isEditMode}
                onEditCancel={this.onEditCancel}
                todo={todo}
                isCurrent={false}
                onCompletedChange={() => this.onTodoCompleteChange(todo)}
            />
        );
    }

    public render() {
        const { project, todos, isCurrent } = this.props;

        const className = createClassName('project', {
            project__current: isCurrent,
        });

        const droppableId = createDroppableIdForProject(project.id);

        return (
            <div className={className}>
                <h3 className="project--actions">
                    <ul className="list-unstyled">
                        <li>
                            <Button color="link" onClick={this.onDeleteClick}>
                                <img src={deleteIcon} />
                            </Button>
                        </li>
                    </ul>
                </h3>
                <h3 className="project--title">
                    {project.abbrevation} | {project.title}
                </h3>
                <QuickCreateTodo project={project} />
                <TodoOverview droppableId={droppableId}>
                    {todos.map(todo => this.renderTodo(todo))}
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

    // @todo move below to selector

    const allTodos = globalState.todos || [];
    const projectTodos = project.todos.map(todoId => {
        const todo = allTodos.find(cursorTodo => cursorTodo.id === todoId);

        if (!todo) {
            throw new Error(
                `Could not find referenced todo with id: ${todoId}`
            );
        }

        return todo;
    });
    const currentTodoId = globalState.currentTodo
        ? globalState.currentTodo[TodoSection.project]
        : null;

    return { todos: projectTodos, currentTodoId };
}

export default connect<ReduxSuppliedProps, {}, Props>(mapGlobalStateToProps)(
    Project
);
