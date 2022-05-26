import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/doctor.css";
import "./style/template.css";
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
	<React.Fragment>
		<Provider store={store}>
			<App />
		</Provider>
	</React.Fragment>,
	document.getElementById("root")
);
