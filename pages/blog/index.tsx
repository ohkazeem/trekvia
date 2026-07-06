import styles from "@/styles/blogPage.module.scss";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import PostListItem, { PostProps } from "@/components/postListItem";
import Button from "@/components/button";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function BlogPage({ posts, totalCount, maxNumPage }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentPage = Number(searchParams.get("page")) || 1;

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
					<div className={styles.pagination}>
						<div className={styles.wrapper}>
							{maxNumPage !== undefined && maxNumPage > 0 && (
								<ul>
									{[...Array(maxNumPage).keys()].map((_, i) => {
										const currentParams = new URLSearchParams(searchParams.toString());
										currentParams.set("page", String(i + 1));
										const targetHref = `${pathname}?${currentParams.toString()}`;

										return <li key={i + 1}>{currentPage === i + 1 ? <span>{i + 1}</span> : <Link href={targetHref}>{i + 1}</Link>}</li>;
									})}
								</ul>
							)}
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
	totalCount?: number;
	maxNumPage?: number;
};

type ParamsProps = {
	per_page?: string;
	page?: string;
};

export const getServerSideProps: GetServerSideProps<Props, ParamsProps> = async (context) => {
	const { query } = context;
	const FAKE_DATA_URL = process.env.NEXT_PUBLIC_FAKE_DATA_URL;
	const PER_PAGE = Number(query.per_page) || 6;
	const PAGE = Number(query.page) || 1;
	const SEARCH_PARAM = query.s || "";

	try {
		const resForPosts = await fetch(`${FAKE_DATA_URL}/tr/v1/posts?per_page=${PER_PAGE}&page=${PAGE}&s=${SEARCH_PARAM}`);

		if (resForPosts.ok) {
			const postsData = await resForPosts.json();
			const { posts, totalCount, maxNumPage } = await postsData;
			return { props: { posts, totalCount, maxNumPage } };
		}
		return {
			notFound: true,
		};
	} catch (err) {
		console.log(err);
		return { props: { posts: [] } };
	}
};
