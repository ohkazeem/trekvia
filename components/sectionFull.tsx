import styles from "@/styles/sectionFull.module.scss";
function SectionFull({ children }: { children: React.ReactNode }) {
	return (
		<section className={styles.sectionFull}>
			<div className={styles.wrapper}>{children}</div>
		</section>
	);
}

export default SectionFull;
