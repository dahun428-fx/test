import React, { memo, useMemo } from 'react';
import { MinOrderQuantityCell } from './MinOrderQuantityCell';
import { PartNumberSpecCell } from './PartNumberSpecCell';
import styles from './PartNumberSpecCells.module.scss';
import { Link } from '@/components/pc/ui/links';
import { Flag } from '@/models/api/Flag';
import { RoHSType } from '@/models/api/constants/RoHSType';
import {
	RelatedLink,
	RelatedLinkType,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { rohsFlagDisp } from '@/utils/domain/rohs';

type SpecCode = string;
type SpecValue = string;

type Props = {
	specList: Spec[];
	specValues: Record<SpecCode, SpecValue | undefined>;
	relatedLinkFrameFlag: Flag;
	relatedLinkList: RelatedLink[];
	rohsFrameFlag: Flag;
	rohsFlag?: RoHSType;
	minQuantity?: number;
	piecesPerPackage?: number;
};

export const PartNumberSpecCells = memo<Props>(
	({
		specList,
		specValues,
		relatedLinkFrameFlag,
		relatedLinkList,
		rohsFrameFlag,
		rohsFlag,
		minQuantity,
		piecesPerPackage,
	}) => {
		const sdsLinkList = useMemo(() => {
			return relatedLinkList.filter(
				link =>
					link.relatedLinkType &&
					Array.of<string>(
						RelatedLinkType.MSDS,
						RelatedLinkType.DATA_SHEET
					).includes(link.relatedLinkType)
			);
		}, [relatedLinkList]);

		return (
			<>
				{/* SDS Files */}
				{Flag.isTrue(relatedLinkFrameFlag) && (
					<td className={styles.dataCell}>
						<div className={styles.data}>
							{!sdsLinkList.length ? (
								<p>-</p>
							) : (
								sdsLinkList.map((link, index) => (
									<p key={index}>
										<Link
											href={link.relatedInfoUrl ?? ''}
											target="_blank"
											onClick={event => event.stopPropagation()}
										>
											{link.relatedLinkTypeDisp ?? ''}
										</Link>
									</p>
								))
							)}
						</div>
					</td>
				)}
				{/* Specs */}
				{specList.map(spec => (
					<PartNumberSpecCell
						key={spec.specCode}
						specValue={specValues[spec.specCode]}
					/>
				))}
				{/* RoHS */}
				{Flag.isTrue(rohsFrameFlag) && (
					<td className={styles.dataCell}>
						<div className={styles.data}>{rohsFlagDisp(rohsFlag)}</div>
					</td>
				)}
				{/* Minimum Order Quantity */}
				<MinOrderQuantityCell
					minQuantity={minQuantity}
					piecesPerPackage={piecesPerPackage}
				/>
			</>
		);
	}
);
PartNumberSpecCells.displayName = 'PartNumberSpecCells';
