import styles from "@/styles/header.module.scss";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeaderSearchForm from "./headerSearchForm";

type MenuProps = {
	title: string;
	slug: string;
	target: string;
	classes: string[];
};

function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [menu, setMenu] = useState<MenuProps[]>([]);

	useEffect(() => {
		const controller = new AbortController();
		async function getMenu() {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_FAKE_DATA_URL}/tr/v1/menu?name=trekvia-main-menu`, { signal: controller.signal });
				if (!res.ok) {
					console.error("Unable to fetch menu");
					return;
				}
				const data = await res.json();
				setMenu(data);
			} catch (err: unknown) {
				if (Error.isError(err)) {
					// Check if the error is an AbortError for unmounting the component
					if (err.name === "AbortError") {
						console.log("Fetch successfully canceled via cleanup.");
						return;
					}
					console.error("Fetch error:", err.message);
				} else {
					throw new Error("Unable to fetch data.");
				}
			}
		}
		getMenu();

		// unmount
		return function () {
			controller.abort();
		};
	}, []);

	const toggleMobileHeader = () => {
		setIsOpen(!isOpen);
	};

	const router = useRouter();
	return (
		<header className={styles.header}>
			<div className={styles.logoArea}>
				<div className={styles.wrapper}>
					<Link href="/">
						<Image
							src="/trekvia_logo.svg"
							alt="Trekvia Logo"
							width={315}
							height={58}
							priority
						/>
					</Link>
					<span className={styles.tagline}>Discovery . Adventure . Life</span>
				</div>
				<button
					aria-label="Toggle Mobile Navigation"
					className={styles.mobileToggler}
					onClick={toggleMobileHeader}
					aria-expanded={isOpen}>
					<span className={styles.btnLine}></span>
				</button>
			</div>
			<div className={`${styles.navigationArea} ${isOpen ? "" : styles.closedNav}`}>
				<div className={styles.wrapper}>
					<HeaderSearchForm className={styles.searchForm} />

					<nav className={styles.nav}>
						<div className={styles.wrapper}>
							<ul>
								{menu?.length > 0 &&
									menu.map((item, idx) => (
										<li key={idx}>
											<Link
												href={item.slug}
												className={router.pathname === item.slug ? "active" : ""}>
												<span>{item.title}</span>
											</Link>
										</li>
									))}
							</ul>
						</div>
					</nav>
				</div>
			</div>
		</header>
	);
}

export default Header;
