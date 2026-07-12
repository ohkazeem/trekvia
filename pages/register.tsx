import * as z from "zod";
import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import PageLayout from "@/components/pageLayout";
import SectionFull from "@/components/sectionFull";
import styles from "@/styles/account.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const PasswordSchema = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters." });
// .min(6, { message: "Password must be at least 8 characters long" })
// .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
// .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
// .regex(/[0-9]/, { message: "Password must contain at least one number" })
// .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

const RegisterSchema = z
	.object({
		username: z
			.string()
			.min(1, { message: "Please enter a username" })
			.regex(/^[a-zA-Z0-9]+$/, { message: "The username must contain only letters and numbers" }),
		email: z.email({ message: "Please enter a valid email" }),
		password: PasswordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type RegisterFormProps = z.infer<typeof RegisterSchema>;

function RegisterPage() {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<RegisterFormProps>({ resolver: zodResolver(RegisterSchema) });

	const onSubmit: SubmitHandler<RegisterFormProps> = (data) => {
		console.log(data);
	};

	return (
		<PageLayout
			title="Register"
			layout="narrow">
			<SectionFull>
				<div className={styles.section}>
					<h1 className="text-center">Register</h1>
					<form onSubmit={handleSubmit(onSubmit)}>
						<InputGroup>
							<label htmlFor="username">Username</label>
							<input
								type="text"
								{...register("username")}
							/>
							{errors.username && <p>{errors?.username?.message}</p>}
						</InputGroup>
						<InputGroup>
							<label htmlFor="email">Email Address</label>
							<input
								type="text"
								{...register("email")}
							/>
							{errors.email && <p>{errors?.email?.message}</p>}
						</InputGroup>
						<InputGroup>
							<label htmlFor="password">Password</label>
							<input
								type="password"
								{...register("password")}
							/>
							{errors.password && <p>{errors?.password?.message}</p>}
						</InputGroup>
						<InputGroup>
							<label htmlFor="confirmPassword">Confirm Password</label>
							<input
								type="confirmPassword"
								{...register("confirmPassword")}
							/>
							{errors.confirmPassword && <p>{errors?.confirmPassword?.message}</p>}
						</InputGroup>
						<div className="text-right">
							<Button type="button">Login</Button>
						</div>
					</form>
					<h3 className="pt-lg text-center">
						Don&apos;t have an account? <Link href={"/register"}>Register</Link>
					</h3>
				</div>
			</SectionFull>
		</PageLayout>
	);
}

export default RegisterPage;
