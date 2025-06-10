import React, { useEffect } from "react";
import { getApplications } from "@/API/apiapplications";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";

export default function CreatedApplications() {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingApplications,
    error: errorGetApplication,
    fn: fngetApplications,
    data: dataApplications,
  } = useFetch(getApplications, { user_id: user.id });

  useEffect(() => {
    fngetApplications();
  }, []);

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="red" />;
  }
  return (
    <div className="flex flex-col gap-2 mt-8">
      {dataApplications?.length > 0 ? (
        dataApplications?.map((application) => {
          return (
            <ApplicationCard
              key={application.id}
              application={application}
              isCandidate={true}
            />
          );
        })
      ) : (
        <p>No applications found</p>
      )}
    </div>
  );
}
