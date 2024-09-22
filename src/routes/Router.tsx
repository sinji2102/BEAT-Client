import Layout from "@components/layout/Layout";
import AdminLayout from "@components/layout/AdminLayout";
import Intro from "@pages/intro/Intro";
import KakaoAuth from "@pages/kakaoAuth/KakaoAuth";
import Main from "@pages/main/Main";
import NotFound from "@pages/notFound/NotFound";
import OnBoarding from "@pages/onBoarding/OnBoarding";
import { GIG_ROUTES, LOOKUP_ROUTES, MANAGE_ROUTES, REGISTER_ROUTES, TEST_ROUTES } from "@routes";
import { createBrowserRouter } from "react-router-dom";
import ADMIN_ROUTES from "./AdminRoutes";
import Promotion from "@admin/pages/promotion/Promotion";
import Admin from "@admin/pages/admin/Admin";
import DesktopGlobalStyle from "@styles/desktop";

const router = createBrowserRouter([
  {
    path: "/main",
    element: (
      <>
        {/* <TokenRefresher /> */}
        <Main />
      </>
    ),
  },
  { path: "/intro", element: <Intro /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <OnBoarding /> },
      ...GIG_ROUTES,
      ...LOOKUP_ROUTES,
      ...MANAGE_ROUTES,
      ...REGISTER_ROUTES,
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/auth",
    element: <KakaoAuth />,
  },
  {
    path: "/admin",
    element: (
      <>
        <DesktopGlobalStyle />
        <AdminLayout />
      </>
    ),
    children: [{ path: "", element: <Admin /> }, ...ADMIN_ROUTES],
  },
  ...TEST_ROUTES,
]);

export default router;
