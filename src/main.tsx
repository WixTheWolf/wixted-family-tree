import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CloudAssetsProvider } from "./context/CloudAssetsContext";
import { ContributionsProvider } from "./context/ContributionsContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CloudAssetsProvider>
      <ContributionsProvider>
        <App />
      </ContributionsProvider>
    </CloudAssetsProvider>
  </StrictMode>
);