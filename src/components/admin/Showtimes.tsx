import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { ShowtimeType } from "../../interfaces/types";
import { useShowtimes } from "../../providers/ShowtimesProvider";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";
import CustomDataGrid from "./elements/DataGrid";
import { DeleteOutline } from "@mui/icons-material";

const Showtimes: React.FC = () => {
  const { showtimes, fetchShowtimesData, deleteShowtime, loading } =
    useShowtimes();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    fetchShowtimesData();
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
    { field: "_id", headerName: "ID", width: 60 },
    {
      field: "movie_title",
      headerName: "Movie",
      flex: 1,
      width: 200,
      valueGetter: (_, row) => row.movie?.title || "N/A",
    },
    {
      field: "room_name",
      headerName: "Room",
      width: 200,
      valueGetter: (_, row) =>
        `${row.room?.name || "N/A"} (Cinema: ${
          row.room?.cinema?.name || "N/A"
        })`,
    },
    {
      field: "showtime",
      headerName: "Show Time",
      width: 180,
      valueFormatter: (value: any) =>
        value ? new Date(value).toLocaleString() : "N/A",
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      valueFormatter: (value: any) => `$${value?.toFixed(2) || "0.00"}`,
    },
    {
      field: "seats_available",
      headerName: "Available Seats",
      width: 140,
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
    <CustomDataGrid
      title="Showtimes Management"
      loading={loading}
      rows={showtimes}
      columns={columns}
      selectedRows={selectedRows}
      onRowSelectionChange={setSelectedRows}
      onDeleteSelected={handleDeleteSelectedShowtimes}
      showCheckboxSelection={true}
      getRowId={(row) => row._id}
    />
  );
};

export default Showtimes;
