import { Routes, Route, Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Auth } from "../sections/Auth";
import { Dashboard } from "../sections/Dashboard";

// const roleBasedRouteAccess = (app_role: string) => {
//   switch (app_role) {
//     case "Admin":
//       return (
//         <>
//           <Route path="/hpad" element={<Chat />} />
//         </>
//       );
//     case "User":
//       return (
//         <>
//           <Route path="/hpad" element={<Chat />} />
//         </>
//       );
//     default:
//       return <Route path="/hpad" element={<Chat />} />;
//   }
// };

const Router = observer(() => {
//   const token = localStorage.getItem("__giftzaza__");
//   let user: any;
//   if (token) {
//     user = decodeToken(token);
//   }
//   const user_role = userStore.user?.user_role || user?.user_role;

  return (
    <Routes>
      <Route path={"/login"} element={<Auth />} />
      <Route path={"/"} element={<Dashboard />} />

      {/* <Route path="/forgot-password" element={<Login />} />
      <Route path="/reset-password" element={<Login />} />
      <Route path="/create-password/:token/:uui" element={<Login />} />
      <Route path="/404" element={<NotFound />} /> */}
      {/* <Route path="*" element={<Navigate to="/404" />} /> */}
      {/* <Route path="/hpad" element={<ProtectedRoute />}>
        {roleBasedRouteAccess(user_role)}
      </Route> */}
    </Routes>
  );
});

export default Router;
