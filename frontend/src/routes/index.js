import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { routeslist } from "../utilities/RoutesList";
import { Header, Sidebar } from "../components";
import { useAuth } from "../context/AuthContext";
import s from "./routes.module.scss";

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Login sayfasında layout gösterme
  if (location.pathname === '/login') {
    return children;
  }

  // Kullanıcı giriş yapmamışsa layout gösterme
  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className={s.layout}>
      <Sidebar />
      <div className={s.mainContent}>
        <Header />
        <main className={s.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

const RoutesComp = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {routeslist.map((route, index) => {
            return (
              <Route
                key={index}
                path={route?.path}
                element={route?.element}
              />
            );
          })}
        </Routes>
      </Layout>
    </Router>
  );
};

export default RoutesComp;
