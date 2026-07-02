import Footer from "@/components/footer";
import Header from "@/components/header";
import "@/styles/variables.scss";
import "@/styles/reset.scss";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";

// Adding Font Awesome
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Head from "next/head";
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Enjoy the Journey | Trekvia</title>
				<meta
					name="description"
					content="Discovery. Adventure. Life"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link
					rel="icon"
					href="/favicon.ico"
				/>
			</Head>
			<Header />
			<main>
				<Component {...pageProps} />
			</main>
			<Footer />
		</>
	);
}
