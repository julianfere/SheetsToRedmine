import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { SideBar } from "./components/sidebar";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return <SideBar />;
}

export default App;
