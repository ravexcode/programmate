//We use Supabase for SQL DataBase
import { createClient } from "@supabase/supabase-js";

//Function that checks if we have URL and ANON KEY
function getSupabaseData() {
  //If we have Supabase URL and ANON KEY we return success
  if(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return {
      "url": process.env.NEXT_PUBLIC_SUPABASE_URL,
      "key": process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    };
  }

  //Else we return error
  throw new Error("Supabase URL or Public Key not found");
}

//Create the supabase client
const supabase_client = createClient(
  getSupabaseData().url,
  getSupabaseData().key
);
//Exports the supabase client
export default supabase_client