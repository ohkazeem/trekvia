import styles from "@/styles/footer.module.scss";
function Footer() {
	return (
		<footer className={styles.footer}>
			<p className="size-xs text-center">{`Copyright © Trekvia ${new Date().getFullYear()} | All Rights Reserved.`}</p>
		</footer>
	);
}

export default Footer;
