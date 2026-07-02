import styles from "@/styles/cta.module.scss";
import MailchimpNewsletterForm from "./mailchimpNewsletterForm";
function CTA({ className }: { className?: string }) {
	return (
		<section className={`${styles.cta} ${className}`}>
			<div className={styles.wrapper}>
				<div className={styles.contentFormWrapper}>
					<div className={styles.content}>
						<p>Want to get the latest blog and video updates? Subscribe to my newsletter now</p>
					</div>
					<MailchimpNewsletterForm formClass={styles.form} />
				</div>
			</div>
		</section>
	);
}

export default CTA;
