import { prettyDate, titleCase } from "@/lib/formats";
import styles from "@/styles/postListItem.module.scss";
import Image from "next/image";
import Link from "next/link";
import Button from "./button";

export type PostProps = {
	_id: string;
	index: number;
	slug: string;
	id: string;
	title: string;
	subtitle?: string;
	categories: {
		term: string;
		slug: string;
	}[];
	summary: string;
	published_date: Date;
	imgUrl: string;
	content: string;
};

export type PostListProps = {
	post: PostProps;
	className?: string;
	style?: string;
};

function PostListItem({ post, className = "", style }: PostListProps) {
	return (
		<div className={`${styles.postListItem} ${className} ${style ? styles[style] : ""}`}>
			<div className={styles.wrapper}>
				<figure>
					<Image
						alt={titleCase(post.title) || ""}
						src={post.imgUrl || "/home-hero-3.jpg"}
						width={400}
						height={400}
						loading="lazy"
						// fill={true}
						// style={{ objectFit: "cover" }}
						// sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</figure>
				<div className={styles.contentWrapper}>
					{post.categories && (
						<ul>
							{post.categories.map((cat) => (
								<li key={cat.slug}>
									<span>{cat.term}</span>
									{/* <Link href={`/cat-${cat.slug}`}>{cat.term}</Link> */}
								</li>
							))}
						</ul>
					)}
					<h3>
						<Link href={`/blog/${post.slug}`}>{titleCase(post.title)}</Link>
					</h3>
					<p className={styles.summary}>{post.summary}</p>
					<p className={styles.date}>{prettyDate(post.published_date)}</p>
					<Button
						link={`/${post.slug}`}
						variant="inline"
						showIcon={true}>
						Read More
					</Button>
				</div>
			</div>
		</div>
	);
}

export default PostListItem;
