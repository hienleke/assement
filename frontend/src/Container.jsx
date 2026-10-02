import { Component } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { routes } from "@/routes/routes.js";

export class Container extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} Component={route.Component} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
