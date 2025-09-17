    import React from "react";
    import { createRoot } from "react-dom/client";
    import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
    import App from "./App";
    import "./styles.css";

    createRoot(document.getElementById("root")).render(
      <BrowserRouter> {/* Wrap App with BrowserRouter */}
        <App />
      </BrowserRouter>
    );
    