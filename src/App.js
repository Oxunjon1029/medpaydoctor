import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { TOKEN } from "./assets/constants";
import LayOut from "./comps/LayOut";
import ProtectedRoute from "./comps/ProtectedRoute";
import { routes } from "./data/routes";
import { getCookie } from "./functions/useCookies";
import LoginP from "./pages/LoginP";
import UserP from "./pages/UserP";

const App = () => {
  const token = getCookie(TOKEN);
  return (
    <Router>
      <Switch>
        <Route
          key={Math.random()}
          exact
          path="/"
          render={() => {
            return token ? (
              <Redirect to="/dashboard" />
            ) : (
              <Redirect to="/login" />
            );
          }}
        />
        <Route exact path="/login" component={LoginP} />
        <LayOut>
          <Route exact path="/user" component={UserP} />
          {routes.map((item, index) => (
            <ProtectedRoute
              key={index}
              path={item.route}
              exact
              component={item.page}
            />
          ))}
        </LayOut>
      </Switch>
    </Router>
  );
};

export default App;
