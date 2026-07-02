import styles from "@/styles/pageLayout.module.scss";
import Head from "next/head";
import Image from "next/image";

type PageProps = {
	children: React.ReactNode | string;
	featuredImage?: string;
	layout?: "full" | "narrow";
	title?: string;
	metaDescription?: string;
};
function PageLayout({ children, layout = "full", title, metaDescription, featuredImage }: PageProps) {
	return (
		<>
			{title && (
				<Head>
					<title>{`${title} | Trekvia`}</title>
					{metaDescription && (
						<meta
							name="description"
							content={metaDescription}
						/>
					)}
				</Head>
			)}
			{/* <Image
				alt={title || ""}
				src={featuredImage?.replace("http://192.168.1.131:3000", "") || ""}
				width={400}
				height={400}
				preload={true}
			/> */}
			<article className={`${styles.layout} ${styles[layout]}`}>{children}</article>
		</>
	);
}

export default PageLayout;
