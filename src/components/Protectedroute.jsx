import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Protectedroute({ children }) {
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();
  const { pathname } = useLocation();

  // Don't render anything until Clerk has loaded
  if (!isLoaded) return null;

  // Redirect to sign-in page if not signed in
  if (!isSignedIn) {
    return <Navigate to="/?sign-in=true" />;
  }

  // Redirect to onboarding if role is not yet assigned
  if (!user?.unsafeMetadata?.role && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }

  const role = user?.unsafeMetadata?.role;

  // Block invalid role-based access immediately
  if (
    (role === "Candidate" && pathname === "/postjob") ||
    (role === "Recruiter" && pathname === "/savedjob")
  ) {
    return <Navigate to="/joblisting" />;
  }

  return children;
}
