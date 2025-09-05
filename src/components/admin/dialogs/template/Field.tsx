import React from "react";
import { TextField, Autocomplete, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "password"
    | "longtext"
    | "date"
    | "datetime-local"
    | "email"
    | "tel"
    | "number"
    | "autocomplete"
    | "list";
  placeholder?: string;
  required?: boolean;
  options?: any[]; // For autocomplete
  getOptionLabel?: (option: any) => string;
  value: any;
  onChange: (value: any) => void;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  disabled?: boolean; // For DetailDialog read-only mode
}

interface FieldProps {
  field: FormField;
}

const Field: React.FC<FieldProps> = ({ field }) => {
  const commonProps = {
    margin: "dense" as const,
    size: "small" as const,
    fullWidth: true,
    disabled: field.disabled || false,
  };

  switch (field.type) {
    case "password":
      return (
        <TextField
          {...commonProps}
          type={field.showPassword ? "text" : "password"}
          placeholder={field.placeholder}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          InputProps={{
            endAdornment: field.onTogglePassword && !field.disabled && (
              <IconButton onClick={field.onTogglePassword} edge="end">
                {field.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
      );

    case "longtext":
      return (
        <TextField
          {...commonProps}
          multiline
          rows={4}
          placeholder={field.placeholder}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
        />
      );

    case "list":
      return (
        <TextField
          {...commonProps}
          placeholder={field.placeholder}
          value={
            Array.isArray(field.value)
              ? field.value.join(", ")
              : field.value || ""
          }
          onChange={(e) => {
            const inputValue = e.target.value;
            const listValue = inputValue
              ? inputValue
                  .split(",")
                  .map((item) => item.trim())
                  .filter((item) => item !== "")
              : [];
            field.onChange(listValue);
          }}
        />
      );

    case "autocomplete":
      return (
        <Autocomplete
          options={field.options || []}
          value={field.value}
          onChange={(_, newValue) => field.onChange(newValue)}
          getOptionLabel={
            field.getOptionLabel || ((option) => option.toString())
          }
          fullWidth
          disabled={field.disabled}
          renderInput={(params) => (
            <TextField
              {...params}
              {...commonProps}
              placeholder={field.placeholder}
            />
          )}
        />
      );

    default:
      return (
        <TextField
          {...commonProps}
          type={field.type}
          placeholder={field.placeholder}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
        />
      );
  }
};

export default Field;
