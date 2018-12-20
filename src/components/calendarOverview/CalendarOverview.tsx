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
import { connect } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import { TodosReducerState } from '../../storage/reducers/todosReducer';
import { RouteComponentProps } from 'react-router';

type ReactRouterMatchParams = {
    startDate: string;
};

type OwnProps = {} & RouteComponentProps<ReactRouterMatchParams>;

type ReduxSuppliedProps = {
    todos: TodosReducerState;
};

class CalendarOverview extends React.Component<OwnProps> {
    private onBackClick: OnClickCallback = event => {
        event.preventDefault();

        // console.log('navigate back');
    };

    private onForwardClick: OnClickCallback = event => {
        event.preventDefault();

        // console.log('navigate forward');
    };

    private onTodoChange: OnTodoChangeCallback = () => {
        // console.log('update todo', arguments);
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

function mapGlobalStateToProps(
    globalState: GlobalState,
    props: OwnProps
): ReduxSuppliedProps {
    console.log('props: ', props.match.params.startDate);

    return {
        todos: globalState.todos || null,
    };
}

export default connect<ReduxSuppliedProps, {}, OwnProps>(mapGlobalStateToProps)(
    CalendarOverview
);
