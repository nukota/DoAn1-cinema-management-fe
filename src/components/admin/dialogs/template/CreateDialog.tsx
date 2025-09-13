import React, { ReactNode } from "react";
import Dialog, { FormSection, DialogAction } from "./Dialog";

export type { FormField } from "./Field";
export type { FormSection, DialogAction };

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  sections?: FormSection[];
  children?: ReactNode;
  onAdd: () => void;
  error?: string;
  showImage?: string;
}

const CreateDialog: React.FC<CreateDialogProps> = ({
  open,
  onClose,
  title,
  sections,
  children,
  onAdd,
  error,
  showImage,
}) => {
  const actions: DialogAction[] = [
    {
      label: "Cancel",
      onClick: onClose,
      variant: "outlined",
    },
    {
      label: "Add",
      onClick: onAdd,
      variant: "contained",
      color: "primary",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      sections={sections}
      actions={actions}
      error={error}
      showImage={showImage}
    >
      {children}
    </Dialog>
  );
};

export default CreateDialog;
