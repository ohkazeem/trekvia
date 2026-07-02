import { PostProps } from "@/components/postListItem";
import { prettyDate, titleCase } from "@/lib/formats";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import styles from "@/styles/singlePostPage.module.scss";
import Button from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

function SinglePostPage({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	if (!post) return;

	return (
		<article className={styles.article}>
			<section className={styles.intro}>
				<div className={styles.wrapper}>
					<div className={styles.contentWrapper}>
						<ul>{post.categories && post.categories.map((cat, idx) => <li key={idx}>{cat}</li>)}</ul>
						<h1>{titleCase(post.title)}</h1>
						<p>{prettyDate(post.published_date)}</p>
					</div>
					<Button link={`/blog/post/${post.id}`}>
						<FontAwesomeIcon icon={faEdit} /> Edit
					</Button>

					<div className={styles.imageWrapper}>
						<Image
							alt={post.title}
							src={post.imgUrl.replace("http://192.168.1.131:3000", "")}
							fill
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 992px) 75vw,(max-width: 1025px) 50vw , 1920px"
						/>
					</div>
				</div>
			</section>
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
	const res = await fetch(`${process.env.NEXT_PUBLIC_FAKE_DATA_URL}/posts/${slug}`);

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
