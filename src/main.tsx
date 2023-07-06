import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { DashboardLayout } from "./layout/DashboardLayout";
import store from "./store/store";
import { Provider } from "react-redux/es/exports";
import { Login } from "./pages/Login";
import { ErrorPage } from "./pages/ErrorPage";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Devices } from "./pages/Devices";
import { Service } from "./pages/Service";
import { Report } from "./pages/Report";
import { Role } from "./pages/Role";
import { Account } from "./pages/Account";
import { History } from "./pages/History";
import { Number } from "./pages/Number";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/quenmatkhau",
    element: <ForgotPassword />,
  },
  {
    path: "/trangchu",
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
  },
  {
    path: "/thongke",
    element: (
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    ),
  },
  {
    path: "/thietbi",
    element: (
      <MainLayout>
        <Devices />
      </MainLayout>
    ),
  },
  {
    path: "/dichvu",
    element: (
      <MainLayout>
        <Service />
      </MainLayout>
    ),
  },
  {
    path: "/capso",
    element: (
      <MainLayout>
        <Number />
      </MainLayout>
    ),
  },
  {
    path: "/baocao",
    element: (
      <MainLayout>
        <Report />
      </MainLayout>
    ),
  },
  {
    path: "/vaitro",
    element: (
      <MainLayout>
        <Role />
      </MainLayout>
    ),
  },
  {
    path: "/taikhoan",
    element: (
      <MainLayout>
        <Account />
      </MainLayout>
    ),
  },
  {
    path: "/nhatky",
    element: (
      <MainLayout>
        <History />
      </MainLayout>
    ),
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
