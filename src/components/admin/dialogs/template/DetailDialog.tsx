import React from "react";
import Dialog, { FormSection, DialogAction } from "./Dialog";

export type { FormField } from "./Field";
export type { FormSection, DialogAction };

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  sections: FormSection[];
  error?: string;
  isEditable?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({
  open,
  onClose,
  title,
  sections,
  error,
  isEditable = false,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) => {
  const actions: DialogAction[] = [
    {
      label: "Cancel",
      onClick: onCancel || onClose,
      variant: "outlined",
    },
  ];

  if (isEditable) {
    // Edit mode - show Save button
    if (onSave) {
      actions.push({
        label: "Save",
        onClick: onSave,
        variant: "contained",
        color: "primary",
      });
    }
  } else {
    // View mode - show Edit and/or Delete buttons
    if (onDelete) {
      actions.push({
        label: "Delete",
        onClick: onDelete,
        variant: "outlined",
        color: "error",
      });
    }
    if (onEdit) {
      actions.push({
        label: "Edit",
        onClick: onEdit,
        variant: "contained",
        color: "primary",
      });
    }
  }

  // Mark all fields as read-only in view mode
  const sectionsWithReadOnlyState = sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => ({
      ...field,
      disabled: !isEditable || field.disabled,
    })),
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      sections={sectionsWithReadOnlyState}
      actions={actions}
      error={error}
    />
  );
};

export default DetailDialog;
