import React, { Component } from 'react';
import './App.scss';
import { Container } from 'reactstrap';
import CalendarOverview from './calendarOverview/CalendarOverview';

class App extends Component {
    public render() {
        return (
            <Container fluid>
                <CalendarOverview />
            </Container>
        );
    }
}

export default App;
