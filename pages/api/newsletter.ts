// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import mailchimp, { type lists, type ErrorResponse } from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
	apiKey: process.env.MAILCHIMP_API_KEY,
	server: process.env.MAILCHIMP_SERVER_PREFIX,
});

type Data = {
	success?: boolean;
	error?: string;
	data?: lists.MembersSuccessResponse | ErrorResponse;
	message?: string;
	title?: string;
};

type CustomError = Error & {
	response: {
		status: number;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		body: any;
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCustomError(error: any): error is CustomError {
	return error && "response" in error;
}

export default async function mailchimpHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
	try {
		const { email } = JSON.parse(req.body);
		const audiendID: string = process.env.MAILCHIMP_AUDIENCE_ID!;

		// Test if Mailchimp connection is working
		// const response = await mailchimp.ping.get();
		// console.log(response);

		// Use the lists.addListMember method to add a new contact to the mailing list
		const response = await mailchimp.lists.addListMember(audiendID, {
			email_address: email,
			status: "subscribed",
			tags: ["trekvia-newsletter"],
		});

		res.status(200).json({ success: true, data: response });
	} catch (err) {
		// console.log(err);
		if (isCustomError(err)) {
			const errorWithResponse = err;
			return res.status(errorWithResponse?.response.status || 500).json({ success: false, message: errorWithResponse.response?.body?.detail || "An error occurred", title: errorWithResponse.response?.body?.title || "" });
		} else {
			// throw new Error("This is a new error");
			return res.status(500).json({ success: false, message: "An error occurred. Please try again later" });
		}
		console.log(Error.isError(err));
	}
}
