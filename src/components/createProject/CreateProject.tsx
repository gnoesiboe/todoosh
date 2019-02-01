import React from 'react';
import { DispatchProp, connect } from 'react-redux';
import { RootAction } from '../../storage/actions/rootAction';
import ProjectFormStateHandler, {
    OnSubmittedAndValidCallback,
} from './components/ProjectFormStateHandler';
import { createAddProjectAction } from '../../storage/actions/factory/projectActionFactories';
import { Button } from 'reactstrap';
import './CreateProject.scss';
import addProjectIcon from './../../icons/add_project.svg';

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

    private onCreateCancel = () => {
        this.hideForm();
    };

    private renderForm() {
        return (
            <ProjectFormStateHandler
                onFormSubmittedAndValid={this.onFormSubmittedAndValid}
                onCancel={this.onCreateCancel}
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
        return (
            <Button
                color="secondary"
                onClick={this.onButtonClick}
                className="create-project--button"
                size="lg"
            >
                <img src={addProjectIcon} /> Add project
            </Button>
        );
    }

    public render() {
        const { showForm } = this.state;

        return (
            <div className="create-project">
                {showForm ? this.renderForm() : this.renderButton()}
            </div>
        );
    }
}

export default connect()(CreateProject);
