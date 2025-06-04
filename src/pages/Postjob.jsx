import React, { useEffect } from "react";
import { addNewJob } from "@/API/apijobs";
import useFetch from "@/hooks/use-fetch";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { getCompanies } from "@/API/apicompanies";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirement: z.string().min(1, { message: "Requirements are required" }),
});

export default function Postjob() {
  const navigate = useNavigate();
  const { isLoaded, user } = useUser();
  const {
    fn: fnCompanies,
    error: errorAddJob,
    data: Companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirement: "",
    },
    resolver: zodResolver(schema),
  });
  const {
    loading: loadingaddJob,
    fn: fnaddJob,
    data: addJobData,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnaddJob({ ...data, recruitter_id: user.id, isOpen: true });
  };

  useEffect(() => {
    if (addJobData?.length > 0) navigate("/joblisting");
  }, [loadingaddJob]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="red" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        action=""
        className="flex flex-col gap-3 p-4 pb-0"
      >
        <Input
          className="pb-0"
          placeholder="Job Title"
          {...register("title")}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  {State.getStatesOfCountry("GB").map(({ name }) => {
                    return (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Company">
                    {field.value
                      ? Companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Companies?.map(({ name, id }) => {
                    return (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
          {/* add company drawer */}
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}
        <Controller
          name="requirement"
          control={control}
          render={({ field }) => (
            <MDEditor
              data-color-mode="dark"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.requirement && (
          <p className="text-red-500">{errors.requirement.message}</p>
        )}

        {errorAddJob?.message && (
          <p className="text-red-500">{errorAddJob?.message}</p>
        )}

        {loadingaddJob && (
          <BarLoader className="mb-4" width={"100%"} color="red" />
        )}

        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
}
