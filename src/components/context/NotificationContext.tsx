import type { Tables } from "@/supabase/database.types";
import supabase from "@/supabase/supabase";
import { useToast } from "@/utils/useToast";
import { useEffect, useState, createContext} from "react";

type Notification = Tables<"notification">;

const NotificationContext = createContext<{
  alarms: Notification[];
  deleteAlarm: (id: string) => void;
} | null>(null);

export function NotificationProvider({
  children,
  profileId,
}: {
  children: React.ReactNode;
  profileId: string | null;
}) {
  const [alarms, setAlarms] = useState<Notification[]>([]);
  const { success } = useToast()
  useEffect(() => {
    if (!profileId) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchAndSubscribe = async () => {
      const { data } = await supabase
        .from("notification")
        .select("*")
        .eq("user_profile_id", profileId);
      if (data) setAlarms(data);

      channel = supabase
        .channel("notify-channel")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notification",
            filter: `user_profile_id=eq.${profileId}`,
          },
          (payload) => {
            if (payload.new.user_profile_id !== profileId) return;
            const newAlarm = payload.new as Notification;

            setAlarms((prev) => [...prev, newAlarm]);
            success(`${newAlarm.content}`)
          }
        )
        .subscribe();
    };

    fetchAndSubscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [profileId]);

  const deleteAlarm = async (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("notification").delete().eq("id", id);
  };

  return (
    <NotificationContext.Provider value={{ alarms, deleteAlarm }}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext