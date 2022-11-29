import { ThemeProvider } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./components/Theme";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={ theme }>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
