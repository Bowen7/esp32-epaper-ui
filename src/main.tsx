import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "jotai";
import { ThemeProvider } from "@/components/theme-provider";
import App from "./App.tsx";
import { store } from "./lib/atom.ts";
import "@/styles/globals.css";

const THEME_STORAGE_KEY = "epaper-ui-theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider defaultTheme="light" storageKey={THEME_STORAGE_KEY}>
				<App />
			</ThemeProvider>
		</Provider>
	</React.StrictMode>,
);
