import UserProfile from "../views/UserProfile";

const adminRoutes = [
  {
    path: "/dashboard",
    name: "UserProfile",
    icon: "pe-7s-user",
    component: UserProfile
  },

  {
    redirect: true,
    path: "/",
    to: "/dashboard",
    name: "UserProfile"
  }
]

export default adminRoutes;