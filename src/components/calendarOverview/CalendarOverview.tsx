import React from 'react';
import { Row, Col } from 'reactstrap';
import DayOverview, {
    OnTodoChangeCallback,
} from './../dayOverview/DayOverview';
import TimeNavigationButton, {
    Direction,
    OnClickCallback,
} from './components/TimeNavigationButton';
import {
    createDateRelativeToSupplied,
    createDateRange,
    parseDate,
    checkDateIsToday,
    formatDate,
} from './../../utility/dateTImeHelper';
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
    visibleDateRange: Date[];
};

class CalendarOverview extends React.Component<OwnProps & ReduxSuppliedProps> {
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
        const { visibleDateRange } = this.props;

        return (
            <Row>
                <Col md={1}>
                    <TimeNavigationButton
                        direction={Direction.Back}
                        onClick={this.onBackClick}
                    />
                </Col>
                {visibleDateRange.map(date => (
                    <Col
                        md={checkDateIsToday(date) ? 4 : 2}
                        key={formatDate(date)}
                    >
                        <DayOverview
                            onTodoChange={this.onTodoChange}
                            date={date}
                        />
                    </Col>
                ))}
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
    const cursor = parseDate(props.match.params.startDate);
    const oneDayBefore = createDateRelativeToSupplied(cursor, -1);
    const lastDay = createDateRelativeToSupplied(cursor, 2);

    const visibleDateRange = createDateRange(oneDayBefore, lastDay);

    return {
        todos: globalState.todos || null,
        visibleDateRange,
    };
}

export default connect<ReduxSuppliedProps, {}, OwnProps>(mapGlobalStateToProps)(
    CalendarOverview
);
