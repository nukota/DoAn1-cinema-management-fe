import { UserType } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";

interface ProfileProps {
  user: UserType;
  open: boolean;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          position: "absolute",
          top: "48px",
          right: "20px",
          margin: 0,
          width: "300px",
          height: "500px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
          fontWeight: "nomal",
          fontFamily: "inherit",
          padding: "16px 24px",
          color: "#124C86",
        }}
      >
        Profile Info
        <Box
          sx={{
            position: "relative", // Ensures overlay is positioned relative to the image
            width: 40,
            height: 40,
            borderRadius: "50%",
            overflow: "hidden", // Ensures overlay doesn't spill outside the image
            boxShadow: 3,
            backgroundColor: "#f2f2f2",
          }}
        >
          {/* <Box
            component="img"
            src={avatar ? avatar : exampleAv}
            alt="Placeholder"
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              boxShadow: 3,
            }}
          /> */}
          {/* Upload overlay */}
          <Box
            component="label"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity: 0,
              transition: "opacity 0.3s",
              "&:hover": {
                opacity: 1,
                cursor: "pointer",
              },
            }}
          >
            Upload
            <input
              type="file"
              accept="image/*"
              // onChange={handleImageChange}
              style={{
                display: "none",
              }}
            />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent className="flex flex-col w-full h-full border-1 border-light-gray bg-white p-2 mt-4">
        <Box sx={{ display: "flex", alignItems: "center", height: 35 }}>
          <Typography sx={{ color: "#595959", mr: 2, width: 100 }}>
            ID
          </Typography>
          <Typography>{user.user_id}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 35 }}>
          <Typography sx={{ color: "#595959", mr: 2, width: 100 }}>
            Full name
          </Typography>
          <Typography>{user.fullname}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 35 }}>
          <Typography sx={{ color: "#595959", mr: 2, width: 100 }}>
            Role
          </Typography>
          <Typography>{user.role}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 35 }}>
          <Typography sx={{ color: "#595959", mr: 2, width: 100 }}>
            Date of Birth
          </Typography>
          <Typography>{user.dob}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 35 }}>
          <Typography sx={{ color: "#595959", mr: 2, width: 100 }}>
            Phone
          </Typography>
          <Typography style={{ margin: "dense" }}>{user.phone}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 35 }}>
          <Typography sx={{ color: "#595959", mr: 2, width: 100 }}>
            Email
          </Typography>
          <Typography style={{ margin: "dense" }}>{user.email}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        <Button
          // onClick={onClose}
          variant="outlined"
          sx={{
            width: 130,
            color: "#124C86", // Custom text color
            borderColor: "#124C86", // Custom border color
            "&:hover": {
              backgroundColor: "#124C86", // Custom hover background color
              color: "white", // Custom hover text color
            },
          }}
        >
          Modify
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            width: 130,
            color: "#124C86", // Custom text color
            borderColor: "#124C86", // Custom border color
            "&:hover": {
              backgroundColor: "#124C86", // Custom hover background color
              color: "white", // Custom hover text color
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Profile;
