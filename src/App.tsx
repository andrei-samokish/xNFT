import React from "react";
import logo from "./logo.svg";
import Layout from "./components/Layout";
import Header from "./components/Header";
import Main from "./components/Main";
import FunctionalBar from "./components/FunctionalBar";
import ProgressBar from "./components/ProgressBar";

function App() {
	return (
		<Layout>
			<Main />
			<FunctionalBar />
			<ProgressBar stage="full" />
		</Layout>
	);
}

export default App;
