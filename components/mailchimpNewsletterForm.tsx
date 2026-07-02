import { useEffect, useState } from "react";
import Button from "./button";
import styles from "@/styles/mailchimpNewsletterForm.module.scss";

type SubmissionStatus = {
	status: "error" | "success";
	message: string;
};

type FormProps = {
	formClass: string;
};

function MailchimpNewsletterForm({ formClass }: FormProps) {
	const [submitting, setIsSubmitting] = useState(false);
	const [status, setStatus] = useState<SubmissionStatus | null>(null);

	// Hide status message after a short while
	useEffect(() => {
		if (status) {
			const timer = setTimeout(() => {
				setStatus(null);
			}, 2000);

			// Cleanup the timer if the component unmounts
			return () => clearTimeout(timer);
		}
	}, [status]);

	const HandleSubmit: React.SubmitEventHandler = async function (e) {
		e.preventDefault();

		// const formData = Object.fromEntries(new FormData(e.target));
		const target = e.target as typeof e.target & {
			email: { value: string };
		};
		const email = target.email.value;

		const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;

		if (!email) {
			setStatus({ status: "error", message: "An email address is required." });
			return;
		} else if (!emailRegex.test(email)) {
			setStatus({ status: "error", message: "Enter a valid email." });

			return;
		} else {
			setStatus(null);
		}

		// myemail@em.com
		setIsSubmitting(true);
		const res = await fetch("/api/newsletter", {
			method: "POST",
			body: JSON.stringify({ email }),
		});

		if (res.ok) {
			setStatus({ status: "success", message: "Thank you for subscribing!" });
			// setTimeout(() => {
			// 	setStatus(null);
			// }, 2000);
			console.log("is ok");
		} else {
			const { title, message } = await res.json();
			if (title === "Member Exists") {
				setStatus({ status: "error", message: `${email} is already registerd.` });
			} else {
				setStatus({ status: "error", message: message });
			}
		}

		// console.log(data);
		setIsSubmitting(false);
		e.target.reset();
	};
	return (
		<form
			className={`${styles.form} ${formClass}`}
			onSubmit={HandleSubmit}>
			{status && <p className={`status ${status.status}`}>{status?.message}</p>}
			<input
				type="text"
				placeholder="Type your email"
				name="email"
			/>
			<Button
				type="button"
				disabled={submitting}>
				Subscribe
			</Button>
		</form>
	);
}

export default MailchimpNewsletterForm;
