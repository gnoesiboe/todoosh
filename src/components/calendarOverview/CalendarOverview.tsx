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
import { RouteComponentProps } from 'react-router';
import { createSetCurrentDateAction } from '../../storage/actions/factory/currentDateActionFactories';
import { RootAction } from './../../storage/actions/rootAction';
import CreateTodo from './../createTodo/CreateTodo';
import { TodoCollection } from '../../model/todo';
import { createVisibleDateRangeFromRouterDate } from './utility/dateRangeHelper';
import { applyOnlyRelevantTodosSelector } from './utility/relevantTodosSelector';

type ReactRouterMatchParams = {
    startDate: string;
};

type OwnProps = {} & RouteComponentProps<ReactRouterMatchParams>;

type ReduxSuppliedProps = {
    todos: TodoCollection;
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
        const { currentDate, todos } = this.props;

        return (
            <Row>
                <Col md={1}>
                    <TimeNavigationButton
                        direction={Direction.Back}
                        onClick={this.onBackClick}
                    />
                </Col>
                {Object.keys(todos).map(dateAsString => {
                    const date = parseDate(dateAsString);
                    const isCurrent = checkIsSameDay(date, currentDate);
                    const todosForDate = todos[dateAsString];

                    return (
                        <Col
                            md={checkDateIsToday(date) ? 4 : 2}
                            key={formatDate(date)}
                        >
                            <DayOverview
                                onTodoChange={this.onTodoChange}
                                date={date}
                                isCurrent={isCurrent}
                                todos={todosForDate}
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
    // @todo do we still need this to be in global state? Or is it enough to have it in url
    const hasCurrentDateInGlobalState = !!globalState.currentDate;

    const currentDate = parseDate(props.match.params.startDate);
    const visibleDateRange = createVisibleDateRangeFromRouterDate(currentDate);
    const todos: TodoCollection = applyOnlyRelevantTodosSelector(
        globalState.todos || null,
        visibleDateRange
    );

    return {
        todos,
        visibleDateRange,
        hasCurrentDate: hasCurrentDateInGlobalState,
        currentDate,
    };
}

export default connect<ReduxSuppliedProps, {}, OwnProps>(mapGlobalStateToProps)(
    CalendarOverview
);