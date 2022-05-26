import { IoMdCheckboxOutline, IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlinePieChart } from "react-icons/ai";
import { HiTemplate } from "react-icons/hi";

import BookingsP from "../pages/BookingsP";
import HomeP from "../pages/HomeP";
import TreatedP from "../pages/TreatedP";
import ReportsP from "../pages/ReportsP";
import TemplatesP from "../pages/TemplatesP";
import { ExceptionOutlined } from "@ant-design/icons";

export const routes = [
  {
    route: "/dashboard",
    name: `Dashboard`,
    page: HomeP,
    icon: <AiOutlinePieChart />,
  },
  {
    route: "/bookings",
    name: `Buyurtmalar`,
    page: BookingsP,
    icon: <IoMdNotificationsOutline />,
  },
  {
    route: "/finished",
    name: `Davolanganlar`,
    page: TreatedP,
    icon: <IoMdCheckboxOutline />,
  },
  {
    route: "/unfinished",
    name: `To'ldirilmaganlar`,
    page: ReportsP,
    icon: <ExceptionOutlined /> ,
  },
  {
    route: "/templates",
    name: `Shablonlar`,
    page: TemplatesP,
    icon: <HiTemplate />,
  },
];
