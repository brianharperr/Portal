import { WarningRounded } from "@mui/icons-material";
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Modal, ModalDialog } from "@mui/joy";

export default function DeleteConfirmationModal({ open, onClose, onConfirm, label, deleteLabel })
{
    return (
        <Modal open={open} onClose={() => onClose()}>
            <ModalDialog variant="outlined" role="alertdialog">
            <DialogTitle>
                <WarningRounded />
                Confirmation
            </DialogTitle>
            <Divider />
            <DialogContent>
                {label}
            </DialogContent>
            <DialogActions>
                <Button variant="solid" color="danger" onClick={() => onConfirm()}>
                {deleteLabel}
                </Button>
                <Button variant="plain" color="neutral" onClick={() => onClose()}>
                Cancel
                </Button>
            </DialogActions>
            </ModalDialog>
        </Modal>
    )
}