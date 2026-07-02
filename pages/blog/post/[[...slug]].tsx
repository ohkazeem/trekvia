import styles from "@/styles/singlePostPage.module.scss";
import InputGroup from "@/components/inputGroup";
import { PostProps } from "@/components/postListItem";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Controller, SubmitHandler, useForm, FieldPath, FieldValues, ControllerRenderProps } from "react-hook-form";
import dynamic from "next/dynamic";
import Button from "@/components/button";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type CategoryOptionProps = {
	label: string;
	value: string;
};

const postFormSchema = z.object({
	title: z.string().min(1, "Please add a post title"),
	date: z.iso.date("A published date is required"),
	subtitle: z.string().optional(),
	summary: z.string().min(1, "Please add a post excerpt"),
	// categories: z.string("Please add a post title"),
	categories: z.array(z.string()).nonempty("please select at least one category"),
	featuredImg: z.string("Please add a post title"),
});

type PostFormProps = z.infer<typeof postFormSchema>;

const defaultLabels = (type: string, post: PostProps) => {
	switch (type) {
		case "add":
			return { heading: "Add a new Post" };
		case "edit":
			return { heading: post ? `Edit ${post.title}` : "" };
		default:
			return { heading: "No type chosen" };
	}
};

const categoriesOptions: CategoryOptionProps[] = [
	{
		label: "Sunt",
		value: "sunt",
	},
	{
		label: "Laboris",
		value: "laboris",
	},
	{
		label: "Commodo",
		value: "commodo",
	},
	{
		label: "Deserunt",
		value: "deserunt",
	},
];

function EditSinglePostPage({ post, type }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const defaults = defaultLabels(type, post);

	let count = 0;
	const {
		handleSubmit,
		register,
		control,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<PostFormProps>({
		defaultValues: {
			title: post ? post.title : "",
			date: post ? new Date(post.published_date).toISOString().split("T")[0] : undefined,
			// date: post ? new Date(post.published_date) : new Date(),
			// date: post ? new Date(post.published_date) : null,
			subtitle: post ? post.subtitle : "",
			summary: post ? post.summary : "",
			// categories: post ? post.categories : [],
			featuredImg: "",
		},
		resolver: zodResolver(postFormSchema),
	});

	console.log(errors);

	const onSubmit: SubmitHandler<PostFormProps> = async (data) => {
		// console.log(data);
		const formData = new FormData();

		// const fileObject = data.featuredImg[0];
		// formData.append("image", fileObject);

		console.log(Object.fromEntries(formData));
	};

	const selectedCategories = (field: CategoryOptionProps) => {
		const options = categoriesOptions.filter((o) => field.value.includes(o.value));
		return options;
	};

	const [previewUrl, setPreviewUrl] = useState(post ? post.imgUrl : "");

	// Generate a temporary local URL to preview the selected image
	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	return (
		<section className={styles.formSection}>
			{count++}
			<div>
				<div>
					<h1> {defaults.heading}</h1>
				</div>
				<div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<InputGroup>
							<label htmlFor="title">Post Title</label>
							<input
								type="text"
								placeholder="Post Title"
								{...register("title")}
							/>
							{errors.title && <p>{errors?.title?.message}</p>}
						</InputGroup>
						<InputGroup>
							<label htmlFor="date">Publish Date</label>
							<input
								type="date"
								// id="date"
								placeholder="Publish Date"
								{...register("date")}
							/>
							{errors.date && <p>{errors?.date?.message}</p>}
						</InputGroup>

						<InputGroup>
							<label htmlFor="featured Image">Featured Image</label>
							<input
								id="image-input"
								type="file"
								accept="image/*"
								// Register the field and attach validation rules
								{...register("featuredImg", {
									required: "Please select an image to upload.",
								})}
								onChange={(e) => {
									// RHF's onChange must execute to track form state
									register("featuredImg").onChange(e);
									// Run your local state preview logic
									handleImageChange(e);
								}}
							/>
							{errors.featuredImg && <p>{errors?.featuredImg?.message}</p>}
							{previewUrl && (
								<div>
									<p>Preview:</p>
									<Image
										src={previewUrl?.startsWith("http://192.168.1.131:3000") ? previewUrl.replace("http://192.168.1.131:3000", "") : previewUrl}
										alt="Selected preview"
										width={300}
										height={300}
										style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
									/>
								</div>
							)}
						</InputGroup>
						<InputGroup>
							<label htmlFor="subtitle">Post Subtitle</label>
							<input
								type="text"
								placeholder="Subtitle"
								{...register("subtitle")}
							/>
							{errors.subtitle && <p>{errors?.subtitle?.message}</p>}
						</InputGroup>
						<InputGroup>
							<label htmlFor="summary">Post Excerpt</label>
							<textarea
								{...register("summary")}
								placeholder="Post excpert"></textarea>
							{errors.summary && <p>{errors?.summary?.message}</p>}
						</InputGroup>

						<div className="text-right">
							<Button type="button">Submit</Button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}

export default EditSinglePostPage;

type ParamsProps = {
	slug: string;
};

export const getServerSideProps: GetServerSideProps<{ post: PostProps; type: string }, ParamsProps> = async ({ params }) => {
	const slug = params?.slug || [];

	if (slug.length === 0) {
		return {
			props: {
				type: "add",
				post: null,
			},
		};
	} else {
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
				type: "edit",
			},
		};
	}
};
