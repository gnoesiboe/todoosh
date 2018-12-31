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
    checkDateIsToday,
    formatDate,
    parseDate,
    checkIsSameDay,
} from './../../utility/dateTImeHelper';
import { connect, DispatchProp } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import { TodosReducerState } from '../../storage/reducers/todosReducer';
import { RouteComponentProps } from 'react-router';
import { createVisibleDateRangeFromRouterDate } from './utility/dateRangeHelper';
import { createSetCurrentDateAction } from '../../storage/actions/factory/currentDateActionFactories';
import { RootAction } from './../../storage/actions/rootAction';
import CreateTodo from './../createTodo/CreateTodo';

type ReactRouterMatchParams = {
    startDate: string;
};

type OwnProps = {} & RouteComponentProps<ReactRouterMatchParams>;

type ReduxSuppliedProps = {
    todos: TodosReducerState;
    visibleDateRange: Date[];
    hasCurrentDate: boolean;
    currentDate: Date;
};

class CalendarOverview extends React.Component<
    OwnProps & ReduxSuppliedProps & DispatchProp<RootAction>
> {
    public componentDidMount() {
        const { hasCurrentDate: hasCurrent, dispatch, match } = this.props;

        if (!hasCurrent) {
            dispatch(createSetCurrentDateAction(match.params.startDate));
        }
    }

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
        const { visibleDateRange, currentDate, todos } = this.props;

        return (
            <Row>
                <Col md={1}>
                    <TimeNavigationButton
                        direction={Direction.Back}
                        onClick={this.onBackClick}
                    />
                </Col>
                {visibleDateRange.map(date => {
                    const isCurrent = checkIsSameDay(date, currentDate);

                    return (
                        <Col
                            md={checkDateIsToday(date) ? 4 : 2}
                            key={formatDate(date)}
                        >
                            <DayOverview
                                onTodoChange={this.onTodoChange}
                                date={date}
                                isCurrent={isCurrent}
                                todos={todos || []}
                            >
                                {isCurrent ? (
                                    <CreateTodo date={this.props.currentDate} />
                                ) : (
                                    undefined
                                )}
                            </DayOverview>
                        </Col>
                    );
                })}
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
    const currentDate = parseDate(props.match.params.startDate);
    const visibleDateRange = createVisibleDateRangeFromRouterDate(currentDate);
    const hasCurrentDate = !!globalState.currentDate;

    // @todo insert the todo's grouped by date for easy handling in the component?

    return {
        todos: globalState.todos || null,
        visibleDateRange,
        hasCurrentDate,
        currentDate,
    };
}

export default connect<ReduxSuppliedProps, {}, OwnProps>(mapGlobalStateToProps)(
    CalendarOverview
);
