import React, { ChangeEvent } from 'react';
import { Todo as TodoType } from '../../model/todo';
import { Label, Input } from 'reactstrap';

export type OnChangeCallback = (
    field: string,
    newValue: boolean | string
) => void;

type Props = {
    todo: TodoType;
    onChange: OnChangeCallback;
};

export default class Todo extends React.Component<Props> {
    private onIsCheckedChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.onChange('isChecked', event.target.checked);
    };

    public render() {
        const { todo } = this.props;

        return (
            <div>
                <Label check>
                    <Input
                        type="checkbox"
                        checked={todo.isChecked}
                        onChange={this.onIsCheckedChange}
                    />{' '}
                    {todo.title}
                </Label>
            </div>
        );
    }
}
