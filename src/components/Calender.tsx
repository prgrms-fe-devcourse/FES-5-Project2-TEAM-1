import Calendar from "react-calendar";
import C from "./Calender.module.css";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import type { CalendarProps } from "react-calendar";
import supabase from "@/supabase/supabase";
import { useParams } from "react-router-dom";

interface Props {
  isHidden: boolean;
  callBack: (date: string) => void;
  shouldFetch: boolean
}

function Calender({ isHidden, callBack,shouldFetch}: Props) {
  const { id } = useParams()
  const [hidden, setHidden] = useState(isHidden);
  const [range, setRange] = useState<[Date, Date] | null>(null);

  useEffect(() => {
    if (!shouldFetch ) return
        const fetchData = async () => {
          const { data } = await supabase
            .from("board")
            .select("start_date, deadline")
            .eq("board_id", id)
            .single();

          if (data?.start_date && data?.deadline) {
            const start = new Date(data.start_date);
            const end = new Date(data.deadline);
            setRange([start, end]);
          }
        };

        fetchData();
  }, [id,shouldFetch]);


  const handleChange: CalendarProps["onChange"] = async (value) => {
    if (Array.isArray(value)) {
      const [start, end] = value;
      if (start && end) {
        setRange([start, end]);
        setHidden(true);
        callBack(
          `${format(start, "yyyy-MM-dd")} ~ ${format(end, "yyyy-MM-dd")}`
        );

        await supabase
          .from("board")
          .update({
            start_date: start,
            deadline: end,
          })
          .eq("board_id", id);
      }
      return;
    }

    if (value instanceof Date) {
      setRange([value, value]);
      setHidden(true);
      callBack(format(value, "yyyy-MM-dd"));

      await supabase
        .from("board")
        .update({
          start_date: value,
          deadline: value,
        })
        .eq("board_id", id);
    }
  };

    const handleClick = () => {
      setHidden(false);
    };

    const handleCancel = () => {
      setRange(null)
      setHidden(true)
      callBack('')
    }
    const handleEdit = () => {
      setHidden(false);
      setRange(null);
    }

    return (
      <div className={C.wrapper}>
        {hidden ? (
          range ? (
            <div className={C.edit}>
              <span className={C.dateText}>
                {`${format(range[0], "yyyy-MM-dd")} ~ ${format(
                  range[1],
                  "yyyy-MM-dd"
                )}`}
              </span>
              <button type="button" className={C.editBtn} onClick={handleEdit}>수정</button>
            </div>
          ) : (
            <button type="button" className={C.calendarBtn} onClick={handleClick}>
              날짜선택
            </button>
          )
        ) : (
          <button type="button" className={C.cancleBtn} onClick={handleCancel}>
            선택취소
          </button>
        )}
        {!hidden && (
          <div className={C.container}>
            <Calendar
              onChange={handleChange}
              value={range ?? undefined}
              selectRange
              calendarType="gregory"
              formatDay={(_, date) => String(date.getDate())}
              tileClassName={({ date, view }) => {
                if (view !== "month") return "";
                const day = date.getDay();
                if (day === 0) return "calendar-sunday";
                if (day === 6) return "calendar-saturday";
                return "";
              }}
            />
          </div>
        )}
      </div>
    );
  }
export default Calender;
