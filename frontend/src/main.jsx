import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Container } from "@/Container.jsx";
import "@/styles/global.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Container />
  </StrictMode>,
);
