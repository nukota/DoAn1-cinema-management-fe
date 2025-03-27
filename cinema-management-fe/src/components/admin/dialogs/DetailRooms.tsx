import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { CinemaType, RoomType } from "../../../types";
import { exampleRooms } from "../../../data";

// Define custom scrollbar styles
const CustomDialogContent = styled(DialogContent)({
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#999",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#666",
  },
});

interface DetailRoomsProps {
  cinema: CinemaType;
  open: boolean;
  onClose: () => void;
  onUpdateRoom: (room: RoomType) => void;
  onAddRoom: (room: RoomType) => void;
  onDeleteRoom: (room: RoomType) => void;
}

const status: string[] = ["REPAIRING", "WORKING"];

const DetailRooms: React.FC<DetailRoomsProps> = ({
  cinema,
  open,
  onClose,
  onUpdateRoom,
  onAddRoom,
  onDeleteRoom,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [rooms, setRooms] = useState<RoomType[] | null>([]);
  const [name, setName] = useState<string>("");
  const [seatCount, setSeatCount] = useState<number>(0);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);

  useEffect(() => {
    if (open) {
      setRooms(
        exampleRooms.filter((room) => room.cinema_id === cinema.cinema_id)
      );
      setIsEditing(false);
      setEditingRoom(null);
    }
  }, [open]);

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleDoneClick = () => {
    setIsEditing(false);
  };

  const handleAddRoom = async () => {};

  const handleDeleteRoom = async (room: RoomType) => {
    try {
      await onDeleteRoom(room);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditRoomClick = (room: RoomType) => {
    setEditingRoom(room);
  };

  const handleSaveRoom = async () => {
    try {
      await onUpdateRoom(editingRoom!);
      setEditingRoom(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        maxHeight: "90vh",
        overflow: "auto",
        width: { xs: "100%", sm: "80%", md: "60%" },
        placeSelf: "center",
      }}
    >
      <DialogTitle
        sx={{
          fontSize: 24,
          fontWeight: "bold",
          fontFamily: "inherit",
          padding: "16px 24px",
        }}
      >
        See All Rooms
      </DialogTitle>
      <CustomDialogContent>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography
            sx={{
              mr: 2,
              marginTop: 1,
              fontSize: 17,
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            Cinema: (ID {cinema?.cinema_id}) - {cinema?.name}
          </Typography>
        </Box>

        <Box sx={{ mt: 4, overflowY: "scroll", maxHeight: "50vh" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ width: "15%", fontWeight: 600, fontSize: 15 }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{ width: "35%", fontWeight: 600, fontSize: 15 }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{ width: "25%", fontWeight: 600, fontSize: 15 }}
                  >
                    Seat Count
                  </TableCell>
                  <TableCell
                    sx={{ width: "35%", fontWeight: 600, fontSize: 15 }}
                  >
                    Repairing
                  </TableCell>
                  {isEditing && (
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>
                      Action
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms!.map((room) => (
                  <TableRow key={room.room_id}>
                    <TableCell sx={{ width: "15%" }}>{room.room_id}</TableCell>
                    <TableCell sx={{ width: "35%" }}>
                      {editingRoom?.room_id === room.room_id ? (
                        <TextField
                          sx={{ width: "" }}
                          value={editingRoom.name}
                          onChange={(e) =>
                            setEditingRoom({
                              ...editingRoom,
                              name: e.target.value,
                            })
                          }
                          variant="standard"
                          size="small"
                        />
                      ) : (
                        room.name
                      )}
                    </TableCell>
                    <TableCell sx={{ width: "25%" }}>
                      {editingRoom?.room_id === room.room_id ? (
                        <TextField
                          type="number"
                          sx={{ width: "" }}
                          value={editingRoom.seat_count}
                          onChange={(e) =>
                            setEditingRoom({
                              ...editingRoom,
                              seat_count: Number(e.target.value),
                            })
                          }
                          variant="standard"
                          size="small"
                        />
                      ) : (
                        room.seat_count
                      )}
                    </TableCell>
                    <TableCell sx={{ width: "25%" }}>
                      {editingRoom?.room_id === room.room_id ? (
                        <Autocomplete
                          options={[
                            { label: "REPAIRING", value: true },
                            { label: "WORKING", value: false },
                          ]}
                          value={
                            editingRoom.repairing
                              ? { label: "REPAIRING", value: true }
                              : { label: "WORKING", value: false }
                          }
                          onChange={(event, newValue) =>
                            setEditingRoom({
                              ...editingRoom,
                              repairing: newValue?.value || false,
                            })
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ width: "175px" }}
                              variant="standard"
                              size="small"
                              placeholder="Select Status"
                            />
                          )}
                        />
                      ) : room.repairing ? (
                        "REPAIRING"
                      ) : (
                        "WORKING"
                      )}
                    </TableCell>
                    {isEditing && (
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {editingRoom?.room_id === room.room_id ? (
                            <IconButton onClick={handleSaveRoom}>
                              <SaveIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => handleEditRoomClick(room)}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          <IconButton onClick={() => handleDeleteRoom(room)}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {isEditing && (
                  <TableRow>
                    <TableCell sx={{ width: "15%" }}>
                      <TextField
                        sx={{ width: "75px" }}
                        label="ID"
                        disabled
                        variant="standard"
                        margin="none"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ width: "35%" }}>
                      <TextField
                        sx={{ width: "" }}
                        label="Name"
                        type="number"
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="none"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ width: "25%" }}>
                      <TextField
                        sx={{ width: "" }}
                        label="Seat Count"
                        type="number"
                        variant="standard"
                        value={seatCount}
                        onChange={(e) => setSeatCount(Number(e.target.value))}
                        margin="none"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ width: "25%" }}>
                      {/* <Autocomplete
                        sx={{ width: "175px" }}
                        label="Repairing"
                        variant="standard"
                        value={repairing}
                        onChange={(e) => setRepairing(e.target.value)}
                        margin="none"
                        size="small"
                      /> */}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={handleAddRoom}>
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CustomDialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{ width: 130 }}
        >
          CLOSE
        </Button>
        {isEditing ? (
          <Button
            onClick={handleDoneClick}
            color="primary"
            variant="contained"
            sx={{ width: 130 }}
          >
            DONE
          </Button>
        ) : (
          <Button
            onClick={handleModifyClick}
            color="primary"
            variant="contained"
            sx={{ width: 130 }}
          >
            Modify
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DetailRooms;
