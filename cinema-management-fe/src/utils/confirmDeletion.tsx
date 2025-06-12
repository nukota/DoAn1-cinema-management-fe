import { createRoot } from "react-dom/client";
import DeletionDialog from "../components/shared/DeletionDialog";
import { ThemeProvider } from "@emotion/react";
import theme from "../main";

export const confirmDeletion = (
  title?: string,
  message?: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const handleClose = (result: boolean) => {
      root.unmount();
      document.body.removeChild(container);
      resolve(result);
    };

    root.render(
      <ThemeProvider theme={theme}>
        <DeletionDialog
          open={true}
          title={title}
          message={message}
          onClose={handleClose}
        />
      </ThemeProvider>
    );
  });
};
