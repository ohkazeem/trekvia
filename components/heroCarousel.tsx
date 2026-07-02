import Image from "next/image";
import Button from "@/components/button";
import { useCallback, useEffect, useState } from "react";
import styles from "@/styles/heroCarousel.module.scss";
import DOMPurify from "isomorphic-dompurify";

export type Slide = {
	id: number;
	heading: string;
	subtitle: string;
	content: Node;
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

	const getSlide = useCallback(() => {
		setCurrentSlide((prevIndex: number) => (prevIndex === numOfSlides - 1 ? 0 : prevIndex + 1));
	}, [numOfSlides]);

	// Setup autoplay for the slider
	useEffect(() => {
		if (numOfSlides) {
			const sliderInterval = setInterval(getSlide, slideTimer);
			// unmount
			return () => clearInterval(sliderInterval);
		}
	}, [currentSlide, numOfSlides, getSlide]);

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
									<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(slide?.content) }}></div>
									{/* <Button
										link={"/" + slide.link}
										showIcon={true}>
										Read more
									</Button> */}
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
