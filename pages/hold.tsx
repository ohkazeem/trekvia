import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z
	.object({
		email: z.email({ message: "Invalid email address" }),
		password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
		confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters long" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"], // path of error
	});

type FormFieldsProps = z.infer<typeof schema>;

function Hold() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		resolver: zodResolver(schema),
	});

	const onSubmit: SubmitHandler<FormFieldsProps> = async (data: FormFieldsProps) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log(data);

		// reset();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label htmlFor="email">Email</label>
				<input
					type="text"
					{...register("email")}
				/>
			</div>
			<div>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					{...register("password")}
				/>
			</div>
			<div>
				<label htmlFor="confirmPassword">Confirm Password</label>
				<input
					type="password"
					{...register("confirmPassword")}
				/>
			</div>
		</form>
	);
}

export default Hold;
