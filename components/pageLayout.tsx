import styles from "@/styles/pageLayout.module.scss";
import Head from "next/head";

type PageProps = {
	children: React.ReactNode | string;
	featuredImage?: string;
	layout?: "full" | "narrow";
	title?: string;
	metaDescription?: string;
};
function PageLayout({ children, layout = "full", title, metaDescription }: PageProps) {
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

			<article className={`${styles.layout} ${styles[layout]}`}>{children}</article>
		</>
	);
}

export default PageLayout;
