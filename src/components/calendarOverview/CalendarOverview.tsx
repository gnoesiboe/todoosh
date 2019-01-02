import React from 'react';
import { Row, Col } from 'reactstrap';
import DayOverview, {
    OnTodoCompletedChangeCallback,
} from './../dayOverview/DayOverview';
import TimeNavigationButton, {
    Direction,
    OnClickCallback,
} from './components/TimeNavigationButton';
import {
    formatDate,
    parseDate,
    createDateRelativeToSupplied,
    checkIsSameDay,
    fomatDateToday,
} from './../../utility/dateTImeHelper';
import { connect, DispatchProp } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { createSetCurrentDateAction } from '../../storage/actions/factory/currentDateActionFactories';
import { RootAction } from './../../storage/actions/rootAction';
import CreateTodo from './../createTodo/CreateTodo';
import { TodoCollection } from '../../model/todo';
import { createVisibleDateRangeFromRouterDate } from './utility/dateRangeHelper';
import { applyOnlyRelevantTodosSelector } from './utility/relevantTodosSelector';
import { createToggleTodoCompletedAction } from '../../storage/actions/factory/todoActionFactories';
import mousetrap from 'mousetrap';
import { createTodosPath } from '../../routing/urlGenerator';
import { createSetCurrentTodoIndexAction } from '../../storage/actions/factory/currentTodoIndexActionFactories';
import {
    determineNextIndex,
    determinePrevousIndex,
} from './../../utility/arrayIndexNavigationHelper';

type ReactRouterMatchParams = {
    startDate: string;
};

type OwnProps = {} & RouteComponentProps<ReactRouterMatchParams>;

type ReduxSuppliedProps = {
    todos: TodoCollection;
    visibleDateRange: Date[];
    currentDate: Date;
    currentTodoIndex: number;
};

type CombinedProps = OwnProps &
    ReduxSuppliedProps &
    DispatchProp<RootAction> &
    RouteComponentProps<{}>;

const NEXT_DATE_SHORCUT = ['right', 'n'];
const PREVIOUS_DATE_SHORTCUT = ['left', 'p'];
const NEXT_TODO_SHORTCUT = ['down', 'j'];
const PREVIOUS_TODO_SHORTCUT = ['up', 'k'];
const TODAY_SHORTCUT = 't';
const TOGGLE_COMPLETED_SHORTCUT = 'space';

class CalendarOverview extends React.Component<CombinedProps> {
    public componentDidMount() {
        this.setCurrentDate(this.props.match.params.startDate);
        this.bindKeyboardShortcuts();
    }

    public componentWillUnmount() {
        this.unbindKeyboardShortcuts();
    }

    private bindKeyboardShortcuts() {
        mousetrap.bind(
            NEXT_DATE_SHORCUT,
            this.onMoveToNextDateKeyboardShortcutPressed
        );
        mousetrap.bind(
            PREVIOUS_DATE_SHORTCUT,
            this.onMoveToPreviousDateKeyboardShortcutPressed
        );
        mousetrap.bind(TODAY_SHORTCUT, this.onTodayKeyboardShortcutPressed);
        mousetrap.bind(
            NEXT_TODO_SHORTCUT,
            this.onMoveToNextTodoKeyboardShortcutPressed
        );
        mousetrap.bind(
            PREVIOUS_TODO_SHORTCUT,
            this.onMoveToPreviousTodoKeyboardShortcutPressed
        );
        mousetrap.bind(
            TOGGLE_COMPLETED_SHORTCUT,
            this.onToggleCompletedKeyboardShortcutPressed
        );
    }

    private onToggleCompletedKeyboardShortcutPressed = () => {
        const { todos, currentDate, currentTodoIndex } = this.props;

        const currentDayTodos = todos[formatDate(currentDate)];
        const currentTodo = currentDayTodos[currentTodoIndex];

        if (!currentTodo) {
            throw new Error('Could not resolve current todo');
        }

        this.setTodoCompletedStatus(
            currentTodo.id,
            currentDate,
            !currentTodo.isCompleted
        );
    };

