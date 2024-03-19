import { Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from '../sections/Auth';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { userStore } from '../store/UserStore';
import { decodeToken } from '../utils/decodeToken';
import { NotFound } from '../sections/NotFound';
import { roleEnum } from '../constants/types';
import { AdminProducts } from '../sections/Administration/AdminProducts';
import { Onboarding } from '../sections/Onboarding';
import { Products } from '../sections/Products';
import { observer } from 'mobx-react-lite';
import { Profiles } from '../sections/Profiles';
import { CreateProfile } from '../sections/Profiles/CreateProfile';
import { User } from '../sections/User';
import { Shopping } from '../sections/Shopping';
import { Suspense } from 'react';
import { Loader } from '../components/shared/Loader';
import { ErrorBoundary } from 'react-error-boundary';
import { Saved } from '../sections/Saved';

const roleBasedRouteAccess = (app_role: roleEnum) => {
  // Routes for both admin and user
  const commonRoutes = (
    <>
      <Route path="/" element={<CreateProfile />} />
      <Route path="/welcome" element={<Onboarding />} />
      <Route path="/profiles" element={<Profiles />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/profiles/:profileId" element={<Products />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/user" element={<User />} />
      <Route path="/shopping" element={<Shopping />} />
    </>
  );

  // Admin specific routes
  const adminRoutes = (
    <>
      <Route
        path="/admin/*"
        element={
          <Routes>
            <Route path="/" element={<AdminProducts />} />
          </Routes>
        }
      />
    </>
  );

  if (app_role === roleEnum.ADMIN) {
    return (
      <>
        {commonRoutes}
        {adminRoutes}
      </>
    );
  } else if (app_role === roleEnum.USER) {
    return <>{commonRoutes}</>;
  } else {
    return <Route path="/*" element={<Auth />} />;
  }
};

const Router = observer(() => {
  const token = localStorage.getItem('__giftzaza__');
  let user: any;
  if (token) {
    user = decodeToken(token);
  }
  const user_role = userStore.user?.role || user?.user?.role;

  return (
    <ErrorBoundary
      onReset={() => {
        window.location.href = window.location.href;
      }}
      FallbackComponent={CreateProfile}
    >
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path={'/login'} element={<Auth />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/" element={<ProtectedRoute />}>
            {roleBasedRouteAccess(user_role)}
          </Route>
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
});

export default Router;
