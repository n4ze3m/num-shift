import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { GameProvider } from "./context/GameContext";
import { LabProvider } from "./context/LabContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameProvider>
      <LabProvider>
        <RouterProvider router={router} />
      </LabProvider>
    </GameProvider>
  </StrictMode>
);