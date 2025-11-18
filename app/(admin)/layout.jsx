"use client";
import { ToastContainer } from "react-toastify";
import RouteLoader from "../../components/layout/RouteLoader";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import LayoutProvider from "../../components/LayoutProvider";


export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen  ">
      <LayoutProvider>

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 mr-64 p-8   overflow-auto min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          {children}
        </main>
      </div>
      </LayoutProvider>

      <ToastContainer />

    </div>
  );
}
