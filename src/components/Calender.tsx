import Calendar from "react-calendar";
import C from "./Calender.module.css";
import { format } from "date-fns";
import { useState } from "react";
import type { CalendarProps } from "react-calendar";

interface Props {
  isHidden: boolean;
  callBack: (date: string) => void;
}

function Calender({ isHidden, callBack }: Props) {
  const [date, setDate] = useState<Date | null>(null);
  const [hidden, setHidden] = useState(isHidden);

  const handleChange: CalendarProps["onChange"] = (value) => {
    const selectDate = Array.isArray(value) ? value[0] : value;
    setDate(selectDate);
    setHidden(true);
    if (selectDate) {
      callBack(format(selectDate, "yyyy-MM-dd"));
    }
  };
  const handleClick = () => {
    setHidden(false);
  };

  return (
    <>
      {hidden && (
        <div className={C.default}>
          <input
            type="text"
            placeholder="날짜 선택"
            onClick={handleClick}
            defaultValue={!date ? "" : format(date, "yyyy-MM-dd")}
          />
        </div>
      )}
      {!hidden && (
        <div className={C.container}>
          <Calendar onChange={handleChange} value={date} />
        </div>
      )}
    </>
  );
}
export default Calender;
