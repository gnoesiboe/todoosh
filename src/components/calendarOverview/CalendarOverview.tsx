import React from 'react';
import { Row, Col } from 'reactstrap';
import DayOverview, {
    OnTodoChangeCallback,
} from './../dayOverview/DayOverview';
import TimeNavigationButton, {
    Direction,
    OnClickCallback,
} from './components/TimeNavigationButton';
import { createDateRelativeToToday } from './../../utility/dateTImeHelper';
import { modifyTodo } from './../../model/modifier/todoModifier';
import { update as updateExistingTodo } from './../../infrastructure/repository/todoRepository';

type Props = {};

class CalendarOverview extends React.Component<Props> {
    private onBackClick: OnClickCallback = event => {
        event.preventDefault();

        // console.log('navigate back');
    };

    private onForwardClick: OnClickCallback = event => {
        event.preventDefault();

        // console.log('navigate forward');
    };

    private onTodoChange: OnTodoChangeCallback = (todo, field, newValue) => {
        const updatedTodo = modifyTodo(todo, field, newValue);

        updateExistingTodo(updatedTodo);
    };

    public render() {
        return (
            <Row>
                <Col md={1}>
                    <TimeNavigationButton
                        direction={Direction.Back}
                        onClick={this.onBackClick}
                    />
                </Col>
                <Col md={2}>
                    <DayOverview
                        onTodoChange={this.onTodoChange}
                        date={createDateRelativeToToday(-1)}
                    />
                </Col>
                <Col md={4}>
                    <DayOverview
                        onTodoChange={this.onTodoChange}
                        date={createDateRelativeToToday(0)}
                    />
                </Col>
                <Col md={2}>
                    <DayOverview
                        onTodoChange={this.onTodoChange}
                        date={createDateRelativeToToday(1)}
                    />
                </Col>
                <Col md={2}>
                    <DayOverview
                        onTodoChange={this.onTodoChange}
                        date={createDateRelativeToToday(2)}
                    />
                </Col>
                <Col md={1}>
                    <TimeNavigationButton
                        direction={Direction.Forward}
                        onClick={this.onForwardClick}
                    />
                </Col>
            </Row>
        );
    }
}

export default CalendarOverview;
