import { useState } from "react";
import CreateDialog from "./template/CreateDialog";

interface CreateCustomerProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newCustomer: any) => Promise<boolean>;
}

const CreateCustomer: React.FC<CreateCustomerProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [cccd, setCccd] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleAddClick = async () => {
    if (
      !fullname ||
      !cccd ||
      !email ||
      !phone ||
      !dob ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const newCustomer = {
      full_name: fullname,
      email,
      phone,
      dateOfBirth: dob,
      cccd,
      role: "customer",
      password,
    };
    const success = await onAdd(newCustomer);
    if (success) {
      setFullname("");
      setEmail("");
      setPhone("");
      setDob("");
      setCccd("");
      setPassword("");
      setConfirmPassword("");
      setError("");
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  const sections = [
    {
      fields: [
        {
          name: "fullname",
          label: "Full Name",
          type: "text" as const,
          placeholder: "Full Name",
          value: fullname,
          onChange: setFullname,
        },
        {
          name: "cccd",
          label: "CCCD",
          type: "text" as const,
          placeholder: "CCCD",
          value: cccd,
          onChange: setCccd,
        },
        {
          name: "dob",
          label: "Date of birth",
          type: "date" as const,
          value: dob,
          onChange: setDob,
        },
        {
          name: "phone",
          label: "Phone Num",
          type: "tel" as const,
          placeholder: "Phone Number",
          value: phone,
          onChange: setPhone,
        },
        {
          name: "email",
          label: "Email",
          type: "email" as const,
          placeholder: "Email",
          value: email,
          onChange: setEmail,
        },
        {
          name: "password",
          label: "Password",
          type: "password" as const,
          placeholder: "Password",
          value: password,
          onChange: setPassword,
          showPassword: showPassword,
          onTogglePassword: togglePasswordVisibility,
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password" as const,
          placeholder: "Confirm Password",
          value: confirmPassword,
          onChange: setConfirmPassword,
          showPassword: showConfirmPassword,
          onTogglePassword: toggleConfirmPasswordVisibility,
        },
      ],
    },
  ];

  return (
    <CreateDialog
      open={open}
      onClose={handleClose}
      title="Add Customer"
      sections={sections}
      onAdd={handleAddClick}
      error={error}
    />
  );
};

export default CreateCustomer;
