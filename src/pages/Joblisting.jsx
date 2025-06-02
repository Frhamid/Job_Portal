import React, { useEffect, useState } from "react";
import { getJobs } from "@/API/apijobs";
import { getCompanies } from "@/API/apicompanies";
import { useSession, useUser } from "@clerk/clerk-react";
import useFetch from "@/hooks/use-fetch";
import { data } from "autoprefixer";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";

export default function Joblisting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();
  const {
    fn: fnJobs,
    data: Jobs,
    loading: loadingJob,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  const { fn: fnCompanies, data: Companies } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, searchQuery, company_id]);

  function handleSearch(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  }

  function clearFilters() {
    setLocation("");
    setCompany_id("");
    setSearchQuery("");
    setSearchField("");
  }
  console.log("search query", searchQuery);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="red" />;
  }
  return (
    <div>
      <h1 className=" gradiet-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* adding filter */}

      <form
        onSubmit={handleSearch}
        className="h-14 flex w-full gap-2 items-center mb-3"
      >
        <Input
          type="text"
          onChange={(e) => setSearchField(e.target.value)}
          value={searchField}
          placeholder="Search Jobs by Title.."
          name="search-query"
          className="h-full flex-1 px-4 py-4 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
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

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
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
        <Button
          className="sm:w-1/2"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear FIlters
        </Button>
      </div>

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
