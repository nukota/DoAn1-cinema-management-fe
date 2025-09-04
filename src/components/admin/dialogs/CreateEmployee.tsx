import { useEffect, useState } from "react";
import { useCinemas } from "../../../providers/CinemasProvider";
import CreateDialog from "./template/CreateDialog";

interface CreateEmployeeProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newEmployee: any) => Promise<boolean>;
}
const shifts: string[] = ["Morning", "Afternoon", "Evening"];

const CreateEmployee: React.FC<CreateEmployeeProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [cccd, setCccd] = useState<string>("");
  const [cinemaId, setCinemaId] = useState<string>("");
  const [shift, setShift] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { cinemas, fetchCinemasData } = useCinemas();

  useEffect(() => {
    fetchCinemasData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleAddClick = async () => {
    if (
      !fullname ||
      !email ||
      !phone ||
      !dob ||
      !password ||
      !confirmPassword ||
      !cccd ||
      !cinemaId ||
      !shift ||
      !position
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const newEmployee = {
      full_name: fullname,
      email,
      phone,
      dateOfBirth: dob,
      cccd,
      cinema_id: cinemaId,
      shift,
      position,
      password,
    };
    const success = await onAdd(newEmployee);
    if (success) {
      setError("");
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  const sections = [
    {
      title: "Personal Info",
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
    {
      title: "Employment Info",
      fields: [
        {
          name: "cinema",
          label: "Cinema",
          type: "autocomplete" as const,
          placeholder: "Cinema",
          value: cinemas.find((c) => c._id === cinemaId) || null,
          onChange: (newValue: any) => setCinemaId(newValue?._id || ""),
          options: cinemas,
          getOptionLabel: (option: any) => `(ID: ${option._id}) ${option.name}`,
        },
        {
          name: "position",
          label: "Position",
          type: "text" as const,
          placeholder: "Position",
          value: position,
          onChange: setPosition,
        },
        {
          name: "shift",
          label: "Shift",
          type: "autocomplete" as const,
          placeholder: "Shift",
          value: shift,
          onChange: setShift,
          options: shifts,
        },
      ],
    },
  ];

  return (
    <CreateDialog
      open={open}
      onClose={handleClose}
      title="Add Employee"
      sections={sections}
      onAdd={handleAddClick}
      error={error}
    />
  );
};

export default CreateEmployee;
