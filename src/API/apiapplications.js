import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) {
    console.error("Error Uploading Resume:", storageError);
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications_tl")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();
  if (error) {
    console.error("Error Submitting Application:", error);
    return null;
  }

  return data;
}

export async function updateApplications(
  token,
  { job_id, application_id },
  status
) {
  console.log("token", token);
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications_tl")
    .update({ status })
    .eq("job_id", job_id)
    .eq("id", application_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  console.log("token", token);
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications_tl")
    .select(
      `
    *,
    job:jobs (
      title,
      company:company_tl (
        name
      )
    )
  `
    )
    .eq("candidate_id", user_id);

  if (error || data.length === 0) {
    console.error("Error Fetching Job applications:", error);
    return null;
  }

  return data;
}
