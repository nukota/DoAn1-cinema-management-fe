import React from "react";
import { Button, Typography } from "@mui/material";

interface PrintTicketProps {
  pdfUrl: string | null;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onPrint: () => void;
}

const PrintTicket: React.FC<PrintTicketProps> = ({
  pdfUrl,
  iframeRef,
  onPrint,
}) => {
  return (
    <div className="p-4">
      <Typography variant="h5" sx={{ fontWeight: 500, width: "100%", mt: 4 }}>
        Ticket has been successfully booked!
      </Typography>
      {pdfUrl ? (
        <>
          <Typography
            variant="h5"
            color="gray"
            sx={{ fontWeight: 400, width: "100%", mt: 2 }}
          >
            An invoice has been generated. You can preview in opened tab.
          </Typography>
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            style={{ display: "none" }}
            title="Print PDF"
          />
        </>
      ) : (
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          PDF is not available.
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        onClick={onPrint}
        disabled={!pdfUrl}
      >
        Print Ticket
      </Button>
    </div>
  );
};

export default PrintTicket;
