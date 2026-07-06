// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	name: string;
};

export const config = {
	api: {
		bodyParser: false, // Disabling bodyParser is crucial for Next.js to handle multipart/form-data
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method === "POST") {
		try {
			// const data = JSON.parse(req.body);
			const data = req.body;

			// return res.status(200).json({ data: req.body });
			const username = process.env.WP_APP_USERNAME;
			const appPassword = process.env.WP_APP_PSW;
			const creds = btoa(`${username}:${appPassword}`);
			const sendRes = await fetch(`${process.env.NEXT_PUBLIC_FAKE_DATA_URL}/tr/v1/posts`, {
				method: "POST",
				// body: JSON.stringify({ test: "yes" }),
				body: data,
				headers: {
					Authorization: `Basic ${creds}`,
					// Accept: "application/json",
					// "Content-Type": "multipart/form-data;boundary=None",
				},
			});

			const resData = await sendRes.json();
			res.status(200).json(resData);
		} catch (err) {
			console.log(err);
		}
	}
}
