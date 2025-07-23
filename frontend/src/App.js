import React from "react";
import RoutesComp from "./routes";
import { Provider } from "react-redux";
import {store} from "./redux/store";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RoutesComp />
      </AuthProvider>
    </Provider>
  );
};

export default App;
