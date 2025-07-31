import supabase from "@/supabase/supabase"


  export const fetchData = async (targetId: string) => {
      const { error } = await supabase
        .from("user_profile")
        .select("*")
        .eq("profie_id", targetId);
      if (error) console.error(error);
    };
    
  

 
