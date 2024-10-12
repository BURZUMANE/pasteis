import { ReactNode } from "react";
import Box from "@mui/material/Box";
import MuiModal from "@mui/material/Modal";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    maxWidth?: number | string;
    padding?: number | string;
}

const Modal = ({ open, onClose, children, maxWidth = 500, padding = 3 }: ModalProps) => {
    return (
        <MuiModal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: padding,
                    boxShadow: 24,
                    maxWidth: maxWidth,
                    width: '100%',
                    borderRadius: 2,
                }}
            >
                {children}
            </Box>
        </MuiModal>
    );
};

export default Modal;
