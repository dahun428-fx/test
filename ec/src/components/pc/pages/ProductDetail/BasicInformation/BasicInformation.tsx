import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useBasicInfo } from './BasicInformation.hooks';
import styles from './BasicInformation.module.scss';
import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';
import { SeriesInfoText } from '@/components/pc/domain/series/SeriesInfoText';

export const BasicInformation: VFC = () => {
	const [t] = useTranslation();

	const {
		showsBasicInfo,
		eleWysiwygHtml,
		catchCopyHtml,
		seriesInfoText,
		technicalInfoUrl,
	} = useBasicInfo();

	if (!showsBasicInfo) {
		return null;
	}

	return (
		<div className={styles.wrapper}>
			<h2 className={styles.sectionHeading} id="detailInfo">
				{t('pages.productDetail.basicInformation.detailInformation')}
			</h2>
			<h3 className={styles.heading}>
				{t('pages.productDetail.basicInformation.basicInformation')}
			</h3>
			{!!catchCopyHtml && (
				<LegacyStyledHtml
					html={catchCopyHtml}
					childHtmlTag="p"
					isDetail
					childClassName={styles.catchCopy}
				/>
			)}
			<SeriesInfoText seriesInfoText={seriesInfoText} />
			{!!eleWysiwygHtml && (
				<div className={styles.infoBox}>
					<LegacyStyledHtml html={eleWysiwygHtml} isDetail isWysiwyg />
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
						{t('pages.productDetail.basicInformation.technicalInformation')}
					</a>
				</div>
			)}
		</div>
	);
};
BasicInformation.displayName = 'BasicInformation';
