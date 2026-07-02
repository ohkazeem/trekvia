import styles from "@/styles/button.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

type DefaultButtonProps = {
	children: React.ReactNode | string;
	icon?: IconProp;
	showIcon?: boolean;
	variant?: "primary" | "secondary" | "inline";
	action?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
};

type RegularType = DefaultButtonProps & {
	type: "button";
	link?: string;
};

type LinkType = DefaultButtonProps & {
	type?: "link";
	link: string;
};

type ButtonProps = RegularType | LinkType;

function Button({ type, link, children, disabled, variant = "primary", icon = faArrowRightLong, showIcon = false, action }: ButtonProps) {
	if (type === "button") {
		return (
			<button
				disabled={disabled}
				className={`${styles.btn} ${styles[variant]}`}
				onClick={action}>
				{children}
			</button>
		);
	}
	return (
		<Link
			href={link}
			className={`btn ${styles.btn} ${styles[variant]}`}>
			{children}
			{showIcon && (
				<FontAwesomeIcon
					icon={icon}
					color="currentColor"
					size={"xs"}
				/>
			)}
		</Link>
	);
}

export default Button;
