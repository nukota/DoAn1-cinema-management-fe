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
  showImage?: string;
  actions?: DialogAction[];
  error?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  titleSx?: object;
  contentSx?: object;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  sections = [],
  children,
  showImage,
  actions = [],
  error,
  maxWidth,
  titleSx,
  contentSx,
}) => {
  // Find the image URL from the fields if showImage prop is provided
  const getImageUrl = () => {
    if (!showImage) return null;

    for (const section of sections) {
      const imageField = section.fields.find(
        (field) => field.name === showImage
      );
      if (imageField && imageField.value) {
        return imageField.value as string;
      }
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth || (showImage ? "md" : "sm")}
      fullWidth
    >
      <DialogTitle
        sx={{ fontWeight: "bold", fontSize: 24, padding: "16px 24px", ...titleSx }}
      >
        {title}
      </DialogTitle>
      <CustomDialogContent sx={contentSx}>
        <Box sx={{ display: "flex", gap: showImage ? 3 : 0 }}>
          {/* Left side - Form content */}
          <Box sx={{ flex: showImage ? 1 : "auto", minWidth: 0 }}>
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
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: field.type === "longtext" ? 115 : 45,
                    }}
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
          </Box>

          {/* Right side - Image display */}
          {showImage && (
            <Box
              sx={{
                flex: "0 0 200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                pt: 1,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "280px",
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  mt: 2,
                  backgroundColor: "#f5f5f5",
                  overflow: "hidden",
                }}
              >
                {imageUrl && (
                  <Box
                    component="img"
                    src={imageUrl}
                    alt="Preview"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="subtitle1"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                Preview
              </Typography>
            </Box>
          )}
        </Box>
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
