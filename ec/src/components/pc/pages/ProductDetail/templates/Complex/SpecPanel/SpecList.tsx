import React, { forwardRef } from 'react';
import styles from './SpecList.module.scss';
import {
	SpecCode,
	SpecValues,
} from '@/components/pc/pages/ProductDetail/templates/Complex/SpecPanel/types';
import { CadTypeListSpec } from '@/components/pc/ui/specs/CadTypeListSpec';
import { DaysToShipListSpec } from '@/components/pc/ui/specs/DaysToShipListSpec';
import { ImageListSpec } from '@/components/pc/ui/specs/ImageListSpec';
import { NumericSpec } from '@/components/pc/ui/specs/NumericSpec';
import { TextListSpec } from '@/components/pc/ui/specs/TextListSpec';
import { TreeSpec } from '@/components/pc/ui/specs/TreeSpec';
import { Flag } from '@/models/api/Flag';
import {
	CadType,
	DaysToShip,
	PartNumberSpec,
	SpecViewType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { isSpecHidden } from '@/utils/spec';

type Props = {
	specList: PartNumberSpec[];
	daysToShipList: DaysToShip[];
	cadTypeList: CadType[];
	onChange: (spec: Record<SpecCode, SpecValues>) => void;
	className?: string;
	sendLog: (payload: SendLogPayload) => void;
};

export const SpecList = forwardRef<HTMLUListElement, Props>(
	(
		{ specList, daysToShipList, cadTypeList, onChange, className, sendLog },
		ref
	) => {
		return (
			<ul ref={ref} className={className}>
				{specList
					.filter(spec => !isSpecHidden(spec))
					.map(spec => {
						switch (spec.specViewType) {
							case SpecViewType.TEXT_BUTTON:
							case SpecViewType.TEXT_SINGLE_LINE:
							case SpecViewType.TEXT_DOUBLE_LINE:
							case SpecViewType.TEXT_TRIPLE_LINE:
							case SpecViewType.LIST:
								return (
									<li key={spec.specCode} className={styles.specItem}>
										<TextListSpec
											spec={spec}
											onChange={onChange}
											sendLog={sendLog}
										/>
									</li>
								);
							case SpecViewType.IMAGE_SINGLE_LINE:
							case SpecViewType.IMAGE_DOUBLE_LINE:
							case SpecViewType.IMAGE_TRIPLE_LINE:
								return (
									<li key={spec.specCode} className={styles.specItem}>
										<ImageListSpec
											spec={spec}
											maxHeight={false}
											onChange={onChange}
											sendLog={sendLog}
										/>
									</li>
								);
							case SpecViewType.NUMERIC:
								return spec.numericSpec == null ||
									Flag.isTrue(spec.numericSpec.hiddenFlag) ? null : (
									<li key={spec.specCode} className={styles.specItem}>
										<NumericSpec
											spec={spec}
											onChange={onChange}
											sendLog={sendLog}
										/>
									</li>
								);
							case SpecViewType.TREE:
								return (
									<li key={spec.specCode} className={styles.specItem}>
										<TreeSpec
											partNumberSpec={spec}
											onChange={onChange}
											sendLog={sendLog}
										/>
									</li>
								);
							default:
								return null;
						}
					})}

				{cadTypeList.some(cadType => Flag.isFalse(cadType.hiddenFlag)) && (
					<li className={styles.specItem}>
						<CadTypeListSpec
							cadTypeList={cadTypeList}
							onChange={onChange}
							sendLog={sendLog}
						/>
					</li>
				)}

				{daysToShipList.some(daysToShip =>
					Flag.isFalse(daysToShip.hiddenFlag)
				) && (
					<li className={styles.specItem}>
						<DaysToShipListSpec
							daysToShipList={daysToShipList}
							onChange={onChange}
							sendLog={sendLog}
						/>
					</li>
				)}
			</ul>
		);
	}
);
SpecList.displayName = 'SpecList';
