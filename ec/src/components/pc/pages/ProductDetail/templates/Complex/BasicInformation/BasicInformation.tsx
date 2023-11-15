import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BasicInformation.module.scss';
import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';
import { SeriesInfoText } from '@/components/pc/domain/series/SeriesInfoText';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';

type Props = {
	eleWysiwygHtml?: string;
	catchCopyHtml?: string;
	seriesInfoText?: string[];
	technicalInfoUrl?: string;
};

export const BasicInformation: VFC<Props> = ({
	eleWysiwygHtml,
	catchCopyHtml,
	seriesInfoText,
	technicalInfoUrl,
}) => {
	const { translateTab } = useTabTranslation();
	const [t] = useTranslation();

	return (
		<>
			<h3 className={styles.header}>{translateTab('basicInfo')}</h3>
			{!!catchCopyHtml && (
				<LegacyStyledHtml
					html={catchCopyHtml}
					childHtmlTag="p"
					isDetail
					isComplex
					childClassName={styles.catchCopy}
				/>
			)}
			<SeriesInfoText seriesInfoText={seriesInfoText} />
			{!!eleWysiwygHtml && (
				<div className={styles.infoBox}>
					<LegacyStyledHtml
						html={eleWysiwygHtml}
						isDetail
						isComplex
						isWysiwyg
					/>
				</div>
			)}
			{!!technicalInfoUrl && (
				<div className={styles.infoBox}>
					<a
						href={technicalInfoUrl}
						target="_blank"
						rel="noreferrer"
						className={styles.link}
					>
						{t(
							'pages.productDetail.complex.basicInformation.technicalInformation'
						)}
					</a>
				</div>
			)}
		</>
	);
};
BasicInformation.displayName = 'BasicInformation';
