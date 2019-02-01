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
import ProjectOverview from './projectOverview/ProjectOverview';
import TodoDragAndDropContainer from './todoDragAndDropContainer/TodoDragAndDropContainer';
import { ToastContainer } from 'react-toastify';

class App extends Component {
    public render() {
        return (
            <Provider store={createStore()}>
                <Container fluid>
                    <TodoDragAndDropContainer>
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
                        <ProjectOverview />
                        <ToastContainer />
                    </TodoDragAndDropContainer>
                    <KeyboardShortcutOverview />
                </Container>
            </Provider>
        );
    }
}

export default App;