    private onMoveToNextDateKeyboardShortcutPressed = () => {
        this.navigateToNextDate();
    };

    private onMoveToPreviousTodoKeyboardShortcutPressed = () => {
        const { dispatch, currentTodoIndex, todos, currentDate } = this.props;

        const arrayLength = todos[formatDate(currentDate)].length;
        const nextIndex = determinePrevousIndex(currentTodoIndex, arrayLength);

        dispatch(createSetCurrentTodoIndexAction(nextIndex));
    };

    private onMoveToNextTodoKeyboardShortcutPressed = () => {
        const { dispatch, currentTodoIndex, todos, currentDate } = this.props;

        const arrayLength = todos[formatDate(currentDate)].length;
        const nextIndex = determineNextIndex(currentTodoIndex, arrayLength);

        dispatch(createSetCurrentTodoIndexAction(nextIndex));
    };

    private navigateToNextDate() {
        const { currentDate, history } = this.props;

        const nextDate = createDateRelativeToSupplied(currentDate, 1);

        history.push(createTodosPath(formatDate(nextDate)));
    }

    private onMoveToPreviousDateKeyboardShortcutPressed = () => {
        this.navigateToPreviousDate();
    };

    private onTodayKeyboardShortcutPressed = () => {
        const { history } = this.props;

        history.push(createTodosPath(fomatDateToday()));
    };

    private navigateToPreviousDate() {
        const { currentDate, history } = this.props;

        const nextDate = createDateRelativeToSupplied(currentDate, -1);

        history.push(createTodosPath(formatDate(nextDate)));
    }

    private unbindKeyboardShortcuts() {
        mousetrap.unbind(NEXT_DATE_SHORCUT);
        mousetrap.unbind(PREVIOUS_DATE_SHORTCUT);
        mousetrap.unbind(TODAY_SHORTCUT);
        mousetrap.unbind(NEXT_TODO_SHORTCUT);
        mousetrap.unbind(PREVIOUS_TODO_SHORTCUT);
        mousetrap.unbind(TOGGLE_COMPLETED_SHORTCUT);
    }

    private setCurrentDate(date: string) {
        const { dispatch } = this.props;

        dispatch(createSetCurrentDateAction(date));
    }

    private onBackClick: OnClickCallback = event => {
        event.preventDefault();

        this.navigateToPreviousDate();
    };

    private onForwardClick: OnClickCallback = event => {
        event.preventDefault();

        this.navigateToNextDate();
    };

    private onTodoCompletedChange: OnTodoCompletedChangeCallback = (
        todo,
        date,
        completed
    ) => {
        this.setTodoCompletedStatus(todo.id, date, completed);
    };

    private setTodoCompletedStatus(
        todoId: string,
        date: Date,
        completed: boolean
    ) {
        const action = createToggleTodoCompletedAction(
            todoId,
            formatDate(date),
            completed
        );

        this.props.dispatch(action);
    }

    public render() {
        const { currentDate, todos, currentTodoIndex } = this.props;

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
                        <Col md={isCurrent ? 4 : 2} key={formatDate(date)}>
                            <DayOverview
                                onTodoCompletedChange={
                                    this.onTodoCompletedChange
                                }
                                date={date}
                                isCurrent={isCurrent}
                                todos={todosForDate}
                                currentTodoIndex={currentTodoIndex}
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
    const todos: TodoCollection = applyOnlyRelevantTodosSelector(
        globalState.todos || null,
        visibleDateRange
    );
    const currentTodoIndex = globalState.currentTodoIndex || 0;

    return { todos, visibleDateRange, currentDate, currentTodoIndex };
}

export default connect<ReduxSuppliedProps, {}, OwnProps>(mapGlobalStateToProps)(
    withRouter<OwnProps & ReduxSuppliedProps & DispatchProp<RootAction>>(
        CalendarOverview
    )
);
