import React, { useEffect, useState } from "react";
import { getJobs } from "@/API/apijobs";
import { useSession, useUser } from "@clerk/clerk-react";
import useFetch from "@/hooks/use-fetch";
import { data } from "autoprefixer";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/JobCard";

export default function Joblisting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } = useUser();
  const {
    fn: fnJobs,
    data: Jobs,
    loading: loadingJob,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  console.log("data", Jobs);

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, searchQuery, company_id]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="red" />;
  }
  return (
    <div>
      <h1 className=" gradiet-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* adding filter */}

      {loadingJob && <BarLoader className="mb-4" width={"100%"} color="red" />}

      {loadingJob === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Jobs?.length ? (
            Jobs.map((element, idx) => {
              return (
                <JobCard
                  key={element.id}
                  job={element}
                  saveInit={element?.saved?.length > 0}
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
