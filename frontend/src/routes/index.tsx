import { Routes, Route, Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Auth } from "../sections/Auth";
import { Dashboard } from "../sections/Dashboard";
import ProtectedRoute from "../utils/ProtectedRoute";
import { userStore } from "../store/UserStore";
import { decodeToken } from "../utils/shared/DecodeToken";
import { NotFound } from "../sections/NotFound";

const roleBasedRouteAccess = (app_role: string) => {
  switch (app_role) {
    case "Admin":
      return (
        <>
          <Route path="/" element={<Dashboard />} />
        </>
      );
    case "User":
      return (
        <>
          <Route path="/" element={<Dashboard />} />
        </>
      );
    default:
      return <Route path="/" element={<Dashboard />} />;
  }
};

const Router = observer(() => {
  const token = localStorage.getItem("__giftzaza__");
  let user: any;
  if (token) {
    user = decodeToken(token);
  }
  const user_role = userStore.user?.role || user?.user?.role;

  return (
    <Routes>
      <Route path={"/login"} element={<Auth />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" />} />
      <Route path="/" element={<ProtectedRoute />}>
        {roleBasedRouteAccess(user_role)}
      </Route>
    </Routes>
  );
});

export default Router;
