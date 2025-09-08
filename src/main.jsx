import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./modules/App";
import { ContextProvider } from "./modules/contexts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

createRoot(document.getElementById("trocent-id")).render(
  <StrictMode>
    <ContextProvider>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <App />
      </LocalizationProvider>
    </ContextProvider>
  </StrictMode>
);
