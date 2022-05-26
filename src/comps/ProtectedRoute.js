import React from "react";
import { Redirect, Route } from "react-router-dom";
import { TOKEN } from "../assets/constants";
import { getCookie } from "../functions/useCookies";
import NotFound from "../pages/NotFound";

const ProtectedRoute = ({ component, path }) => {
  const token = getCookie(TOKEN);
  return token ? (
    <Route key={Math.random()} exact component={component} path={path} />
  ) : (
    <Redirect key={Math.random()} component={NotFound} />
  );
};

export default ProtectedRoute;
