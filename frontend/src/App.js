import React from "react";
import RoutesComp from "./routes";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <RoutesComp />
    </Provider>
  );
};

export default App;
