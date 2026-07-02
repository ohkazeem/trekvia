// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const body: unknown = req.body;
	const result = FormFieldProps.safeParse(body);
	let zodErrors: Record<string, string> = {};
	if (!result.success) {
		result.error.issues.forEach((issue) => {
			zodErrors = { ...zodErrors, [issue.path.join(".")]: issue.message };
		});
		// return res.status(400).json({ name: "Invalid request body" });
		return res.status(400).json(Object.keys(zodErrors).length > 0 ? { errors: zodErrors } : { success: true });
	}

	const { email, password } = result.data;

	// Perform any necessary processing with the email and password here
	res.status(200).json({ name: "John Doe" });
}
