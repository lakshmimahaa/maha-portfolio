import { useEffect } from "react";
import portfolioHTML from "./portfolio/index.html?raw";
import "./portfolio/style.css";

const page = new DOMParser().parseFromString(portfolioHTML, "text/html");

page.querySelectorAll("script").forEach((script) => script.remove());

const portfolioContent = page.body.innerHTML;

export default function App() {
  useEffect(() => {
    import("./portfolio/script.js").catch(console.error);
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: portfolioContent }} />
  );
}