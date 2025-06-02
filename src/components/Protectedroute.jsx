import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Protectedroute({ children }) {
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();
  const { pathname } = useLocation();
  if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
    return <Navigate to="/?sign-in=true" />;
  }

  if (
    user !== undefined &&
    !user?.unsafeMetadata?.role &&
    pathname !== "/onboarding"
  ) {
    console.log("inside protected route check", pathname);
    return <Navigate to="/onboarding" />;
  }

  useEffect(() => {
    if (user) {
      console.log("role:", user?.unsafeMetadata?.role);
      console.log("pathname:", pathname);
      if (user?.unsafeMetadata?.role == "Candidate" && pathname == "/postjob") {
        navigate("/joblisting");
      }
    }
  }, [pathname, user, navigate]);

  return children;
}
