import React, { ChangeEvent } from 'react';
import { Todo as TodoType } from '../../model/todo';
import { Label, Input } from 'reactstrap';
import './Todo.scss';
import { parseInlineMarkdown } from './../../utility/markdownHelper';
import createClassName from 'classnames';
import EditTodo from './../editTodo/EditTodo';
import { OnCancelCallback } from '../createTodo/components/TodoForm';
import TodoDeadline from './components/TodoDeadline';

export type OnCompletedChangeCallback = (completed: boolean) => void;

type Props = {
    todo: TodoType;
    date: Date;
    onCompletedChange: OnCompletedChangeCallback;
    isCurrent: boolean;
    isEditMode: boolean;
    onEditCancel: OnCancelCallback;
};

export default class Todo extends React.Component<Props> {
    private onCompleteChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.onCompletedChange(event.target.checked);
    };

    private renderDisplayMode() {
        const { todo, isCurrent } = this.props;

        const innerHtml = { __html: parseInlineMarkdown(todo.title) };

        const className = createClassName('todo', {
            todo__current: isCurrent,
            todo__completed: todo.isCompleted,
        });

        return (
            <div className={className}>
                <Label check>
                    <Input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={this.onCompleteChange}
                    />{' '}
                    {todo.deadline && !todo.isCompleted && (
                        <TodoDeadline deadline={todo.deadline} />
                    )}
                    <span
                        className="todo--title"
                        dangerouslySetInnerHTML={innerHtml}
                    />
                </Label>
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
