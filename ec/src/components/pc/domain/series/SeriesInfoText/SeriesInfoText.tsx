import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SeriesInfoText.module.scss';
import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';

type Props = {
	seriesInfoText?: string[];
};

/**
 * Series info text.
 */
export const SeriesInfoText: React.VFC<Props> = ({ seriesInfoText = [] }) => {
	const [t] = useTranslation();

	if (!seriesInfoText.length) {
		return null;
	}

	return (
		<div className={styles.cautionWrapper}>
			<h3 className={styles.cautionTitle}>
				{t('pages.productDetail.caution')}
			</h3>
			<ul className={styles.infoTextList}>
				{seriesInfoText.map((text, index) => (
					<LegacyStyledHtml
						key={index}
						html={text}
						parentHtmlTag="li"
						className={styles.infoText}
					/>
				))}
			</ul>
		</div>
	);
};
SeriesInfoText.displayName = 'SeriesInfoText';
