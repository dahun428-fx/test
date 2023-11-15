import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SeriesInfoText.module.scss';
import { LegacyStyledHtml } from '@/components/mobile/domain/LegacyStyledHtml';

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
		<div className={styles.container}>
			<div className={styles.caution}>
				<h3 className={styles.cautionTitle}>
					{t('mobile.pages.productDetail.seriesInfoText.Caution')}
				</h3>
				<ul className={styles.infoTextList}>
					{seriesInfoText.map((text, index) => (
						<LegacyStyledHtml
							key={index}
							html={text}
							parentHtmlTag="li"
							parentClassName={styles.infoText}
						/>
					))}
				</ul>
			</div>
		</div>
	);
};
SeriesInfoText.displayName = 'SeriesInfoText';
