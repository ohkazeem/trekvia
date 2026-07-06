import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

type HeaderSearchFormProps = {
	className?: string;
};

function HeaderSearchForm({ className }: HeaderSearchFormProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentParams = useMemo(() => {
		const URLparams = new URLSearchParams(searchParams.toString());
		return {
			search: URLparams.get("s"),
		};
	}, [searchParams]);

	const handleSubmit: React.SubmitEventHandler = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const searchParam = formData.get("search") as string;
		// console.log(Object.fromEntries(new FormData(e.target)))
		router.push({
			pathname: "/blog",
			query: {
				s: searchParam,
			},
		});
	};
	return (
		<form
			className={className}
			onSubmit={handleSubmit}>
			<button
				type="submit"
				aria-label="Submit Search">
				<FontAwesomeIcon
					icon={faMagnifyingGlass}
					color="#FFFFFF"
					size="xs"
				/>
			</button>
			<input
				name="search"
				type="search"
				placeholder="Search"
				defaultValue={currentParams?.search ?? ""}
			/>
		</form>
	);
}

export default HeaderSearchForm;
