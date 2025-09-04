import React, { ReactNode } from "react";
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Field, { FormField } from "./Field";

const CustomDialogContent = styled(DialogContent)({
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#999",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#666",
  },
  overflowX: "hidden",
});

export interface FormSection {
  title?: string;
  fields: FormField[];
}

export interface DialogAction {
  label: string;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  disabled?: boolean;
}

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  sections?: FormSection[];
  children?: ReactNode;
  actions?: DialogAction[];
  error?: string;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  sections = [],
  children,
  actions = [],
  error,
}) => {
  return (
    <MuiDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontWeight: "bold", fontSize: 24, padding: "16px 24px" }}
      >
        {title}
      </DialogTitle>
      <CustomDialogContent>
        {sections.map((section, sectionIndex) => (
          <Box key={sectionIndex}>
            {section.title && (
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                fontWeight={550}
                sx={{ mt: sectionIndex === 0 ? 1 : 2 }}
              >
                {section.title}
              </Typography>
            )}
            {section.fields.map((field, fieldIndex) => (
              <Box
                key={fieldIndex}
                sx={{ display: "flex", alignItems: "center", height: 45 }}
              >
                <Typography sx={{ mr: 2, marginTop: 1, width: 180 }}>
                  {field.label}:
                </Typography>
                <Field field={field} />
              </Box>
            ))}
          </Box>
        ))}
        {children}
      </CustomDialogContent>

      {/* Error display */}
      {error && (
        <Box sx={{ px: 3, pt: 1 }}>
          <Typography color="error" variant="body2" sx={{ textAlign: "right" }}>
            {error}
          </Typography>
        </Box>
      )}

      {actions.length > 0 && (
        <DialogActions sx={{ mb: 1.5, mr: 2 }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || "contained"}
              color={action.color || "primary"}
              disabled={action.disabled || false}
              sx={{ width: 130 }}
              disableElevation
            >
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </MuiDialog>
  );
};

export default Dialog;
