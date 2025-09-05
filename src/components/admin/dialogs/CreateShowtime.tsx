import { useState } from "react";
import { MovieType } from "../../../interfaces/types";
import CreateDialog from "./template/CreateDialog";

interface CreateShowtimeProps {
  open: boolean;
  roomId: string;
  movies: MovieType[];
  onClose: () => void;
  onAdd: (newShowtime: any) => Promise<boolean>;
}

const CreateShowtime: React.FC<CreateShowtimeProps> = ({
  open,
  onClose,
  onAdd,
  roomId,
  movies,
}) => {
  const [movieId, setMovieId] = useState<string | null>(null);
  const [showtime, setShowtime] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAddClick = async () => {
    if (!movieId || !showtime || !price) {
      setError("Please fill in all fields");
      return;
    }
    const newShowtime = {
      room_id: roomId,
      movie_id: movieId,
      showtime,
      price: Number(price),
    };
    const success = await onAdd(newShowtime);
    if (success) {
      setMovieId(null);
      setShowtime("");
      setPrice("");
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
          name: "roomId",
          label: "Room ID",
          type: "text" as const,
          value: roomId || "",
          onChange: () => {}, // Read-only field
          disabled: true,
        },
        {
          name: "movie",
          label: "Movie",
          type: "autocomplete" as const,
          placeholder: "Movie",
          value: movies.find((m) => m._id === movieId) || null,
          onChange: (newValue: any) => setMovieId(newValue?._id || null),
          options: movies,
          getOptionLabel: (option: any) => option.title,
        },
        {
          name: "showtime",
          label: "Showtime",
          type: "datetime-local" as const,
          value: showtime,
          onChange: setShowtime,
        },
        {
          name: "price",
          label: "Price",
          type: "number" as const,
          placeholder: "Price",
          value: price,
          onChange: setPrice,
        },
      ],
    },
  ];

  return (
    <CreateDialog
      open={open}
      onClose={handleClose}
      title="Create Showtime"
      sections={sections}
      onAdd={handleAddClick}
      error={error}
    />
  );
};

export default CreateShowtime;
