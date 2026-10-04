import { Component } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { routes } from "@/routes/routes.js";
import "@/styles/global.scss";
import styles from "./App.module.scss";

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className={styles.app}>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} Component={route.Component} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}
