import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { countryOptions } from "../../../enum/enum";
import CreateDialog from "./template/CreateDialog";

const statusOptions: string[] = [
  "Coming Soon",
  "Now Playing",
  "Stopped",
  "Unknown",
];

interface CreateMovieProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newMovie: any) => Promise<boolean>;
}

const CreateMovie: React.FC<CreateMovieProps> = ({ open, onClose, onAdd }) => {
  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<string>("Unknown");
  const [posterURL, setPosterURL] = useState<string>("");
  const [genre, setGenre] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [ageLimit, setAgeLimit] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [director, setDirector] = useState<string>("");
  const [actors, setActors] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [trailerURL, setTrailerURL] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (
      !title ||
      !posterURL ||
      !status ||
      !genre.length ||
      !duration ||
      !country ||
      !ageLimit ||
      !releaseDate ||
      !director ||
      !actors.length ||
      !description ||
      !trailerURL
    ) {
      setError("All fields are required");
      return;
    }
    if (isNaN(Number(duration)) || isNaN(Number(ageLimit))) {
      setError("Duration and Age Limit must be numbers");
      return;
    }
    const movieData = {
      title,
      status,
      poster_url: posterURL,
      genre,
      duration: Number(duration),
      country,
      age_limit: Number(ageLimit),
      release_date: releaseDate,
      director: director,
      actors,
      description,
      trailer_url: trailerURL,
    };
    const success = await onAdd(movieData);
    if (success) {
      setTitle("");
      setStatus("Unknown");
      setPosterURL("");
      setGenre([]);
      setDuration("");
      setCountry("");
      setAgeLimit("");
      setReleaseDate("");
      setDirector("");
      setActors([]);
      setDescription("");
      setTrailerURL("");
      setError("");
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  const sections = [
    {
      title: "Basic Info",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text" as const,
          placeholder: "Title",
          value: title,
          onChange: setTitle,
        },
        {
          name: "status",
          label: "Status",
          type: "autocomplete" as const,
          placeholder: "Status",
          value: status,
          onChange: setStatus,
          options: statusOptions,
        },
        {
          name: "posterURL",
          label: "Poster URL",
          type: "text" as const,
          placeholder: "Poster URL",
          value: posterURL,
          onChange: setPosterURL,
        },
        {
          name: "genre",
          label: "Genre",
          type: "list" as const,
          placeholder: "Action, Drama, Comedy",
          value: genre,
          onChange: setGenre,
        },
        {
          name: "duration",
          label: "Duration",
          type: "number" as const,
          placeholder: "Duration (minutes)",
          value: duration,
          onChange: setDuration,
        },
        {
          name: "country",
          label: "Nation",
          type: "autocomplete" as const,
          placeholder: "Nation",
          value: country,
          onChange: setCountry,
          options: countryOptions,
        },
      ],
    },
    {
      title: "Details",
      fields: [
        {
          name: "ageLimit",
          label: "Age Limit",
          type: "number" as const,
          placeholder: "Age Limit (years)",
          value: ageLimit,
          onChange: setAgeLimit,
        },
        {
          name: "releaseDate",
          label: "Release Date",
          type: "date" as const,
          value: releaseDate,
          onChange: setReleaseDate,
        },
        {
          name: "director",
          label: "Director",
          type: "text" as const,
          placeholder: "Director",
          value: director,
          onChange: setDirector,
        },
        {
          name: "actors",
          label: "Cast",
          type: "list" as const,
          placeholder: "Actor 1, Actor 2, Actor 3",
          value: actors,
          onChange: setActors,
        },
        {
          name: "description",
          label: "Description",
          type: "longtext" as const,
          placeholder: "Description",
          value: description,
          onChange: setDescription,
        },
        {
          name: "trailerURL",
          label: "Trailer URL",
          type: "text" as const,
          placeholder: "Trailer URL",
          value: trailerURL,
          onChange: setTrailerURL,
        },
      ],
    },
  ];

  return (
    <CreateDialog
      open={open}
      onClose={handleClose}
      title="Add Movie"
      sections={sections}
      onAdd={handleSubmit}
      error={error}
    >
      {posterURL && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <img
            src={posterURL}
            alt="Movie Poster"
            style={{
              width: 160,
              height: 200,
              objectFit: "cover",
              borderRadius: 8,
            }}
            className="bg-[#eee]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <Typography variant="caption" sx={{ mt: 1 }}>
            Poster Preview
          </Typography>
        </Box>
      )}
    </CreateDialog>
  );
};

export default CreateMovie;
