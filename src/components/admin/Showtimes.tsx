import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { ShowtimeType } from "../../interfaces/types";
import { useShowtimes } from "../../providers/ShowtimesProvider";
import { useRooms } from "../../providers/RoomsProvider";
import { useMovies } from "../../providers/MoviesProvider";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";
import CustomDataGrid from "./elements/DataGrid";
import { DeleteOutline } from "@mui/icons-material";
import GenerateShowtimes from "./dialogs/GenerateShowtimes";
import CreateShowtime from "./dialogs/CreateShowtime";

const Showtimes: React.FC = () => {
  const {
    showtimes,
    fetchShowtimesData,
    deleteShowtime,
    createShowtime,
    loading,
  } = useShowtimes();
  const { rooms, fetchRoomsData } = useRooms();
  const { movies, fetchMoviesData } = useMovies();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchShowtimesData();
    fetchRoomsData();
    fetchMoviesData();
  }, []);

  const handleDeleteShowtime = async (showtime: ShowtimeType) => {
    const confirmed = await confirmDeletion(
      "Delete Showtime",
      `Are you sure you want to delete showtime for "${
        showtime.movie.title
      }" at ${new Date(
        showtime.showtime
      ).toLocaleString()}? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteShowtime(showtime._id);
        await fetchShowtimesData();
        toast.success("Showtime deleted successfully!");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };

  const handleGenerateShowtimes = () => {
    setGenerateDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateShowtime = async (newShowtime: any): Promise<boolean> => {
    try {
      await createShowtime(newShowtime);
      await fetchShowtimesData();
      setCreateDialogOpen(false);
      toast.success("Showtime created successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleDeleteSelectedShowtimes = async () => {
    if (selectedRows.length === 0) return;

    const confirmed = await confirmDeletion(
      "Delete Showtimes",
      `Are you sure you want to delete ${selectedRows.length} showtime(s)? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await Promise.all(selectedRows.map((id) => deleteShowtime(String(id))));
        await fetchShowtimesData();
        setSelectedRows([]);
        toast.success(
          `${selectedRows.length} showtime(s) deleted successfully!`
        );
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "movie_title",
      headerName: "Movie",
      flex: 1,
      minWidth: 180,
      valueGetter: (_, row) => row.movie?.title || "N/A",
    },
    {
      field: "room_name",
      headerName: "Room",
      flex: 0.5,
      minWidth: 100,
      valueGetter: (_, row) => row.room?.name || "N/A",
    },
    {
      field: "showtime",
      headerName: "Show Time",
      flex: 0.75,
      minWidth: 180,
      valueFormatter: (value) => {
        if (!value) return "";
        const date = new Date(value);
        return date.toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="delete"
          icon={
            <DeleteOutline
              sx={{
                fontSize: { xs: 20, sm: 24, md: 28 },
              }}
            />
          }
          label="Delete"
          onClick={() => handleDeleteShowtime(params.row)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <CustomDataGrid
        title="Showtimes Management"
        loading={loading}
        rows={showtimes}
        columns={columns}
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        onDeleteSelected={handleDeleteSelectedShowtimes}
        onGenerateShowtimes={handleGenerateShowtimes}
        onAddNew={handleAddNewClick}
        showCheckboxSelection={true}
        getRowId={(row) => row._id}
      />
      <GenerateShowtimes
        open={generateDialogOpen}
        onClose={() => setGenerateDialogOpen(false)}
        onGenerated={fetchShowtimesData}
      />
      <CreateShowtime
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onAdd={handleCreateShowtime}
        rooms={rooms}
        movies={movies}
      />
    </>
  );
};

export default Showtimes;
