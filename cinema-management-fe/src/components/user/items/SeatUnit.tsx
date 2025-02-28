import { Box, Typography, useTheme } from "@mui/material"
import { SeatType } from "../../../types"

interface SeatUnitProps {
  seat: SeatType
  isSelected: boolean
  onClick: (seat: SeatType) => void
}
const SeatUnit: React.FC<SeatUnitProps> = ({ seat, isSelected, onClick }) => {
  const theme = useTheme()
  const getBackgroundColor = (status: string, isSelected: boolean): string => {
    if (status === "unavailable") {
      return "gray"
    }
    if (isSelected) {
      return theme.palette.secondary.main
    }
    return "white"
  }
  return (
    <Box
      onClick={() => onClick(seat)}
      sx={{
        width: 42,
        height: 26,
        borderRadius: "4px",
        backgroundColor: getBackgroundColor(seat.status, isSelected),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Typography sx={{ color: "black", fontSize: 14, fontWeight: "bold" }}>
        {seat.seat_id}
      </Typography>
    </Box>
  )
}

export default SeatUnit