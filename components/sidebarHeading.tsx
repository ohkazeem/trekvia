import styles from "@/styles/sidebarHeading.module.scss";
type Props = {
	children: string | React.ReactNode;
};
function SidebarHeading({ children }: Props) {
	return (
		<div className={styles.heading}>
			<h3>{children}</h3>
		</div>
	);
}

export default SidebarHeading;
