import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SeriesLabels.module.scss';
import { Label, SaleLabel } from '@/components/pc/ui/labels';
import { Pict } from '@/components/pc/ui/labels/Pict';
import { Flag } from '@/models/api/Flag';
import { IconType as IconTypeEnum } from '@/models/api/constants/IconType';
import { IconType, Pict as PictType } from '@/models/api/msm/ect/series/shared';
import { removeDiscountFromPictList } from '@/utils/domain/pict';

type Props = {
	campaignEndDate?: string;
	recommendFlag?: Flag;
	gradeTypeDisp?: string;
	iconTypeList?: IconType[];
	pictList?: PictType[];
	gradeType?: string;
};

/**
 * Series labels
 */
export const SeriesLabels: React.VFC<Props> = ({
	campaignEndDate,
	recommendFlag,
	gradeTypeDisp,
	iconTypeList = [],
	pictList = [],
	gradeType,
}) => {
	const [t] = useTranslation();
	const sortedIconTypeList = useMemo(() => {
		return [
			...iconTypeList.filter(icon => icon.iconType === IconTypeEnum.MSDS), // MSDS
			...iconTypeList.filter(icon => icon.iconType !== IconTypeEnum.MSDS), // w/o MSDS
		];
	}, [iconTypeList]);

	if (
		gradeType !== '' ||
		campaignEndDate !== '' ||
		sortedIconTypeList.length > 0 ||
		pictList.length > 0
	) {
		return (
			<ul className={styles.labelList}>
				{campaignEndDate && (
					<li className={styles.label}>
						<SaleLabel saleEndDate={campaignEndDate} />
					</li>
				)}
				{Flag.isTrue(recommendFlag) && (
					<li className={styles.label}>
						<Label theme="grade">
							{t(
								'components.domain.category.seriesList.seriesLabels.recommendation'
							)}
						</Label>
					</li>
				)}
				{gradeTypeDisp && (
					<li className={styles.label}>
						<Label theme="grade">{gradeTypeDisp}</Label>
					</li>
				)}
				{sortedIconTypeList.map(({ iconType, iconTypeDisp }) => (
					<li className={styles.label} key={iconType}>
						<Label theme="standard">{iconTypeDisp}</Label>
					</li>
				))}
				{removeDiscountFromPictList(pictList).map(
					({ pict, pictComment }, index) => (
						<li className={styles.label} key={index}>
							<Pict pict={pict} comment={pictComment} />
						</li>
					)
				)}
			</ul>
		);
	}

	return null;
};
SeriesLabels.displayName = 'SeriesLabels';
