import React from 'react';
import { DispatchProp, connect } from 'react-redux';
import { RootAction } from '../../storage/actions/rootAction';
import ProjectFormStateHandler, {
    OnSubmittedAndValidCallback,
} from './components/ProjectFormStateHandler';
import { createAddProjectAction } from '../../storage/actions/factory/projectActionFactories';
import { Card, CardBody, Button } from 'reactstrap';

type Props = {};

type State = {
    showForm: boolean;
};

type CombinedProps = Props & DispatchProp<RootAction>;

class CreateProject extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            showForm: false,
        };
    }

    private onFormSubmittedAndValid: OnSubmittedAndValidCallback = values => {
        this.hideForm();

        this.props.dispatch(
            createAddProjectAction(values.title, values.abbrevation)
        );
    };

    private renderForm() {
        return (
            <ProjectFormStateHandler
                onFormSubmittedAndValid={this.onFormSubmittedAndValid}
            />
        );
    }

    private onButtonClick = () => {
        this.showForm();
    };

    private showForm() {
        this.setState(currentState => ({ ...currentState, showForm: true }));
    }

    private hideForm() {
        this.setState(currentState => ({ ...currentState, showForm: false }));
    }

    private renderButton() {
        return <Button onClick={this.onButtonClick}>+</Button>;
    }

    public render() {
        const { showForm } = this.state;

        return (
            <Card>
                <CardBody>
                    {showForm ? this.renderForm() : this.renderButton()}
                </CardBody>
            </Card>
        );
    }
}

export default connect()(CreateProject);
