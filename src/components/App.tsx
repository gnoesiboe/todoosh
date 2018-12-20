import React, { Component } from 'react';
import './App.scss';
import { Container } from 'reactstrap';
import CalendarOverview from './calendarOverview/CalendarOverview';
import { Provider } from 'react-redux';
import { createStore } from '../storage/storeFactory';

class App extends Component {
    public render() {
        return (
            <Provider store={createStore()}>
                <Container fluid>
                    <CalendarOverview />
                </Container>
            </Provider>
        );
    }
}

export default App;
