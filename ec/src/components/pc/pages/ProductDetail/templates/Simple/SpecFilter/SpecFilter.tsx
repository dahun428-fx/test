import classNames from 'classnames';
import React from 'react';
import styles from './SpecFilter.module.scss';
import { SpecCode, SpecValues } from './SpecFilter.types';
import { DaysToShipListSpec } from './specs/DaysToShipListSpec';
import { ImageListSpec } from './specs/ImageListSpec';
import { TextListSpec } from './specs/TextListSpec';
import { TreeSpec } from './specs/TreeSpec';
import { CadTypeListSpec } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/CadTypeListSpec';
import { NumericSpec } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/NumericSpec';
import { Flag } from '@/models/api/Flag';
import {
	CadType,
	DaysToShip,
	PartNumberSpec,
	SpecViewType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { notEmpty } from '@/utils/predicate';

type Props = {
	specList: PartNumberSpec[];
	cadTypeList: CadType[];
	daysToShipList: DaysToShip[];
	onChange: (spec: Record<SpecCode, SpecValues>) => void;
	onSelectHiddenSpec: (
		spec: Record<SpecCode, string | number | undefined>
	) => void;
	sendLog: (payload: SendLogPayload) => void;
	className?: string;
};

export const SpecFilter: React.VFC<Props> = ({
	specList,
	cadTypeList,
	daysToShipList,
	onChange,
	onSelectHiddenSpec,
	sendLog,
	className,
}) => {
	return (
		<div className={classNames(className, styles.container)}>
			<ul>
				{specList.map(spec => {
					switch (spec.specViewType) {
						case SpecViewType.IMAGE_SINGLE_LINE:
						case SpecViewType.IMAGE_DOUBLE_LINE:
						case SpecViewType.IMAGE_TRIPLE_LINE:
							return (
								<li key={spec.specCode} className={styles.spec}>
									<ImageListSpec
										partNumberSpec={spec}
										onChange={onChange}
										onSelectHiddenSpec={onSelectHiddenSpec}
										sendLog={sendLog}
									/>
								</li>
							);
						case SpecViewType.TEXT_BUTTON:
						case SpecViewType.TEXT_SINGLE_LINE:
						case SpecViewType.TEXT_DOUBLE_LINE:
						case SpecViewType.TEXT_TRIPLE_LINE:
						case SpecViewType.LIST:
							return (
								<li key={spec.specCode} className={styles.spec}>
									<TextListSpec
										spec={spec}
										onChange={onChange}
										onSelectHiddenSpec={onSelectHiddenSpec}
										sendLog={sendLog}
									/>
								</li>
							);
						case SpecViewType.NUMERIC:
							return spec.numericSpec == null ||
								Flag.isTrue(spec.numericSpec.hiddenFlag) ? null : (
								<li key={spec.specCode} className={styles.spec}>
									<NumericSpec
										spec={spec}
										onChange={onChange}
										sendLog={sendLog}
									/>
								</li>
							);
						case SpecViewType.TREE:
							return (
								<li key={spec.specCode} className={styles.spec}>
									<TreeSpec
										partNumberSpec={spec}
										onChange={onChange}
										onSelectHiddenSpec={onSelectHiddenSpec}
										sendLog={sendLog}
									/>
								</li>
							);
						default:
							return null;
					}
				})}
				{notEmpty(cadTypeList) && (
					<li className={styles.spec}>
						<CadTypeListSpec
							cadTypeList={cadTypeList}
							onChange={onChange}
							onSelectHiddenSpec={onSelectHiddenSpec}
							sendLog={sendLog}
						/>
					</li>
				)}
				{notEmpty(daysToShipList) && (
					<li className={styles.spec}>
						<DaysToShipListSpec
							daysToShipList={daysToShipList}
							onChange={onChange}
							onSelectHiddenSpec={onSelectHiddenSpec}
							sendLog={sendLog}
						/>
					</li>
				)}
			</ul>
		</div>
	);
};
SpecFilter.displayName = 'SpecFilter';
