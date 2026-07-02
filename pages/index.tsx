import styles from "@/styles/home.module.scss";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import HeroCarousel, { type Slide } from "@/components/heroCarousel";
import CTA from "@/components/cta";
import PostListItem, { PostProps } from "@/components/postListItem";
import Button from "@/components/button";
import Sidebar from "@/components/sidebar";

function HomePage({ slides, posts }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<>
			<HeroCarousel slides={slides} />
			<CTA />
			<section className={styles.gridLayout}>
				<div className={styles.wrapper}>
					<div className={styles.main}>
						<div className={styles.postsList}>
							{posts.length > 0 &&
								posts.map((post) => (
									<PostListItem
										post={post}
										key={post.id}
									/>
								))}
						</div>
						<div className="text-center pt-lg">
							<Button
								link="/blog"
								showIcon={true}>
								See more posts
							</Button>
						</div>
					</div>
					<Sidebar />
				</div>
			</section>
		</>
	);
}

export default HomePage;

type Props = {
	slides: Slide[];
	posts: PostProps[];
};

// export const getStaticProps: GetStaticProps<{ slides: Slide[]; posts: PostProps[] }> = async () => {
// 	const FAKE_DATA_URL = process.env.NEXT_PUBLIC_FAKE_DATA_URL;
// 	try {
// 		const [resForSlides, resForPosts] = await Promise.all([fetch(`${FAKE_DATA_URL}/slidess`), fetch(`${FAKE_DATA_URL}/posts`)]);

// 		const [slides, postsData] = await Promise.all([resForSlides.json(), resForPosts.json()]);
// 		const posts = postsData?.slice(0, 3) || [];

// 		return { props: { slides: slides || [], posts: posts || [] } };
// 	} catch (err) {
// 		console.log(err);
// 		return { props: { slides: [], posts: [] } };
// 	}
// };

/**
 * Promises with Satisfies
 */
export const getStaticProps: GetStaticProps<Props> = async () => {
	const FAKE_DATA_URL = process.env.NEXT_PUBLIC_FAKE_DATA_URL;
	let slides,
		posts = [];
	try {
		const [resFrontPageData, resForPosts] = await Promise.all([fetch(`${FAKE_DATA_URL}/tr/v1/frontpage`), fetch(`${FAKE_DATA_URL}/tr/v1/posts`)]);

		if (resFrontPageData.ok) {
			const {
				acf: { hero_carousel },
			} = await resFrontPageData.json();

			if (hero_carousel?.length > 0) {
				slides = hero_carousel;
			}
		}

		if (resForPosts.ok) {
			const postsData = await resForPosts.json();
			posts = await postsData.posts;
		}
		// const [slides, postsData]: [slides: Slide[], postsData: PostProps[]] = await Promise.all([resForSlides.json(), resForPosts.json()]);
		posts = posts?.slice(0, 3) || [];

		return { props: { slides: slides, posts: posts } };
	} catch (err) {
		console.log(err);
		return { props: { slides: [], posts: [] } };
	}
};

/**
 * Single line fetches
 */
// export const getStaticProps = (async () => {
// 	const FAKE_DATA_URL = process.env.NEXT_PUBLIC_FAKE_DATA_URL;
// 	try {
// 		const resForSlides = await fetch(`${FAKE_DATA_URL}/slides`);
// 		const slides: Slide[] = await resForSlides.json();

// 		const resForPosts = await fetch(`${FAKE_DATA_URL}/posts`);
// 		const posts: PostProps[] = await resForPosts.json();
// 		// const posts = postsData?.slice(0, 3) || [];

// 		return {
// 			props: {
// 				slides: slides || [],
// 				posts: posts || [],
// 			},
// 		};
// 	} catch (err) {
// 		console.log(err);
// 		return {
// 			props: {
// 				slides: [],
// 				posts: [],
// 			},
// 		};
// 	}
// }) satisfies GetStaticProps<{ slides: Slide[]; posts: PostProps[] }>;
