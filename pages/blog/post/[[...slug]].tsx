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
import Select from "react-select";
import { useRouter } from "next/navigation";

const SelectedOptionSchema = z.object({
	label: z.string(),
	value: z.string(),
});

const postFormSchema = z.object({
	id: z.number().optional(),
	title: z.string().min(1, "Please add a post title"),
	date: z.iso.date().min(1, "A published date is required"),
	subtitle: z.string().optional(),
	summary: z.string().min(1, "Please add a post excerpt"),
	categories: z.array(SelectedOptionSchema).min(1, "Please select at least one category"),
	// categories: z.array(CategoryPostOptionSchema).min(1, "Please select at least one category").or(z.array(SelectedOptionSchema)),
	// featuredImg: z.string("Please upload an image"),
	// featuredImg: z.instanceof(File, { message: "File is required" }).or(z.string()),
	featuredImg: z.custom<FileList>((v) => v instanceof FileList, "File is required").or(z.string()),

	// featuredImg: z.custom<FileList>((v) => v instanceof FileList, "File is required"),
	//     // Ensure at least one file is selected
	// .refine((files) => files.length > 0, "File is required")
	// // Optional: Validate file size (e.g., max 5MB)
	// .refine((files) => files[0]?.size <= 5 * 1024 * 1024, "Max file size is 5MB")
	// // Optional: Validate file type
	// .refine((files) => ["image/jpeg", "image/png"].includes(files[0]?.type), "Only JPG/PNG allowed")
	// // Transform the FileList array to a single File object
	// .transform((files) => files[0]),
});

type PostFormProps = z.infer<typeof postFormSchema>;

const defaultLabels = (type: string, post: PostProps | null) => {
	switch (type) {
		case "add":
			return { heading: "Add a new Post" };
		case "edit":
			return { heading: post ? `Edit ${post.title}` : "" };
		default:
			return { heading: "No type chosen" };
	}
};

const categoriesOptions2: { label: string; value: string }[] = [
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

const NoSSRSelect = dynamic(() => import("react-select"), {
	ssr: false,
});

function EditSinglePostPage({ post, type, categories }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const defaults = defaultLabels(type, post);
	const categoriesOptions = [...categories, ...categoriesOptions2];
	const [previewUrl, setPreviewUrl] = useState(post ? post.imgUrl : "");

	const {
		handleSubmit,
		register,
		control,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<PostFormProps>({
		defaultValues: {
			id: post ? Number(post.id) : undefined,
			title: post ? post.title : "",
			date: post ? post.published_date : "",
			subtitle: post ? post.subtitle : "",
			summary: post ? post.summary : "",
			categories: post ? post?.categories?.map((cat) => ({ label: cat.term, value: cat.slug })) : [],
			featuredImg: post ? post.imgUrl : "",
		},
		resolver: zodResolver(postFormSchema),
	});

	const onSubmit: SubmitHandler<PostFormProps> = async (data) => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (key === "featuredImg" && value instanceof FileList && value.length > 0) {
				// Dynamically catch file arrays and append the binary item
				const fileObj = value[0];
				formData.append("featuredImg", fileObj);
				// formData.append("fileName", fileObj.name);
			} else if (key === "categories") {
				formData.append("categories", JSON.stringify(value));
			} else {
				// Append normal text/number strings
				formData.append(key, value as string | Blob);
			}
		});
		try {
			const res = await fetch(`/api/posts`, {
				method: "POST",
				// body: JSON.stringify(data),
				body: formData,
			});
			if (res.ok) {
				const resData = await res.json();
				// console.log(resData);
				router.refresh();
				// console.log(data);
			}
		} catch (err) {
			console.log(err);
		}
		// console.log(Object.fromEntries(formData));
	};

	const selectedCategories = (values: { label: string; value: string }[]) => {
		return values;
	};

	// Generate a temporary local URL to preview the selected image
	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	return (
		<section className={styles.formSection}>
			<div>
				<div>
					<h1> {defaults.heading}</h1>
				</div>
				<div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<input
							type="hidden"
							{...register("id")}
						/>
						<InputGroup>
							<label htmlFor="title">Post Title</label>
							<input
								type="text"
								placeholder="Post Title"
								{...register("title")}
							/>
							{errors.title && <p>{errors?.title?.message}</p>}
						</InputGroup>
						<div className={styles.coltwo}>
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
									{...register("featuredImg")}
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
										<p>Preview: {previewUrl}</p>
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
						</div>

						<div className={styles.coltwo}>
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
								<label htmlFor="categories">Select Categories</label>

								<Controller
									control={control}
									name="categories"
									render={({ field: { ref, ...field } }) => {
										return (
											<NoSSRSelect
												{...field}
												ref={ref}
												options={categoriesOptions}
												isMulti
												classNamePrefix="select"
												placeholder="Select categories"
												onChange={field.onChange}
												value={selectedCategories(field.value)}
											/>
										);
									}}
								/>
								{errors.categories && <p>{errors?.categories?.message}</p>}
							</InputGroup>
						</div>
						<InputGroup>
							<label htmlFor="summary">Post Excerpt</label>
							<textarea
								{...register("summary")}
								placeholder="Post excpert"></textarea>
							{errors.summary && <p>{errors?.summary?.message}</p>}
						</InputGroup>

						<div className="text-right">
							<Button
								type="button"
								disabled={isSubmitting}>
								Submit
							</Button>
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

type ServerSideProps = {
	post: PostProps | null;
	type: string;
	categories: { label: string; value: string }[] | [];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps, ParamsProps> = async ({ params }) => {
	const slug = params?.slug || [];

	try {
		const [categoriesRes, postRes] = await Promise.all([fetch(`${process.env.NEXT_PUBLIC_FAKE_DATA_URL}/tr/v1/categories`), ...(slug?.length !== 0 ? [fetch(`${process.env.NEXT_PUBLIC_FAKE_DATA_URL}/tr/v1/posts/${slug}`)] : [])]);

		const post = (await postRes?.json()) || null;
		const categories = (await categoriesRes?.json()) || [];

		if (post.code) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				post: post,
				categories: categories,
				type: slug.length === 0 ? "add" : "edit",
			},
		};
	} catch (err) {
		console.log(err);
		return {
			notFound: true,
		};
	}
};
