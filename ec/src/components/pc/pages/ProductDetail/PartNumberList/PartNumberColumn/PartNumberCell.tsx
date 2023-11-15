import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PartNumberColumn.module.scss';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Label } from '@/components/pc/ui/labels';
import { Link } from '@/components/pc/ui/links';
import { Flag } from '@/models/api/Flag';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { pagesPath } from '@/utils/$path';

type Props = {
	partNumber: PartNumber;
	seriesCode: string;
	oneMoreCandidates: boolean;
};

export const PartNumberCell = memo<Props>(
	({ partNumber, seriesCode, oneMoreCandidates }) => {
		const { t } = useTranslation();

		return (
			<td className={styles.dataCellBase}>
				{Flag.isTrue(partNumber.discontinuedProductFlag) && (
					<p>
						<Label theme="disabled" className={styles.label}>
							{t(
								'pages.productDetail.partNumberList.partNumberCell.discontinued'
							)}
						</Label>
					</p>
				)}
				<div className={styles.data}>
					{partNumber.innerImage?.url && (
						<ProductImage
							imageUrl={partNumber.innerImage.url}
							preset="t_parts_list_thum"
							size={40}
							comment={partNumber.partNumber}
							className={styles.image}
						/>
					)}
					{!oneMoreCandidates ? (
						<span>{partNumber.partNumber}</span>
					) : Flag.isTrue(partNumber.simpleFlag) ? (
						<Link
							title={partNumber.partNumber}
							onClick={event => event.preventDefault()}
							href={pagesPath.vona2.detail
								._seriesCode(seriesCode)
								.$url({ query: { HissuCode: partNumber.partNumber } })}
						>
							{partNumber.partNumber}
						</Link>
					) : (
						<a className={styles.partNumberLink} title={partNumber.partNumber}>
							{partNumber.partNumber}
						</a>
					)}
				</div>
			</td>
		);
	}
);
PartNumberCell.displayName = 'PartNumberCell';
