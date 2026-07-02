import styles from "@/styles/socialsList.module.scss";
import SocialMediaItem, { SocialItemProps } from "./socialMediaItem";

function SocialsList({ socials, align = "center" }: { socials: SocialItemProps[]; align?: "center" | "left" }) {
	return (
		<ul className={`${styles.socialsList} ${styles[align]}`}>
			{socials &&
				socials.map((social, idx) => (
					<SocialMediaItem
						socialItem={social}
						key={idx}
					/>
				))}
		</ul>
	);
}

export default SocialsList;
