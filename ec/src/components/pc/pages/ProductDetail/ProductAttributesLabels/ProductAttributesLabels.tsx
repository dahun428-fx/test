import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductAttributesLabels.module.scss';
import { Label, SaleLabel } from '@/components/pc/ui/labels';
import { Flag } from '@/models/api/Flag';
import { IconType } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse';
import { getDaysToShipMessage } from '@/utils/domain/daysToShip';

type Props = {
	userCampaignApplyFlag?: Flag;
	iconTypeList?: IconType[];
	discontinuedProductFlag?: Flag;
	campaignEndDate?: string;
	gradeTypeDisp?: string;
	minStandardDaysToShip?: number;
	minShortestDaysToShip?: number;
	maxStandardDaysToShip?: number;
};

export const ProductAttributesLabels: React.VFC<Props> = ({
	iconTypeList,
	discontinuedProductFlag,
	campaignEndDate,
	gradeTypeDisp,
	minStandardDaysToShip,
	minShortestDaysToShip,
	maxStandardDaysToShip,
}) => {
	const [t] = useTranslation();

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

	const daysToShipMessage = getDaysToShipMessage(
		{ minStandardDaysToShip, minShortestDaysToShip, maxStandardDaysToShip },
		t
	);

	/**
	 * 表示するデータがないとき、コンポーネントを表示しない => true
	 * 1ms以下の処理なので、useMemo不使用
	 */
	const isNotDisplay: boolean =
		campaignEndDate === undefined &&
		gradeTypeDisp === undefined &&
		iconList.length < 1 &&
		!daysToShipMessage;

	if (isNotDisplay) {
		return null;
	}

	return (
		<ul className={styles.iconListItemWrapper}>
			{Flag.isTrue(discontinuedProductFlag) && (
				<li className={styles.iconListItem}>
					<Label theme="disabled">
						{t('pages.productDetail.productAttributesLabels.discontinued')}
					</Label>
				</li>
			)}
			{!!campaignEndDate && (
				<li className={styles.iconListItem}>
					<SaleLabel saleEndDate={campaignEndDate} />
				</li>
			)}
			{gradeTypeDisp && (
				<li className={styles.iconListItem}>
					<Label theme="grade">{gradeTypeDisp}</Label>
				</li>
			)}

			{iconList.map((icon, index) => (
				<li key={index} className={styles.iconListItem}>
					<Label theme="iconList">{icon.iconTypeDisp}</Label>
				</li>
			))}

			{Flag.isFalse(discontinuedProductFlag) && daysToShipMessage && (
				<li className={styles.iconListItem}>
					<Label theme="dayToShip">{daysToShipMessage}</Label>
				</li>
			)}
		</ul>
	);
};
