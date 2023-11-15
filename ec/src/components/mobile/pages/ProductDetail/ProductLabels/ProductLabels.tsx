import React, { useMemo } from 'react';
import styles from './ProductLabels.module.scss';
import { Label } from '@/components/mobile/ui/labels';
import { IconType } from '@/models/api/msm/ect/series/shared';

type Props = {
	iconTypeList?: IconType[];
	campaignEndDate?: string;
	className?: string;
};

/**
 * product labels
 */
export const ProductLabels: React.VFC<Props> = ({
	iconTypeList = [],
	campaignEndDate,
	className,
}) => {
	const iconList = useMemo(() => {
		if (!iconTypeList) {
			return [];
		}
		const sdsIcons = iconTypeList.filter(({ iconType }) => iconType === '1003');
		const otherIcons = iconTypeList.filter(
			({ iconType }) => iconType !== '1003'
		);

		return [...sdsIcons, ...otherIcons];
	}, [iconTypeList]);

	if (!iconList.length && campaignEndDate == null) {
		return null;
	}

	return (
		<ul className={className}>
			{iconList.map((icon, index) => (
				<li key={index} className={styles.labelListItem}>
					<Label>{icon.iconTypeDisp}</Label>
				</li>
			))}
		</ul>
	);
};
ProductLabels.displayName = 'ProductLabels';
