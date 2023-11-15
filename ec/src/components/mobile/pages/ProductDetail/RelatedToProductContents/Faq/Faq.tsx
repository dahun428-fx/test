import { VFC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFaqResponse } from './Faq.hook';
import styles from './Faq.module.scss';
import { SectionHeading } from '@/components/mobile/ui/headings';

const UNEXPANDED_COUNT = 3;

/**
 * Frequently asked questions component
 */
export const Faq: VFC = () => {
	const [t] = useTranslation();
	const faqList = useFaqResponse();

	const [isExpanded, setIsExpanded] = useState(false);

	if (!faqList.length) {
		return null;
	}

	return (
		<div>
			<SectionHeading>
				{t('mobile.pages.productDetail.relatedToProductContents.faq.heading')}
			</SectionHeading>
			<div className={styles.faqListWrapper}>
				{faqList
					.slice(0, isExpanded ? undefined : UNEXPANDED_COUNT)
					.map((faq, index) => (
						<div className={styles.faq} key={index}>
							<div
								className={styles.question}
								dangerouslySetInnerHTML={{ __html: faq.question }}
							/>
							<div
								className={styles.answer}
								dangerouslySetInnerHTML={{ __html: faq.answer }}
							/>
						</div>
					))}
				{faqList.length > UNEXPANDED_COUNT && (
					<div>
						<span
							onClick={() => setIsExpanded(!isExpanded)}
							className={styles.expandLink}
							aria-expanded={isExpanded}
						>
							{isExpanded
								? t(
										'mobile.pages.productDetail.relatedToProductContents.faq.hideLink'
								  )
								: t(
										'mobile.pages.productDetail.relatedToProductContents.faq.expandLink',
										{
											count: faqList.length - UNEXPANDED_COUNT,
										}
								  )}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

Faq.displayName = 'Faq';
