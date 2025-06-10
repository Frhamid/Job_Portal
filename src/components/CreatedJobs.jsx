import { getMyJobs } from "@/API/apijobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";

export default function CreatedJobs() {
  const { user, isLoaded } = useUser();
  const {
    loading: loadingMyJobs,
    error: errorMyJobs,
    fn: fnMyJobs,
    data: dataMyJobs,
  } = useFetch(getMyJobs, { user_id: user?.id });

  useEffect(() => {
    fnMyJobs();
  }, []);

  if (loadingMyJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="red" />;
  }
  return (
    <div>
      {loadingMyJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataMyJobs?.length > 0 ? (
            dataMyJobs?.map((element, idx) => {
              return (
                <JobCard
                  key={element.id}
                  job={element}
                  saveInit={false}
                  isMyJob={true}
                  fnJobs={fnMyJobs}
                />
              );
            })
          ) : (
            <div>No Jobs Found</div>
          )}
        </div>
      )}
    </div>
  );
}
