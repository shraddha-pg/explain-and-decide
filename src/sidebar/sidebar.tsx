import { createRoot } from "react-dom/client";
import SidebarApp from "./SidebarApp";

const mount = () => {
  const host = document.getElementById("ed-host");
  if (!host) return;
  createRoot(host).render(<SidebarApp />);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
