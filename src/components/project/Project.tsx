import React, { Fragment } from 'react';
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
import editIcon from './../../icons/edit.svg';
import { createRemoveProjectAction } from '../../storage/actions/factory/combinedActionsFactories';
import ProjectFormStateHandler, {
    OnSubmittedAndValidCallback,
} from '../createProject/components/ProjectFormStateHandler';
import { createUpdateProjectAction } from '../../storage/actions/factory/projectActionFactories';
import ProjectTitle from './components/ProjectTitle';

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
    isEditMode: boolean;
};

class Project extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            isEditingTodo: false,
            isEditMode: false,
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

    private onEditTodoCancel: OnCancelCallback = () => {
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

    private onEditClick = () => {
        this.startEditMode();
    };

    private startEditMode() {
        this.setState(currentState => ({ ...currentState, isEditMode: true }));
    }

    private stopEditMode() {
        this.setState(currentState => ({ ...currentState, isEditMode: false }));
    }

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
                onEditCancel={this.onEditTodoCancel}
                todo={todo}
                isCurrent={false}
                onCompletedChange={() => this.onTodoCompleteChange(todo)}
            />
        );
    }

    private renderViewMode() {
        const { project, todos } = this.props;

        const droppableId = createDroppableIdForProject(project.id);

        return (
            <Fragment>
                <QuickCreateTodo project={project} />
                <TodoOverview droppableId={droppableId}>
                    {todos.map(todo => this.renderTodo(todo))}
                </TodoOverview>
            </Fragment>
        );
    }

    private onEditProjectCancel = () => {
        this.stopEditMode();
    };

    private onEditFormSubmittedAndValid: OnSubmittedAndValidCallback = values => {
        this.stopEditMode();

        const { dispatch, project } = this.props;

        dispatch(
            createUpdateProjectAction(
                project.id,
                values.title,
                values.abbrevation
            )
        );
    };

    private renderEditMode() {
        const { project } = this.props;

        return (
            <ProjectFormStateHandler
                onCancel={this.onEditProjectCancel}
                project={project}
                onFormSubmittedAndValid={this.onEditFormSubmittedAndValid}
            />
        );
    }

    private renderActions() {
        if (this.state.isEditMode) {
            return null;
        }

        return (
            <h3 className="project--actions">
                <Button
                    color="link"
                    onClick={this.onEditClick}
                    className="project--action"
                >
                    <img src={editIcon} />
                </Button>
                <Button
                    color="link"
                    onClick={this.onDeleteClick}
                    className="project--action"
                >
                    <img src={deleteIcon} />
                </Button>
            </h3>
        );
    }

    public render() {
        const { project, isCurrent } = this.props;

        const className = createClassName('project', {
            project__current: isCurrent,
        });

        return (
            <div className={className}>
                {this.renderActions()}
                <ProjectTitle
                    title={project.title}
                    abbrevation={project.abbrevation}
                />
                {this.state.isEditMode
                    ? this.renderEditMode()
                    : this.renderViewMode()}
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
