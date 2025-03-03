import React from "react";
import ReactDOM from "react-dom/client"; // <== EZ A HELYES IMPORT!
import App from "./App";
import axios from "axios";
import "./index.css";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);