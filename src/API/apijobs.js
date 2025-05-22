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
