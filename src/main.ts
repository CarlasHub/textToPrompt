import "./styles.css";
import { initApp } from "./app/app";

const root = document.getElementById("app");
if (!root) {
  throw new Error("App root not found");
}

initApp(root);
