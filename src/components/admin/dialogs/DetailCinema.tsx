import { useState, useEffect } from "react";
import { CinemaType } from "../../../interfaces/types";
import DetailDialog, { FormSection } from "./template/DetailDialog";

interface DetailCinemaProps {
  cinema: CinemaType;
  open: boolean;
  onClose: () => void;
  onSave: (newCinema: CinemaType) => Promise<boolean>;
  onDelete: () => void;
}

const DetailCinema: React.FC<DetailCinemaProps> = ({
  cinema,
  open,
  onClose,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (cinema) {
      setName(cinema.name);
      setAddress(cinema.address);
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [cinema, open]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!name || !address) {
      console.error("All fields are required");
      return;
    }
    const updatedCinema: CinemaType = {
      ...cinema,
      name,
      address,
    };
    onSave(updatedCinema);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    if (cinema) {
      setName(cinema.name);
      setAddress(cinema.address);
    }
    setIsEditing(false);
  };

  const sections: FormSection[] = [
    {
      fields: [
        {
          name: "id",
          label: "ID",
          type: "text",
          placeholder: "Auto generated",
          value: cinema?._id || "",
          onChange: () => {}, // ID is always read-only
          disabled: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          placeholder: "Name",
          value: name,
          onChange: (value) => setName(value),
        },
        {
          name: "address",
          label: "Address",
          type: "text",
          placeholder: "Address",
          value: address,
          onChange: (value) => setAddress(value),
        },
      ],
    },
  ];

  return (
    <DetailDialog
      open={open}
      onClose={onClose}
      title="Detail Cinema"
      sections={sections}
      isEditable={isEditing}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={onDelete}
    />
  );
};

export default DetailCinema;
