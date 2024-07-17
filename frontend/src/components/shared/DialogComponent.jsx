import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
} from "@material-tailwind/react";
import { useState } from "react";

const DialogComponent = ({open=false, handleOpen,size="xs", children }) => {
    return (
        <>
            <Dialog
                dismiss={{
                    enabled:false,
                }}
                size={size}
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none backdrop:none"
            >
                <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="">
                        {children}
                    </CardBody>
                </Card>
            </Dialog>
        </>
    );
}

export default DialogComponent;