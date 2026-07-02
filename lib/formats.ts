import slugify from "slugify";

export function titleCase(title: string) {
	if (!title) return;
	const exlusions = ["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "by", "from"];

	return title
		.toLowerCase()
		.split(" ")
		.map((word, index) => {
			// Always capitalize the first word, or any word not in the minor list
			if (index === 0 || !exlusions.includes(word)) {
				return word.charAt(0).toUpperCase() + word.slice(1);
			}
			return word;
		})
		.join(" ");
}

export function prettyDate(date: Date) {
	if (!date) return;
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	const formatDate = new Date(date);
	return new Intl.DateTimeFormat("en-US", options).format(formatDate);
}

export function capitalizeText(text: string): string {
	if (!text) return "";
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function prettySlug(text: string) {
	if (!text) return;
	const slug = slugify(text, {
		lower: true,
		remove: /[*+~.()'"!:@]/g,
		strict: true,
		trim: true,
	});

	return slug;
}
