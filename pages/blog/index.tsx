import styles from "@/styles/blogPage.module.scss";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import PostListItem, { PostProps } from "@/components/postListItem";
import Button from "@/components/button";
function BlogPage({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<>
			<section className={styles.article}>
				<div>
					<div className="text-center">
						<h1>Blog</h1>
					</div>
				</div>
			</section>
			<section className={styles.gridWrapper}>
				<div className={styles.wrapper}>
					<div>
						<div className={styles.postsList}>
							{posts.length > 0 &&
								posts.map((post) => (
									<PostListItem
										post={post}
										key={post.id}
										style="grid"
									/>
								))}
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default BlogPage;

type Props = {
	posts: PostProps[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const FAKE_DATA_URL = process.env.NEXT_PUBLIC_FAKE_DATA_URL;
	let posts = [];
	try {
		const resForPosts = await fetch(`${FAKE_DATA_URL}/tr/v1/posts`);

		if (resForPosts.ok) {
			const postsData = await resForPosts.json();
			posts = await postsData.posts;
		}

		return { props: { posts: posts } };
	} catch (err) {
		console.log(err);
		return { props: { posts: [] } };
	}
};
