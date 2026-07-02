import styles from "@/styles/socialMediaItem.module.scss";
import { faYoutube, faMedium, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";

export type SocialItemProps = {
	name: "YouTube" | "Medium" | "Instagram";
	url: string;
};

const getIcon = (name: string): IconProp => {
	if (name === "YouTube") return faYoutube;
	if (name === "Medium") return faMedium;
	if (name === "Instagram") return faInstagram;
	return faYoutube;
};

function SocialMediaItem({ socialItem }: { socialItem: SocialItemProps }) {
	return (
		<li className={styles.socialItem}>
			<Link href={socialItem.url}>
				<span>{socialItem.name}</span>
				<FontAwesomeIcon
					icon={getIcon(socialItem.name)}
					size="xl"
					color="currentColor"
				/>
			</Link>
		</li>
	);
}

export default SocialMediaItem;
