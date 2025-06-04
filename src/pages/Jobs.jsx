import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { getSingleJob } from "@/API/apijobs";
import { BarLoader } from "react-spinners";
import { MapPinIcon, Briefcase, DoorOpen, DoorClosed } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { updateHiringStatus } from "@/API/apijobs";
import ApplicationCard from "@/components/ApplicationCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyToJob } from "@/API/apiapplications";
import ApplyJobDrawer from "@/components/ApplyJobDrawer";

export default function Jobs() {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    Loading: loadingJob,
    data: jobData,
    fn: fnJob,
  } = useFetch(getSingleJob, { job_id: id });

  const { Loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    { job_id: id }
  );

  const handleStatus = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  console.log("job data", jobData);
  console.log("Check for status ", jobData?.recruiter_id === user?.id);
  console.log(jobData?.recruitter_id, "===", user?.id);

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="red" />;
  }
  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className=" flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {jobData?.title}
        </h1>
        <img
          src={jobData?.company?.logo_url}
          className="h-12"
          alt={jobData?.title}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {jobData?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase />
          {jobData?.applications_tl?.length} Applicants
        </div>
        <div className="flex gap-2">
          {jobData?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>
      {/* hiring satatus */}
      {loadingHiringStatus && (
        <BarLoader className="mb-4" width={"100%"} color="red" />
      )}

      {jobData?.recruitter_id === user?.id && (
        <Select onValueChange={handleStatus}>
          <SelectTrigger
            className={`w-full ${
              jobData?.isOpen ? "bg-green-950" : "bg-red-950"
            }`}
          >
            <SelectValue
              placeholder={
                "Hiring Status" + (jobData?.isOpen ? "(Open)" : "(Closed)")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold">About the Jobs</h2>
      <p className="sm:text-lg">{jobData?.description}</p>
      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={jobData?.requirement}
        className="bg-transparent sm:text-lg"
      />
      {/* renderApplications */}

      {jobData?.recruitter_id !== user?.id &&
        user?.unsafeMetadata?.role === "Candidate" && (
          <ApplyJobDrawer
            job={jobData}
            user={user}
            fetchJob={fnJob}
            applied={jobData?.applications_tl.find(
              (ap) => ap?.candidate_id === user?.id
            )}
          />
        )}

      {jobData?.applications_tl.length > 0 &&
        jobData?.recruitter_id === user?.id &&
        user?.unsafeMetadata?.role === "Recruiter" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
            {jobData?.applications_tl?.map((application) => {
              return (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              );
            })}
          </div>
        )}
    </div>
  );
}
