export async function getPosts() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_FAKE_DATA_URL}/posts`);
		if (res.ok) {
			const data = await res.json();
			return data;
		}
	} catch (error: unknown) {
		if (Error.isError(error)) {
			console.log("Fetch error: ", error.message);
		} else {
			throw new Error("Unable to fetch data");
		}
	}
}
