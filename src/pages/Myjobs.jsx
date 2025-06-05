import CreatedApplications from "@/components/CreatedApplications";
import CreatedJobs from "@/components/CreatedJobs";
import { useUser } from "@clerk/clerk-react";
import React from "react";

export default function Myjobs() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="red" />;
  }
  return (
    <div>
      <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl text-center">
        {user?.unsafeMetadata?.role === "Recruiter"
          ? "My Jobs"
          : "My Applications"}
      </h1>
      {user?.unsafeMetadata?.role === "Recruiter" ? (
        <CreatedJobs />
      ) : (
        <CreatedApplications />
      )}
    </div>
  );
}
