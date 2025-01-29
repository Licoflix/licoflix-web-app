import { Button, Modal } from "semantic-ui-react";
import { findTranslation } from "../../common/language/translations";
import { useStore } from "../../store/store";

interface ConfirmationModalProps {
    open: boolean;
    title: string;
    message: string;
    closeModal: () => void;
    onResult: (result: boolean) => void;
}

export const ConfirmationModal = ({ message, title, onResult, open, closeModal }: ConfirmationModalProps) => {
    const { commonStore: { language } } = useStore();

    const handleConfirm = (result: boolean) => {
        closeModal();
        onResult(result);
    };

    return (
        <Modal
            open={open}
            size='tiny'
            dimmer='blurring'
            onClose={closeModal}
            className="confirmation-modal"
        >
            <Modal.Header className="confirmation-modal-title"> {title}</Modal.Header>
            <Modal.Content className="confirmation-modal-content">
                {message}
            </Modal.Content>
            <Modal.Actions className="confirmation-modal-actions">
                <Button negative onClick={() => handleConfirm(false)} className='create-entity-button-border'>
                    {findTranslation('Cancel', language)}
                </Button>
                <Button positive onClick={() => handleConfirm(true)} className='create-entity-button'>
                    {findTranslation('Confirm', language)}
                </Button>
            </Modal.Actions>
        </Modal>
    );
}