import { PropsWithChildren } from "react";
import Header from "./Header";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className="xl:px-20 xl:py-12 md:px-16 md:py-8">
			<Header />
			{children}
		</div>
	);
}
