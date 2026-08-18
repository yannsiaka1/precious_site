import { ViteReactSSG } from "vite-react-ssg/single-page";
import App from "./App";
import "./styles/index.css";

/**
 * `vite-react-ssg` génère un index.html complet au build (bon pour le
 * référencement et le partage), puis React reprend la main côté client.
 */
export const createRoot = ViteReactSSG(<App />);
