import styles from "@/styles/sectionSplit.module.scss";
import Image from "next/image";

type SectionProps = {
	children: React.ReactNode | string;
	image?: string;
	title?: string;
};

function SectionSplit({ children, image, title }: SectionProps) {
	return (
		<section className={styles.splitSection}>
			<div className={styles.wrapper}>
				<div className={styles.contentWrapper}>{children}</div>
				<figure className={styles.imageWrapper}>
					<Image
						alt={title || ""}
						src={image?.replace("http://192.168.1.131:3000", "") || ""}
						fill={true}
						preload={true}
						style={{ objectFit: "cover" }}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</figure>
			</div>
		</section>
	);
}

export default SectionSplit;
