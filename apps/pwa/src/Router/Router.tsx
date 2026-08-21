import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";

import { useAuth } from "@Services";

import { SplashScreen, HomeScreen, LoginScreen } from "@Screens";

const RequireAuth = () => {
  const { session } = useAuth();

  return session ? <Outlet /> : <Navigate to="/" replace />;
};

export const Router = () => {
  const { session } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={session ? <HomeScreen /> : <SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route element={<RequireAuth />}>
          <Route path="*" element={<HomeScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
