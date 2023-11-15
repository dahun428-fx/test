import React, { useMemo } from 'react';
import styles from './SeriesLabels.module.scss';
import { Label, SaleLabel } from '@/components/pc/ui/labels';
import { Pict } from '@/components/pc/ui/labels/Pict';
import { IconType as IconTypeEnum } from '@/models/api/constants/IconType';
import { IconType, Pict as PictType } from '@/models/api/msm/ect/series/shared';
import { removeDiscountFromPictList } from '@/utils/domain/pict';

type Props = {
	campaignEndDate?: string;
	iconTypeList?: IconType[];
	pictList?: PictType[];
	displayIconTypes?: IconTypeEnum[];
};

/**
 * Series labels
 */
export const SeriesLabels: React.VFC<Props> = ({
	campaignEndDate,
	iconTypeList = [],
	pictList = [],
	displayIconTypes = [],
}) => {
	const sortedIconTypeList = useMemo(() => {
		return [
			...iconTypeList.filter(icon => icon.iconType === '1003'), // MSDS
			...iconTypeList.filter(icon => icon.iconType !== '1003'), // w/o MSDS
		].filter(
			icon =>
				icon.iconType &&
				(displayIconTypes.length === 0 ||
					displayIconTypes.includes(icon.iconType))
		);
	}, [displayIconTypes, iconTypeList]);

	if (campaignEndDate && !iconTypeList.length && !pictList.length) {
		return null;
	}

	return (
		<ul className={styles.labelList}>
			{campaignEndDate && (
				<li className={styles.label}>
					<SaleLabel saleEndDate={campaignEndDate} />
				</li>
			)}
			{sortedIconTypeList.map(({ iconType, iconTypeDisp }) => (
				<li className={styles.label} key={iconType}>
					<Label theme="standard">{iconTypeDisp}</Label>
				</li>
			))}
			{removeDiscountFromPictList(pictList).map(({ pict, pictComment }) => (
				<li className={styles.label} key={pict}>
					<Pict pict={pict} comment={pictComment} />
				</li>
			))}
		</ul>
	);
};
SeriesLabels.displayName = 'SeriesLabels';
