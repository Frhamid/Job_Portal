import { Button } from "@/components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";
import Joblisting from "./pages/Joblisting";
import Jobs from "./pages/Jobs";
import Myjobs from "./pages/Myjobs";
import Postjob from "./pages/Postjob";
import Savedjob from "./pages/Savedjob";
import Protectedroute from "./components/Protectedroute";
import { ThemeProvider } from "./components/theme-provider";
import "./App.css";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: (
          <Protectedroute>
            <Onboarding />
          </Protectedroute>
        ),
      },
      {
        path: "/joblisting",
        element: (
          <Protectedroute>
            <Joblisting />
          </Protectedroute>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <Protectedroute>
            <Jobs />
          </Protectedroute>
        ),
      },
      {
        path: "/myjob",
        element: (
          <Protectedroute>
            <Myjobs />
          </Protectedroute>
        ),
      },
      {
        path: "/postjob",
        element: (
          <Protectedroute>
            <Postjob />
          </Protectedroute>
        ),
      },
      {
        path: "/savedjob",
        element: (
          <Protectedroute>
            <Savedjob />
          </Protectedroute>
        ),
      },
    ],
  },
]);
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
