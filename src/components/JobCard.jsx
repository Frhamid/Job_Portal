import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Trash2Icon, MapPinIcon, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { deleteJob, savedJobs } from "@/API/apijobs";
import { BarLoader } from "react-spinners";

export default function JobCard({
  job,
  isMyJob = false,
  fnJobs,
  saveInit = false,
  onJobSaved = () => {},
}) {
  const [saved, setSaved] = useState(saveInit);
  const [message, setMessage] = useState("");
  const timeoutRef = useRef(null);
  function onJobSaved2() {
    console.log("onJobSaved2", saved);
    if (timeoutRef.current) {
      setMessage("");
      clearTimeout(timeoutRef.current);
    }
    if (!saved) {
      console.log("inside save");
      setMessage("Job Saved");
    } else {
      console.log("inside else");
      setMessage("Job unsaved");
    }
    console.log("messagevalue", message);
    timeoutRef.current = setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  const {
    fn: fnSavedJob,
    data: SavedJob,
    loading: loadingSavedJob,
  } = useFetch(savedJobs, { alreadySaved: saved });

  const { user } = useUser();
  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobSaved();
    onJobSaved2();
  };

  useEffect(() => {
    // onJobSaved2();
    if (SavedJob !== undefined) setSaved(SavedJob?.length > 0);
  }, [SavedJob]);

  const {
    fn: fnDeleteJob,
    data: DeletedJob,
    loading: loadingDeleteJob,
  } = useFetch(deleteJob);

  useEffect(() => {
    if (DeletedJob) {
      fnJobs();
    }
  }, [DeletedJob]);

  const handleDelete = async () => {
    await fnDeleteJob(job.id, user.id);
  };

  return (
    <div>
      {message &&
        (saved ? (
          <div
            className={`absolute top-20 right-0 bg-green-100 text-green-800 px-3 py-1 rounded text-sm shadow-md`}
          >
            {message}
          </div>
        ) : (
          <div
            className={`absolute top-20 right-0 bg-red-100 text-red-800 px-3 py-1 rounded text-sm shadow-md`}
          >
            {message}
          </div>
        ))}
      <Card className="flex flex-col h-full">
        {loadingDeleteJob && (
          <BarLoader className="mb-4" width={"100%"} color="red" />
        )}
        <CardHeader>
          <CardTitle className="flex justify-between font-bold">
            {job.title}
            {isMyJob && (
              <Trash2Icon
                fill="white"
                size={18}
                className="text-white-300 cursor-pointer"
                onClick={handleDelete}
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1 ">
          <div className="flex justify-between">
            {job.company && <img src={job.company.logo_url} className="h-6" />}
            <div className="flex gap-2 items-center">
              <MapPinIcon size={15} />
              {job.location}
            </div>
          </div>
          <hr />
          {job.description.substring(0, job.description.indexOf("."))}
        </CardContent>
        <CardFooter className="gap-4">
          <Link to={`/job/${job.id}`} className="flex gap-1 w-full">
            <Button variant="secondary" className="w-full">
              More Details
            </Button>
          </Link>
          {!isMyJob && (
            <Button
              variant="outline"
              className="w-15"
              onClick={handleSaveJob}
              disabled={loadingSavedJob}
            >
              {saved ? (
                <Heart size={20} stroke="red" fill="red" />
              ) : (
                <Heart size={20} />
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
