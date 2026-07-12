import * as z from "zod";
import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import PageLayout from "@/components/pageLayout";
import SectionFull from "@/components/sectionFull";
import styles from "@/styles/account.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const LoginSchema = z.object({
	username: z.string().min(1, { message: "Please enter your username" }),
	password: z.string().min(1, { message: "Please enter your password" }),
});

type LoginFormProps = z.infer<typeof LoginSchema>;

function LoginPage() {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<LoginFormProps>({ resolver: zodResolver(LoginSchema) });

	const onSubmit: SubmitHandler<LoginFormProps> = (data) => {
		console.log(data);
	};

	return (
		<PageLayout
			title="Login"
			layout="narrow">
			<SectionFull>
				<div className={styles.section}>
					<h1 className="text-center">Login</h1>
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
							<label htmlFor="password">Password</label>
							<input
								type="password"
								{...register("password")}
							/>
							{errors.password && <p>{errors?.password?.message}</p>}
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

export default LoginPage;
