import { PropsWithChildren } from "react";
import Header from "./Header";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className="px-20 pt-12">
			<Header />
			{children}
		</div>
	);
}
