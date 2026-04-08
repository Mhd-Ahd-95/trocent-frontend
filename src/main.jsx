import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./modules/App";
import { ContextProvider } from "./modules/contexts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,

  wsHost: import.meta.env.VITE_REVERB_HOST,

  wsPort: 80,
  wssPort: 443,

  forceTLS: true, // ✅ VERY IMPORTANT

  enabledTransports: ['ws', 'wss'],
});


// window.Echo = new Echo({
//   broadcaster: 'reverb',
//   key: import.meta.env.VITE_REVERB_APP_KEY,
//   wsHost: import.meta.env.VITE_REVERB_HOST,
//   wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
//   wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
//   forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
//   enabledTransports: ['ws', 'wss'],
// });

createRoot(document.getElementById("trocent-id")).render(
  <ContextProvider>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <App />
    </LocalizationProvider>
  </ContextProvider>
);