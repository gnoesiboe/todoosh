import React from 'react';
import { DispatchProp, connect } from 'react-redux';
import { RootAction } from '../../storage/actions/rootAction';
import ProjectFormStateHandler, {
    OnSubmittedAndValidCallback,
} from './components/ProjectFormStateHandler';
import { createAddProjectAction } from '../../storage/actions/factory/projectActionFactories';
import { Card, CardBody } from 'reactstrap';

type Props = {};

type CombinedProps = Props & DispatchProp<RootAction>;

class CreateProject extends React.Component<CombinedProps> {
    private onFormSubmittedAndValid: OnSubmittedAndValidCallback = values => {
        this.props.dispatch(
            createAddProjectAction(values.title, values.abbrevation)
        );
    };

    public render() {
        return (
            <Card>
                <CardBody>
                    <ProjectFormStateHandler
                        onFormSubmittedAndValid={this.onFormSubmittedAndValid}
                    />
                </CardBody>
            </Card>
        );
    }
}

export default connect()(CreateProject);
