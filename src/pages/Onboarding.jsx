import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function Onboarding() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const handleRoleSelection = async (role) => {
    await user
      .update({
        unsafeMetadata: { role },
      })
      .then(() => {
        navigate(role === "Recruiter" ? "/postjob" : "/joblisting");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    console.log("loaded", isLoaded);
    if (user?.unsafeMetadata.role) {
      navigate(
        User?.unsafeMetadata?.role === "Recruiter" ? "/postjob" : "/jobs"
      );
    }
  }, [user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="red" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a ....
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          variant="blue"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("Candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("Recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
}
