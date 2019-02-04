import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

type Props = {
    isOpen: boolean;
    onCancel: () => void;
};

const PlanTodoModal = ({ isOpen, onCancel }: Props) => (
    <Modal isOpen={isOpen} toggle={onCancel}>
        <ModalHeader>Plan todo</ModalHeader>
        <ModalBody>@todo display form</ModalBody>
    </Modal>
);

export default PlanTodoModal;
