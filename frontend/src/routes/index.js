import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routeslist } from "../utilities/RoutesList";

const RoutesComp = () => {
  return (
    <div>
      <Router>
        <Routes>
          {routeslist.map((route, index) => {
            return (
              <Route
                key={index}
                path={route?.path}
                component={route?.component}
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
};

export default RoutesComp;
