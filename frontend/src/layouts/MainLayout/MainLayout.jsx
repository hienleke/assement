import { Outlet } from "react-router";
import Header from "@/components/layout/Header/Header.jsx";
import "./MainLayout.scss";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
