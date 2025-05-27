import { createBrowserRouter } from "react-router";
import App from "./routes/Main";
import Changelogs from "./routes/Changelogs";
import { Layout } from "./components/Layout";
import Lab from "./routes/Lab";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: App,
      },
      {
        path: "lab",
        Component: Lab,
      },
      {
        path: "changelogs",
        Component: Changelogs,
      },
    ],
  },
]);
