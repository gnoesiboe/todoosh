import React from 'react';
import { Row, Col } from 'reactstrap';
import DayOverview from './../dayOverview/DayOverview';
import TimeNavigationButton, {
    Direction,
    OnClickCallback,
} from './components/TimeNavigationButton';

export default class CalendarOverview extends React.Component {
    private onBackClick: OnClickCallback = event => {
        event.preventDefault();

        console.log('navigate back');
    };

    private onForwardClick: OnClickCallback = event => {
        event.preventDefault();

        console.log('navigate forward');
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
                    <DayOverview />
                </Col>
                <Col md={4}>
                    <DayOverview />
                </Col>
                <Col md={2}>
                    <DayOverview />
                </Col>
                <Col md={2}>
                    <DayOverview />
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
