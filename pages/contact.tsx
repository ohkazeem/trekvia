import Button from "@/components/button";
import CTA from "@/components/cta";
import PageLayout from "@/components/pageLayout";
import SectionFull from "@/components/sectionFull";
import SectionSplit from "@/components/sectionSplit";
import { SocialItemProps } from "@/components/socialMediaItem";
import SocialsList from "@/components/socialsList";
import Link from "next/link";
import { useForm, SubmitHandler, Controller, FormProvider } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faGlobe, faPhone } from "@fortawesome/free-solid-svg-icons";
import { CustomOptionProps, CustomSelectProps } from "@/components/iconSelect";
import dynamic from "next/dynamic";
import InputGroup, { isRequired } from "@/components/inputGroup";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnyZodObject } from "zod/v3";

const socialMediaLists: SocialItemProps[] = [
	{
		name: "YouTube",
		url: "https://youtube.com/xxx",
	},
	{
		name: "Medium",
		url: "https://medium.com/xxx",
	},
	{
		name: "Instagram",
		url: "https://instagram.com/xxx",
	},
];

const contactMethodOptions: CustomOptionProps[] = [
	{
		value: "phone",
		label: "Phone",
		icon: faPhone,
	},
	{
		value: "email",
		label: "Email",
		icon: faEnvelope,
	},
];

export const contactSchema = z.object({
	fullName: z.string().min(1, { message: "Full Name is required" }),
	email: z.email({ message: "Please enter a valid email address" }),
	subject: z.string().min(1, { message: "Subject is required" }),
	// subject: z.string().optional(),
	// message: z.string().min(1, { message: "Message is required" }),
	message: z.string().max(10, { message: "Message must be less than 10 characters" }).optional(),
	contactMethod: z.enum(["phone", "email", ""], { message: "Please select a contact method" }),
});

export type FormFieldsProps = z.infer<typeof contactSchema>;

// type FormFieldsProps = {
// 	fullName: string;
// 	email: string;
// 	subject: string;
// 	message: string;
// 	contactMethod: "phone" | "email" | "";
// };

// Disable Server-Side Rendering for react-select
const NoSSRSelect = dynamic<CustomSelectProps<FormFieldsProps, "contactMethod">>(() => import("@/components/iconSelect"), {
	ssr: false,
	loading: () => (
		<p
			className="size-xs"
			style={{ color: "#6b7280" }}>
			Loading selector...
		</p>
	),
});

function ContactPage() {
	const {
		control,
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormFieldsProps>({
		defaultValues: {
			fullName: "",
			email: "",
			subject: "",
			message: "",
			contactMethod: "",
		},
		resolver: zodResolver(contactSchema),
	});

	const onSubmit: SubmitHandler<FormFieldsProps> = async (data) => {
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			throw new Error();
		} catch (error) {
			setError("email", {
				message: "This email has already been used",
			});
		}

		console.log(data);
	};

	return (
		<PageLayout
			title="Contact"
			metaDescription="Some meta description contact">
			<SectionSplit image={`/home-hero-4.jpg`}>
				<h1>How to Contact Me</h1>
				<p>
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
					tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
				</p>
				<h2 className="mt-xs">Send Me An Email</h2>
				<Link href={"mailto:hello@motiactive.com"}>
					<FontAwesomeIcon
						icon={faEnvelope}
						color="#0b9ebf"
					/>
					<span>hello@motiactive.com</span>
				</Link>
				<h2 className="mt-xs">Follow Me </h2>
				<SocialsList
					socials={socialMediaLists}
					align="left"
				/>
				<h2 className="mt-xs">For Websites</h2>
				<p>Interested in getting a website done? You can check out my other business or send an a message to the email below.</p>
				<div>
					<a href={"mailto:inquiry@inkhartdesigns.com"}>
						<FontAwesomeIcon
							icon={faEnvelope}
							color="#0b9ebf"
						/>
						<span>inquiry@inkhartdesigns.com</span>
					</a>
				</div>
				<div className="mt-3xs">
					<a
						href={"https://inkhartdesigns.com"}
						target="_blank">
						<FontAwesomeIcon
							icon={faGlobe}
							color="#0b9ebf"
						/>
						<span>inkhartdesigns.com</span>
					</a>
				</div>
			</SectionSplit>
			<CTA />
			<SectionFull>
				<h2
					style={{ marginBlockEnd: "2rem" }}
					className="text-center">
					Send me a message
				</h2>

				<form
					onSubmit={handleSubmit(onSubmit)}
					style={{ maxWidth: "700px", marginInline: "auto" }}>
					<InputGroup
						fieldName="fullName"
						schema={contactSchema}>
						<label htmlFor="fullName">Full Name</label>
						<input
							type="text"
							{...register("fullName")}
							placeholder="Full Name"
						/>
						{errors.fullName && <p>{errors?.fullName?.message}</p>}
					</InputGroup>

					<InputGroup
						fieldName="email"
						schema={contactSchema}>
						<label htmlFor="email">Email</label>
						<input
							type="text"
							{...register("email")}
							placeholder="Email"
						/>
						{errors.email && <p>{errors?.email?.message}</p>}
					</InputGroup>
					<InputGroup>
						<label htmlFor="contactMethod">Select a preferred contact method</label>
						<Controller
							name="contactMethod"
							control={control}
							render={({ field }) => (
								<NoSSRSelect
									name="contactMethod"
									field={field}
									options={contactMethodOptions}
									placeholder="Select contact method"
									className="hello"
								/>
							)}
						/>
					</InputGroup>
					<InputGroup
						fieldName="subject"
						schema={contactSchema}>
						<label htmlFor="subject">Subject</label>
						<input
							type="text"
							{...register("subject")}
							placeholder="Subject"
						/>
						{errors.subject && <p>{errors?.subject?.message}</p>}
					</InputGroup>
					<InputGroup
						fieldName="message"
						schema={contactSchema}>
						<label htmlFor="message">Your Message</label>
						<textarea
							{...register("message")}
							placeholder="Enter your message"
						/>
						{errors.message && <p>{errors?.message?.message}</p>}
					</InputGroup>
					<div className="text-right">
						<Button
							type="button"
							disabled={isSubmitting}>
							Submit
						</Button>
					</div>
				</form>
			</SectionFull>
		</PageLayout>
	);
}

export default ContactPage;
