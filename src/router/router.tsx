import StudyChannel from "@/pages/Study/StudyChannel";
import StudyJoinInfomation from "@/pages/Study/StudyJoinInfomation";

export const routes = [
  {
    title: "스터디채널",
    path: "/StudyChannel",
    element: <StudyChannel />,
  },
  {
    title: "가입정보페이지",
    path: "/JoinInfo/:id",
    element: <StudyJoinInfomation />,
  },
];
