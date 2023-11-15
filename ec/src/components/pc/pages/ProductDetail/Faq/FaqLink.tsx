import { RefObject, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FaqLink.module.scss';

type Props = {
	faqCount: number;
	faqRef: RefObject<HTMLDivElement>;
};

/**
 * link move to FrequentlyAskedQuestions component
 */
export const FaqLink: VFC<Props> = ({ faqCount, faqRef }) => {
	const [t] = useTranslation();

	const handleClick = () => {
		if (faqRef.current) {
			faqRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	if (faqCount < 1) {
		return null;
	}

	const itemText = faqCount
		? t('pages.productDetail.faq.faqLink.items', { faqCount })
		: '';

	return (
		<div className={styles.wrapper}>
			<span className={styles.link} onClick={handleClick}>
				{t('pages.productDetail.faq.faqLink.text', { itemText })}
			</span>
		</div>
	);
};

FaqLink.displayName = 'FaqLink';
