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
import TodoProjectPrefix from './components/TodoProjectPrefix';
import TodoTitle from './components/TodoTitle';

export type OnCompletedChangeCallback = (completed: boolean) => void;
export type OnEditClickCallback = () => void;

type Props = {
    todo: TodoType;
    project: Project;
    date?: Date;
    onCompletedChange: OnCompletedChangeCallback;
    isCurrent: boolean;
    isEditMode: boolean;
    onEditCancel: OnCancelCallback;
    showProject: boolean;
    onEditClick: OnEditClickCallback;
};

export default class Todo extends React.Component<Props> {
    private checkboxRef: React.RefObject<any>;

    constructor(props: Props) {
        super(props);

        this.checkboxRef = React.createRef();
    }

    private onCompleteChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.onCompletedChange(event.target.checked);

        // blur input to be able to still use keyboards shortcuts for navingation between todo's and not
        // be bound to checbox
        this.checkboxRef.current.blur();
    };

    private onEditClick: OnTodoEditClickCallback = event => {
        event.preventDefault();

        this.props.onEditClick();
    };

    private renderDisplayMode() {
        const { todo, isCurrent, project, showProject } = this.props;

        const className = createClassName('todo', {
            todo__current: isCurrent,
            todo__completed: !!todo.completedAt,
        });

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
                        <TodoEditActionButton onClick={this.onEditClick} />
                    </TodoActions>
                )}
            </div>
        );
    }

    private renderEditMode() {
        const { todo, date, onEditCancel } = this.props;

        return <EditTodo todo={todo} date={date} onCancel={onEditCancel} />;
    }

    public render() {
        const { isEditMode } = this.props;

        return isEditMode ? this.renderEditMode() : this.renderDisplayMode();
    }
}
