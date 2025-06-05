import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);

  let query = supabase.from("jobs").select(`
    *,
    company:company_tl (
      name,
      logo_url
    )
  ,saved:savedjobs_tl(id)`);

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching jobs:", error);
    return null;
  }
  return data;
}

export async function savedJobs(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("savedjobs_tl")
      .delete()
      .eq("job_id", saveData.job_id);
    if (deleteError) {
      console.error("Error Deleting Saved Jobs:", deleteError);
      return null;
    }

    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("savedjobs_tl")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error fetching jobs:", insertError);
      return null;
    }
    return data;
  }
}

export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
    *,
    company:company_tl (
      name,
      logo_url
    )
  ,applications_tl:applications_tl(*)`
    )
    .eq("id", job_id)
    .single();
  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();
  if (error) {
    console.error("Error Updating Job:", error);
    return null;
  }

  return data;
}

export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Error Creating Job:", error);
    return null;
  }

  return data;
}

export async function deleteJob(token, _, jobID, recruiter_id) {
  console.log("jobID", jobID);
  console.log("recruitterID", recruiter_id);
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .delete("*")
    .eq("id", jobID)
    .eq("recruitter_id", recruiter_id)
    .select();

  if (error) {
    console.error("Error deleting a Job:", error);
    return null;
  }

  return data;
}

export async function getSavedJobs(token, _, userID) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("savedjobs_tl")
    .select(
      `*,jobs:jobs (
      *,company:company_tl (
      name,
      logo_url
    )
    )`
    )
    .eq("user_id", userID);
  // .eq("id", jobID)
  // .eq("recruitter_id", recruiter_id)
  // .select();

  if (error) {
    console.error("Error fetching saved Jobs:", error);
    return null;
  }

  return data;
}

export async function getMyJobs(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
    *,
    company:company_tl (
      name,
      logo_url
    )
  `
    )
    .eq("recruitter_id", user_id);

  if (error) {
    console.error("Error fetching My Jobs:", error);
    return null;
  }

  return data;
}
