import { Suspense } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { BrowserRouter } from "react-router-dom";

import App from "./app";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Suspense>
      <App />
    </Suspense>
  </BrowserRouter>
);
