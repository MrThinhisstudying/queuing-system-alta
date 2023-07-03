import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DefaultLayout, DashboardLayout } from "./layout";
import {
  ErrorPage,
  Login,
  ForgotPassword,
  Home,
  Dashboard,
  Devices,
  Service,
  CapSo,
  Report,
  Account,
  Role,
  History,
} from "./pages";
import store from "./store/store";
import { Provider } from "react-redux/es/exports";

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
      <DefaultLayout>
        {" "}
        <Home />{" "}
      </DefaultLayout>
    ),
  },
  {
    path: "/thongke",
    element: (
      <DashboardLayout>
        {" "}
        <Dashboard />{" "}
      </DashboardLayout>
    ),
  },
  {
    path: "/thietbi",
    element: (
      <DefaultLayout>
        {" "}
        <Devices />{" "}
      </DefaultLayout>
    ),
  },
  {
    path: "/dichvu",
    element: (
      <DefaultLayout>
        <Service />
      </DefaultLayout>
    ),
  },
  {
    path: "/capso",
    element: (
      <DefaultLayout>
        <CapSo />
      </DefaultLayout>
    ),
  },
  {
    path: "/baocao",
    element: (
      <DefaultLayout>
        <Report />
      </DefaultLayout>
    ),
  },
  {
    path: "/vaitro",
    element: (
      <DefaultLayout>
        <Role />
      </DefaultLayout>
    ),
  },
  {
    path: "/taikhoan",
    element: (
      <DefaultLayout>
        <Account />
      </DefaultLayout>
    ),
  },
  {
    path: "/nhatky",
    element: (
      <DefaultLayout>
        <History />
      </DefaultLayout>
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
