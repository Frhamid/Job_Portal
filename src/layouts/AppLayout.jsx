import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function AppLayout() {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen ">
        <Header />
        <div className="px-10 sm:px-20">
          <Outlet />
        </div>
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        All rights reserved
      </div>
    </div>
  );
}
