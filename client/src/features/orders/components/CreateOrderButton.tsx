import OrderForm from "@/features/orders/components/OrderForm";
import { OrderDTO } from "@/features/orders/types";
import Button from "@mui/material/Button";
import { useState } from "react";
import Modal from "@/core/components/Modal/Modal";

interface CreateOrderButtonProps {
    onSubmit: (order: OrderDTO) => void;
}

export const CreateOrderButton = ({ onSubmit }: CreateOrderButtonProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ mt: 2 }}>
                Create Order
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <OrderForm
                    onSubmit={(orderData) => {
                        onSubmit(orderData);
                        setOpen(false);
                    }}
                />
            </Modal>
        </>
    );
};
