import { VFC, useState, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useFaqResponse } from './Faq.hooks';
import styles from './Faq.module.scss';
import { SectionHeading } from '@/components/pc/ui/headings';

const UNEXPANDED_COUNT = 3;

export type Props = {
	faqRef: RefObject<HTMLDivElement>;
};

/**
 * FAQ
 */
export const Faq: VFC<Props> = ({ faqRef }) => {
	const [t] = useTranslation();

	const faqList = useFaqResponse();

	const [isExpanded, setIsExpanded] = useState(false);

	if (!faqList.length) {
		return null;
	}

	return (
		<div className={styles.container} ref={faqRef}>
			<SectionHeading>{t('pages.productDetail.faq.faq')}</SectionHeading>
			<div>
				{faqList
					.slice(0, isExpanded ? undefined : UNEXPANDED_COUNT)
					.map((faq, index) => (
						<div className={styles.faq} key={index}>
							<div className={styles.question}>
								<span className={styles.questionTitle}>Q</span>
								<span>{faq.question}</span>
							</div>
							<div className={styles.answer}>
								<div className={styles.answerTitle}>A</div>
								<div
									className={styles.answerDescription}
									dangerouslySetInnerHTML={{
										__html: faq.answer,
									}}
								/>
							</div>
						</div>
					))}
			</div>
			{faqList.length > UNEXPANDED_COUNT && (
				<div>
					<span
						onClick={() => setIsExpanded(!isExpanded)}
						className={styles.expandLink}
						aria-expanded={isExpanded}
					>
						{isExpanded
							? t('pages.productDetail.faq.hideLink')
							: t('pages.productDetail.faq.expandLink', {
									count: faqList.length - UNEXPANDED_COUNT,
							  })}
					</span>
				</div>
			)}
		</div>
	);
};

Faq.displayName = 'Faq';
