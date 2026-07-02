import styles from "@/styles/sidebar.module.scss";
import SidebarHeading from "@/components/sidebarHeading";
import Image from "next/image";
import Button from "./button";
import SocialsList from "./socialsList";
import { SocialItemProps } from "./socialMediaItem";
import MailchimpNewsletterForm from "./mailchimpNewsletterForm";
import { useEffect, useState } from "react";
import PostListItem, { PostProps } from "./postListItem";

const socialMediaLists: SocialItemProps[] = [
	{
		name: "YouTube",
		url: "https://youtube.com/xxx",
	},
	{
		name: "Medium",
		url: "https://medium.com/xxx",
	},
	{
		name: "Instagram",
		url: "https://instagram.com/xxx",
	},
];

function Sidebar() {
	const [recentPosts, setRecentPosts] = useState<PostProps[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		const controller = new AbortController();
		async function getRecentPosts() {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_FAKE_DATA_URL}/tr/v1/posts`, { signal: controller.signal });

				if (!res.ok) {
					setErrorMessage("Unable to fetch posts currently.");
					return;
				}
				const data = await res.json();

				const sortedPosts = data.posts.sort((a: PostProps, b: PostProps) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime()).slice(0, 3);
				setRecentPosts(sortedPosts);
			} catch (err: unknown) {
				if (Error.isError(err)) {
					// Check if the error is an AbortError for unmounting the component
					if (err.name === "AbortError") {
						console.log("Fetch successfully canceled via cleanup.");
						return;
					}
					console.error("Fetch error:", err.message);
					setErrorMessage("Unable to fetch posts currently.");
				} else {
					setErrorMessage("Unable to fetch posts currently.");
					throw new Error("Unable to fetch data.");
				}
			}
		}

		getRecentPosts();

		// unmount
		return function () {
			controller.abort();
		};
	}, []);

	return (
		<div className={styles.sidebar}>
			<div className={styles.wrapper}>
				<SidebarHeading>Welcome!</SidebarHeading>
				<Image
					alt="About me"
					src={"/home-hero-4.jpg"}
					width={338}
					height={200}
				/>
				<p className="text-center size-xs mt-2xs">{`I'm a web developer by day, and content creator at night (or any time of the day.)`}</p>
				<div className="text-center mt-2xs">
					<Button
						link="/about"
						variant="inline"
						showIcon={true}>
						Read More
					</Button>
				</div>
				<SidebarHeading>Social Links</SidebarHeading>
				<SocialsList socials={socialMediaLists} />
				<SidebarHeading>Subscribe</SidebarHeading>
				<MailchimpNewsletterForm formClass={styles.form} />
				<SidebarHeading>Recent Posts</SidebarHeading>
				{recentPosts.length > 0 && (
					<ul>
						{recentPosts.map((post) => (
							<PostListItem
								post={post}
								key={post.id}
								className={"sidebarPostListItem"}
							/>
						))}
					</ul>
				)}
				{recentPosts.length > 0 && <p className="text-center">{errorMessage}</p>}
			</div>
		</div>
	);
}

export default Sidebar;
