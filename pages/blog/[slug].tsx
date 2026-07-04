import { PostProps } from "@/components/postListItem";
import { prettyDate, titleCase } from "@/lib/formats";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import styles from "@/styles/singlePostPage.module.scss";
import Button from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";

function SinglePostPage({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	if (!post) return;

	return (
		<article className={styles.article}>
			<section className={styles.intro}>
				<div className={styles.wrapper}>
					<div className={styles.contentWrapper}>
						<ul>{post.categories && post.categories.map((cat) => <li key={cat.slug}>{cat.term}</li>)}</ul>
						<h1>{titleCase(post.title)}</h1>
						<p>{prettyDate(post.published_date)}</p>
					</div>
					{/* <Button link={`/blog/post/${post.slug}`}>
						<FontAwesomeIcon icon={faEdit} /> Edit
					</Button> */}
				</div>
				<div className={styles.imageWrapper}>
					<Image
						alt={post.title}
						src={post.imgUrl || "/home-hero-3.jpg"}
						fill
						priority
						sizes="(max-width: 768px) 100vw, (max-width: 992px) 75vw,(max-width: 1025px) 50vw , 1920px"
					/>
				</div>
			</section>

			<div className={`${styles.contentWrapper} `}>
				<div className={styles.wrapper}>
					<div
						dangerouslySetInnerHTML={{
							__html: sanitizeHtml(post?.content, {
								allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
							}),
						}}></div>
				</div>
			</div>
		</article>
	);
}

export default SinglePostPage;

type ParamsProps = {
	slug: string;
};

export const getServerSideProps: GetServerSideProps<{ post: PostProps }, ParamsProps> = async ({ params }) => {
	const slug = params?.slug;

	// Fetch the post data based on the slug
	const res = await fetch(`${process.env.NEXT_PUBLIC_FAKE_DATA_URL}/tr/v1/posts/${slug}`);

	if (!res.ok) {
		return {
			notFound: true,
		};
	}
	const postData = await res.json();

	return {
		props: {
			post: postData,
		},
	};
};
