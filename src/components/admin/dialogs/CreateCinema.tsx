import { useState } from "react";
import CreateDialog from "./template/CreateDialog";

interface CreateCinemaProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newCinema: any) => Promise<boolean>;
}

const CreateCinema: React.FC<CreateCinemaProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAddClick = async () => {
    if (!name || !address) {
      setError("Name and address are required");
      return;
    }

    const cinemaData = {
      name,
      address,
    };

    try {
      const success = await onAdd(cinemaData);
      if (success) {
        setName("");
        setAddress("");
        setError("");
      }
    } catch (error) {
      setError("Failed to add cinema");
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
          name: "name",
          label: "Full Name",
          type: "text" as const,
          placeholder: "Full Name",
          value: name,
          onChange: setName,
        },
        {
          name: "address",
          label: "Address",
          type: "text" as const,
          placeholder: "Address",
          value: address,
          onChange: setAddress,
        },
      ],
    },
  ];

  return (
    <CreateDialog
      open={open}
      onClose={handleClose}
      title="Add Cinema"
      sections={sections}
      onAdd={handleAddClick}
      error={error}
    />
  );
};

export default CreateCinema;
