import { Component } from "react";
import { Navigate, Route, Routes } from "react-router";
import { routes } from "@/app/router.jsx";
import { AppProviders } from "@/app/providers/AppProviders.jsx";
import "@/styles/global.scss";

export class App extends Component {
  render() {
    return (
      <AppProviders>
        <Routes>
          {routes.map((route) =>
            route.children ? (
              <Route key={route.path ?? "layout"} path={route.path} Component={route.Component}>
                {route.children.map((child) => (
                  <Route key={child.path} path={child.path} Component={child.Component} />
                ))}
              </Route>
            ) : (
              <Route key={route.path} path={route.path} Component={route.Component} />
            ),
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProviders>
    );
  }
}
