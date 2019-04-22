import Project from "../views/Project";
import Pomodoro from "../views/Pomodoro";
import Report from "../views/Report";

const userRoutes = [
  {
    path: "/dashboard",
    name: "Projects",
    icon: "pe-7s-network",
    component: Project
  },
  {
    path: "/pomodoro",
    name: "Pomodoro",
    icon: "pe-7s-timer",
    component: Pomodoro
  }, {
    path: "/report",
    name: "Report",
    icon: "pe-7s-note2",
    component: Report
  },
  {
    redirect: true,
    path: "/",
    to: "/dashboard",
    name: "Project"
  }
];

export default userRoutes;