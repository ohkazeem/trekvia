import styles from "@/styles/header.module.scss";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useState } from "react";

function Header() {
	const [isOpen, setIsOpen] = useState(false);

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
					<form className={styles.searchForm}>
						<button
							type="submit"
							aria-label="Submit Search">
							<FontAwesomeIcon
								icon={faMagnifyingGlass}
								color="#FFFFFF"
								size="xs"
							/>
						</button>
						<input
							type="search"
							placeholder="Search"
						/>
					</form>

					<nav className={styles.nav}>
						<div className={styles.wrapper}>
							<ul>
								<li>
									<Link
										href="/"
										className={router.pathname === "/" ? "active" : ""}>
										<span>Home</span>
									</Link>
								</li>
								<li>
									<Link
										href="/about"
										className={router.pathname === "/about" ? "active" : ""}>
										<span>About</span>
									</Link>
								</li>
								<li>
									<Link
										href="/life-in-lagos"
										className={router.pathname === "/life-in-lagos" ? "active" : ""}>
										<span>Life in Lagos</span>
									</Link>
								</li>
								<li>
									<Link
										href="/business"
										className={router.pathname === "/business" ? "active" : ""}>
										<span>Business</span>
									</Link>
								</li>
								<li>
									<Link
										href="/contact"
										className={router.pathname === "/contact" ? "active" : ""}>
										<span>Contact</span>
									</Link>
								</li>
							</ul>
						</div>
					</nav>
				</div>
			</div>
		</header>
	);
}

export default Header;
