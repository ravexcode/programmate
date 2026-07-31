//We use Supabase for SQL DataBase
import { createClient } from "@supabase/supabase-js";

//Function that checks if we have URL and ANON KEY
function getSupabaseData() {
  //If we have Supabase URL and ANON KEY we return success
  if(process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    return {
      "url": process.env.SUPABASE_URL,
      "key": process.env.SUPABASE_KEY
    };
  }

  //Else we return error
  throw new Error("Supabase URL or ANON Key not found");
}

//Create the supabase client
const supabase = createClient(
  getSupabaseData().url,
  getSupabaseData().key
);
//Exports the supabase client
export default supabase