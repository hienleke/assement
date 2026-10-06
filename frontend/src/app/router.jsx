import MainLayout from "@/layouts/MainLayout/MainLayout.jsx";
import { Home } from "@/pages/Home/Home.jsx";

export const routes = [
  {
    Component: MainLayout,
    children: [
      {
        path: "/",
        Component: Home,
      },
    ],
  },
];
