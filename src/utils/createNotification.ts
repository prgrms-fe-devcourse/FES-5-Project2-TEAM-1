import supabase from "@/supabase/supabase"

export const createNotification = async (profileId:string,type:string,content:string) => {
  const { error } = await supabase.from('notification').insert([{
    user_id: profileId,
    type,
    content
  }])
  if(error) console.error(error)
}