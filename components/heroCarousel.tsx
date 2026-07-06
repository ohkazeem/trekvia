import Image from "next/image";
import Button from "@/components/button";
import { useEffect, useState } from "react";
import styles from "@/styles/heroCarousel.module.scss";
import sanitizeHtml from "sanitize-html";

export type Slide = {
	id: number;
	heading: string;
	subtitle: string;
	content: string;
	link: string;
	image: string;
};

export type HeroCarouselProps = {
	slides: Slide[];
};

function HeroCarousel({ slides = [] }: HeroCarouselProps) {
	const numOfSlides = slides.length;
	const [currentSlide, setCurrentSlide] = useState(0);

	const handleSlideChange = (idx: number) => {
		setCurrentSlide(idx);
	};

	// Interval for autoplay
	const slideTimer = 3000;

	useEffect(() => {
		if (numOfSlides) {
			const sliderInterval = setInterval(() => setCurrentSlide((prevIndex: number) => (prevIndex === numOfSlides - 1 ? 0 : prevIndex + 1)), slideTimer);
			// unmount
			return () => clearInterval(sliderInterval);
		}
	}, [numOfSlides]);

	if (slides.length < 0) return;
	return (
		<section className={styles.hero}>
			<div className={styles.wrapper}>
				<div className={styles.imagesWrapper}>
					<div className={styles.wrapper}>
						{slides.map((slide, i) => (
							<Image
								key={i + 1}
								src={slide.image}
								alt=""
								width={950}
								height={673}
								priority
								className={currentSlide === i ? "active" : ""}
							/>
						))}
					</div>
				</div>
				<div className={styles.cardsWrapper}>
					<div className={styles.cards}>
						<div className={styles.wrapper}>
							{slides.map((slide, i) => (
								<div
									className={`${styles.cardItem} ${currentSlide === i ? "active" : ""}`}
									key={i + 1}>
									<h2>{slide.heading}</h2>
									<h3>{slide.subtitle}</h3>
									<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(slide?.content) }}></div>
									<Button
										link={slide.link}
										showIcon={true}>
										Read more
									</Button>
								</div>
							))}
						</div>
					</div>
					<div className={styles.dots}>
						{slides.map((_, i) => (
							<span
								role="button"
								aria-label={`Go to slide ${i + 1}`}
								key={i + 1}
								className={currentSlide === i ? "active" : ""}
								onClick={() => handleSlideChange(i)}></span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default HeroCarousel;
