import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import MenuProvider from "./context/MenuContext";
import { ModalProvider, Modal } from "./context/Modal";
import FinanceAPIProvider from "./context/FinanceApiContext";
import configureStore from "./store";
import * as sessionActions from "./store/session";
import * as portfolioActions from "./store/portfolio";
import App from "./App";
import "./index.css";


const store = configureStore();

if (process.env.NODE_ENV !== "production") {
	window.store = store;
	window.sessionActions = sessionActions;
	window.portfolioActions = portfolioActions;
}

// Wrap the application with the Modal provider and render the Modal component
// after the App component so that all the Modal content will be layered as
// HTML elements on top of the all the other HTML elements:
function Root() {
	return (
		<ModalProvider>
			<Provider store={store}>
				<FinanceAPIProvider>
					<MenuProvider>
					<BrowserRouter>
						<App />
						<Modal />
					</BrowserRouter>
					</MenuProvider>
				</FinanceAPIProvider>
			</Provider>
		</ModalProvider>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Root />
	</React.StrictMode>,
	document.getElementById("root")
);
