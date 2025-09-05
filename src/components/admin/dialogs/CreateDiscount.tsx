import { useState, useEffect } from "react";
import { useMovies } from "../../../providers/MoviesProvider";
import CreateDialog from "./template/CreateDialog";

interface CreateDiscountProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newDiscount: any) => Promise<boolean>;
}
const types: string[] = ["percentage", "fixed"];

const CreateDiscount: React.FC<CreateDiscountProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const { movies, fetchMoviesData } = useMovies();
  const [code, setCode] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [minPurchase, setMinPurchase] = useState<string>("");
  const [maxUsage, setMaxUsage] = useState<string>("");
  const [remaining, setRemaining] = useState<string>("");
  const [movieId, setMovieId] = useState<string | null>(null);
  const [credit, setCredit] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Fetch movies on mount
  useEffect(() => {
    fetchMoviesData();
  }, [fetchMoviesData]);

  const handleAddClick = async () => {
    if (
      !code ||
      !type ||
      !expiryDate ||
      !value ||
      !minPurchase ||
      !maxUsage ||
      !remaining
    ) {
      setError("All fields are required");
      return;
    }
    if (
      isNaN(Number(value)) ||
      isNaN(Number(minPurchase)) ||
      isNaN(Number(maxUsage)) ||
      isNaN(Number(remaining)) ||
      (credit && isNaN(Number(credit)))
    ) {
      setError("Value, Min Purchase, Max Usage, and Remaining must be numbers");
      return;
    }
    const newDiscount = {
      code,
      discount_type: type,
      min_purchase: minPurchase,
      max_usage: maxUsage,
      value,
      remaining,
      expiry_date: expiryDate,
      movie_id: movieId || undefined,
      credit: credit ? Number(credit) : undefined,
    };
    const success = await onAdd(newDiscount);
    if (success) {
      setCode("");
      setType("");
      setValue("");
      setMinPurchase("");
      setMaxUsage("");
      setExpiryDate("");
      setRemaining("");
      setMovieId(null);
      setCredit("");
      setError("");
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  // Prepare movie options for autocomplete
  const movieOptions = [{ _id: "", title: "All Movies" }, ...movies];

  const sections = [
    {
      fields: [
        {
          name: "code",
          label: "CODE",
          type: "text" as const,
          placeholder: "Code",
          value: code,
          onChange: setCode,
        },
        {
          name: "type",
          label: "Type",
          type: "autocomplete" as const,
          placeholder: "Type",
          value: type,
          onChange: setType,
          options: types,
        },
        {
          name: "remaining",
          label: "Remaining",
          type: "number" as const,
          placeholder: "Remaining",
          value: remaining,
          onChange: setRemaining,
        },
        {
          name: "minPurchase",
          label: "Min Purchase",
          type: "number" as const,
          placeholder: "Min Purchase",
          value: minPurchase,
          onChange: setMinPurchase,
        },
        {
          name: "maxUsage",
          label: "Max Usage",
          type: "number" as const,
          placeholder: "Max Usage",
          value: maxUsage,
          onChange: setMaxUsage,
        },
        {
          name: "value",
          label: "Value",
          type: "number" as const,
          placeholder: "Value",
          value: value,
          onChange: setValue,
        },
        {
          name: "expiryDate",
          label: "Expiry Date",
          type: "date" as const,
          value: expiryDate,
          onChange: setExpiryDate,
        },
        {
          name: "movie",
          label: "Movie",
          type: "autocomplete" as const,
          placeholder: "Movie",
          value:
            movieOptions.find((m) => m._id === (movieId || "")) ||
            movieOptions[0],
          onChange: (newValue: any) => setMovieId(newValue?._id || null),
          options: movieOptions,
          getOptionLabel: (option: any) => option.title,
        },
        {
          name: "credit",
          label: "Credit",
          type: "number" as const,
          placeholder: "Credit",
          value: credit,
          onChange: setCredit,
        },
      ],
    },
  ];

  return (
    <CreateDialog
      open={open}
      onClose={handleClose}
      title="Create Discount"
      sections={sections}
      onAdd={handleAddClick}
      error={error}
    />
  );
};

export default CreateDiscount;
