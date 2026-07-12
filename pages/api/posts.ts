// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files, File as FormidableFile } from "formidable";
import { readFile } from "node:fs/promises";
import { sanitizeFilename } from "@/lib/formats";

type Data = {
	name: string;
};

export const config = {
	api: {
		bodyParser: false, // Disabling bodyParser is crucial for Next.js Pages router to handle multipart/form-data
	},
};

function getFile(value: FormidableFile | FormidableFile[] | undefined): FormidableFile | undefined {
	if (!value) return undefined;

	return Array.isArray(value) ? value[0] : value;
}

function getField(value: string | string[] | undefined): string | undefined {
	if (Array.isArray(value)) {
		return value[0];
	}

	return value;
}

/**
 * Use formidable to parse body
 */
async function parseForm(req: NextApiRequest): Promise<{ fields: Fields; files: Files }> {
	const form = formidable({
		multiples: false,
		keepExtensions: true,
	});

	const [fields, files] = await form.parse(req);

	return { fields, files };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method === "POST") {
		try {
			const username = process.env.WP_APP_USERNAME;
			const appPassword = process.env.WP_APP_PSW;
			const creds = btoa(`${username}:${appPassword}`);
			/**
			 * Use formidable to parse body
			 */
			// const form = formidable({ multiples: false, keepExtensions: true });
			// const { fields, files }: { fields: Fields; files: Files } = await new Promise((resolve, reject) => {
			// 	form.parse(req, (err : FormidableError | null, fields: Fields, files: Files) => {
			// 		if (err) reject(err);
			// 		resolve({ fields, files });
			// 	});
			// });

			const { fields, files } = await parseForm(req);

			/**
			 * First send the image and retrieve the id from Wordpress
			 */
			let featuredImage: number | undefined;

			const imageData = getFile(files.featuredImg);

			if (imageData) {
				const bytes = await readFile(imageData.filepath);

				const imageFormData = new FormData();

				const newFilename = sanitizeFilename(imageData.originalFilename ?? "image.jpg");
				imageFormData.append(
					"file",
					new File([bytes], newFilename, {
						type: imageData.mimetype ?? "application/octet-stream",
					}),
				);
				// imageFormData.append("file", new Blob([bytes]), imageData.originalFilename);
				// return res.status(200).json(Object.fromEntries(imageFormData.entries()));
				// return res.status(200).json(bytes);
				const imageRes = await fetch(`${process.env.NEXT_PUBLIC_FAKE_DATA_URL}/wp/v2/media`, {
					method: "POST",
					headers: {
						Authorization: `Basic ${creds}`,
						"Content-Disposition": `attachment; filename="${imageData.originalFilename}"`,
					},
					body: bytes,
				});

				if (!imageRes.ok) {
					throw new Error("Failed to upload image.");
				}

				const media = await imageRes.json();

				console.log(media);

				featuredImage = media.id;
			}

			/**
			 * Send the rest of the data to custom WP API endpoint
			 */
			const formData = new FormData();
			Object.entries(fields).forEach(([key, value]) => {
				if (key === "featuredImg") {
					return;
				} else {
					const field = getField(value);
					// Append normal text/number strings
					// formData.append(key, value as string | Blob);
					if (field !== undefined) {
						formData.append(key, field);
					}
				}
			});

			if (featuredImage !== undefined) {
				formData.append("featuredImgId", String(featuredImage));
			}

			const sendRes = await fetch(`${process.env.NEXT_PUBLIC_FAKE_DATA_URL}/tr/v1/posts`, {
				method: "POST",
				body: formData,
				headers: {
					Authorization: `Basic ${creds}`,
				},
			});

			const resData = await sendRes.json();
			res.status(200).json(resData);
		} catch (err) {
			console.log(err);
		}
	}
}
