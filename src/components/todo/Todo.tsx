import React, { ChangeEvent } from 'react';
import { Todo as TodoType } from '../../model/todo';
import { Label, Input } from 'reactstrap';
import './Todo.scss';
import createClassName from 'classnames';
import EditTodo from './../editTodo/EditTodo';
import { OnCancelCallback } from '../createTodo/components/TodoForm';
import TodoDeadline from './components/TodoDeadline';
import { Project } from '../../model/project';
import TodoActions from './components/TodoActions';
import TodoEditActionButton, {
    OnTodoEditClickCallback,
} from './components/TodoEditActionButton';
import TodoPlanActionButton, {
    OnTodoPlanClickCallback,
} from './components/TodoPlanActionButton';
import TodoProjectPrefix from './components/TodoProjectPrefix';
import TodoTitle from './components/TodoTitle';
import PlanPopover from './components/PlanPopover';
import PlanTodoForm, {
    OnFormSubmittedAndValidCallback,
    PlanTodoFormValues,
} from './components/PlanTodoForm';

export type OnCompletedChangeCallback = (completed: boolean) => void;
export type OnEditClickCallback = () => void;

type Props = {
    todo: TodoType;
    project: Project;
    isPlanned: boolean;
    onCompletedChange: OnCompletedChangeCallback;
    isCurrent: boolean;
    isEditMode: boolean;
    onEditCancel: OnCancelCallback;
    showProject: boolean;
    onEditClick: OnEditClickCallback;
    onPlanFormSubmittedAndValid: (
        todo: TodoType,
        values: PlanTodoFormValues
    ) => void;
};

type State = {
    showPlanForm: boolean;
};

export const POPOVER_ID_PREFIX = 'todo-plan-action-button-';

export default class Todo extends React.Component<Props, State> {
    private checkboxRef: React.RefObject<any>;

    constructor(props: Props) {
        super(props);

        this.state = {
            showPlanForm: false,
        };

        this.checkboxRef = React.createRef();
    }

    private onCompleteChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.onCompletedChange(event.target.checked);

        // blur input to be able to still use keyboards shortcuts for navingation between todo's and not
        // be bound to checbox
        this.checkboxRef.current.blur();
    };

    private onPlanClick: OnTodoPlanClickCallback = event => {
        event.preventDefault();

        this.togglePlanFormVisibility();
    };

    private togglePlanFormVisibility() {
        this.setState(currentState => ({
            ...currentState,
            showPlanForm: !currentState.showPlanForm,
        }));
    }

    private onEditClick: OnTodoEditClickCallback = event => {
        event.preventDefault();

        this.props.onEditClick();
    };

    private onPlanCancel = () => {
        this.hidePlanForm();
    };

    private hidePlanForm() {
        this.setState(currentState => ({
            ...currentState,
            showPlanForm: false,
        }));
    }

    private onPlanFormSubmittedAndValid: OnFormSubmittedAndValidCallback = values => {
        const { onPlanFormSubmittedAndValid, todo } = this.props;

        this.hidePlanForm();

        if (onPlanFormSubmittedAndValid) {
            onPlanFormSubmittedAndValid(todo, values);
        }
    };

    private renderDisplayMode() {
        const { todo, isCurrent, project, showProject } = this.props;

        const className = createClassName('todo', {
            todo__current: isCurrent,
            todo__completed: !!todo.completedAt,
        });

        const popoverTargetId = `${POPOVER_ID_PREFIX}_${todo.id}`;

        return (
            <div className={className}>
                <Label check>
                    <Input
                        type="checkbox"
                        checked={!!todo.completedAt}
                        onChange={this.onCompleteChange}
                        innerRef={this.checkboxRef}
                    />{' '}
                    {todo.deadline && !todo.completedAt && (
                        <TodoDeadline deadline={todo.deadline} />
                    )}
                    {showProject && (
                        <TodoProjectPrefix abbrevation={project.abbrevation} />
                    )}
                    <TodoTitle title={todo.title} />
                </Label>
                {!todo.completedAt && (
                    <TodoActions>
                        <TodoPlanActionButton
                            onClick={this.onPlanClick}
                            targetId={popoverTargetId}
                        />
                        <TodoEditActionButton onClick={this.onEditClick} />
                    </TodoActions>
                )}
                <PlanPopover
                    isOpen={this.state.showPlanForm}
                    onCancel={this.onPlanCancel}
                    targetId={popoverTargetId}
                >
                    <PlanTodoForm
                        onFormSubmittedAndValid={
                            this.onPlanFormSubmittedAndValid
                        }
                        onCancel={this.onPlanCancel}
                    />
                </PlanPopover>
            </div>
        );
    }

    private renderEditMode() {
        const { todo, onEditCancel } = this.props;

        return <EditTodo todo={todo} onCancel={onEditCancel} />;
    }

    public render() {
        const { isEditMode } = this.props;

        return isEditMode ? this.renderEditMode() : this.renderDisplayMode();
    }
}
