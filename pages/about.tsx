import CTA from "@/components/cta";
import PageLayout from "@/components/pageLayout";
import SectionSplit from "@/components/sectionSplit";

function AboutPage() {
	return (
		<PageLayout
			featuredImage={`${process.env.NEXT_PUBLIC_FAKE_DATA_URL?.replace("wp-json", "")}wp-content/uploads/2026/07/home-hero-4.jpg`}
			title="About"
			metaDescription="Some meta description">
			<SectionSplit image={`${process.env.NEXT_PUBLIC_FAKE_DATA_URL?.replace("wp-json", "")}wp-content/uploads/2026/07/home-hero-4.jpg`}>
				<h1>About MotiActive</h1>
				<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
				<p>
					Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
				</p>
			</SectionSplit>
			<CTA className="pb-lg" />
		</PageLayout>
	);
}

export default AboutPage;
