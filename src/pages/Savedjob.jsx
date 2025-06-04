import { getSavedJobs } from "@/API/apijobs";
import JobCard from "@/components/JobCard";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";

export default function Savedjob() {
  const { user, isLoaded } = useUser();

  const {
    fn: fnAllSavedJobs,
    data: allSavedJobs,
    loading: loadingallSavedJob,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnAllSavedJobs(user.id);
    }
  }, [isLoaded]);

  console.log("savedallJobs", allSavedJobs);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="red" />;
  }
  return (
    <div>
      <h1 className=" gradiet-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        My Saved Jobs
      </h1>

      {loadingallSavedJob && (
        <BarLoader className="mb-4" width={"100%"} color="red" />
      )}

      {loadingallSavedJob === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSavedJobs?.length ? (
            allSavedJobs.map((element, idx) => {
              return (
                <JobCard
                  key={element.jobs.id}
                  job={element.jobs}
                  saveInit={true}
                  isMyJob={false}
                  fnJobs={fnAllSavedJobs}
                />
              );
            })
          ) : (
            <div>No Saved Jobs Found</div>
          )}
        </div>
      )}
    </div>
  );
}
