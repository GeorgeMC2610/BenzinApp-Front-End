import { Modal, Button } from 'react-bootstrap';

function ConfirmModal({
  show,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  cancelVariant = 'outline-secondary',
  onConfirm,
  onCancel,
  isProcessing = false
}) {
  return (
    <Modal show={show} onHide={onCancel} centered backdrop="static">
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {typeof message === 'string' ? <p className="mb-0">{message}</p> : message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant={cancelVariant} onClick={onCancel} disabled={isProcessing}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={isProcessing}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;

