import React, { Component } from 'react';
import './App.scss';
import { Container } from 'reactstrap';
import CalendarOverview from './calendarOverview/CalendarOverview';
import { Provider } from 'react-redux';
import { createStore } from '../storage/storeFactory';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { createHomePath, createTodosPath } from './../routing/urlGenerator';
import Home from './home/Home';
import KeyboardShortcutOverview from './keyboardShortcutOverview/KeyboardShortcutOverview';

class App extends Component {
    public render() {
        return (
            <Provider store={createStore()}>
                <Container fluid>
                    <BrowserRouter>
                        <Switch>
                            <Route
                                path={createHomePath()}
                                exact
                                component={Home}
                            />
                            <Route
                                path={createTodosPath()}
                                exact
                                component={CalendarOverview}
                            />
                        </Switch>
                    </BrowserRouter>
                    <KeyboardShortcutOverview />
                </Container>
            </Provider>
        );
    }
}

export default App;
