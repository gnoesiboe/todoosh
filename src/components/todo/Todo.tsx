import React, { ChangeEvent } from 'react';
import { Todo as TodoType } from '../../model/todo';
import { Label, Input } from 'reactstrap';
import './Todo.scss';
import { parseInlineMarkdown } from './../../utility/markdownHelper';

export type OnCompletedChangeCallback = (completed: boolean) => void;

type Props = {
    todo: TodoType;
    onCompletedChange: OnCompletedChangeCallback;
};

export default class Todo extends React.Component<Props> {
    private onCompleteChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.onCompletedChange(event.target.checked);
    };

    public render() {
        const { todo } = this.props;
        const innerHtml = { __html: parseInlineMarkdown(todo.title) };

        return (
            <div className="todo">
                <Label check>
                    <Input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={this.onCompleteChange}
                    />{' '}
                    <span dangerouslySetInnerHTML={innerHtml} />
                </Label>
            </div>
        );
    }
}
