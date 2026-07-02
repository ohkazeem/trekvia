import { prettyDate, titleCase } from "@/lib/formats";
import styles from "@/styles/postListItem.module.scss";
import Image from "next/image";
import Link from "next/link";
import Button from "./button";

export type PostProps = {
	_id: string;
	index: number;
	guid: string;
	id: string;
	title: string;
	subtitle?: string;
	categories: string[];
	summary: string;
	published_date: Date;
	imgUrl: string;
};

export type PostListProps = {
	post: PostProps;
	className?: string;
};

function PostListItem({ post, className = "" }: PostListProps) {
	return (
		<div className={`${styles.postListItem} ${className}`}>
			<div className={styles.wrapper}>
				<figure>
					<Image
						alt={titleCase(post.title) || ""}
						src={post.imgUrl.replace("http://192.168.1.131:3000", "")}
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
							{post.categories.map((cat, idx) => (
								<li key={idx}>
									<Link href={`/cat-${cat}`}>{cat}</Link>
								</li>
							))}
						</ul>
					)}
					<h3>
						<Link href={`/blog/${post.guid}`}>{titleCase(post.title)}</Link>
					</h3>
					<p className={styles.summary}>{post.summary}</p>
					<p className={styles.date}>{prettyDate(post.published_date)}</p>
					<Button
						link={`/${post.guid}`}
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
