import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ContributionsProvider } from "./context/ContributionsContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContributionsProvider>
      <App />
    </ContributionsProvider>
  </StrictMode>
);