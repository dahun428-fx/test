import React, { forwardRef } from 'react';
import styles from './SpecList.module.scss';
import { CadTypeListSpec } from '@/components/mobile/domain/specs/CadTypeListSpec';
import { ImageListSpec } from '@/components/mobile/domain/specs/ImageListSpec';
import { NumericSpec } from '@/components/mobile/domain/specs/NumericSpec';
import { TextListSpec } from '@/components/mobile/domain/specs/TextListSpec';
import { TreeSpec } from '@/components/mobile/domain/specs/TreeSpec';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import {
	CadType,
	PartNumberSpec,
	SpecViewType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { hidden, notHidden } from '@/utils/domain/spec';
import { isSpecHidden } from '@/utils/spec';

type Props = {
	specList: PartNumberSpec[];
	cadTypeList: CadType[];
	onChange: (payload: ChangePayload) => void;
	className?: string;
};

export const SpecList = forwardRef<HTMLUListElement, Props>(
	({ specList, cadTypeList, onChange, className }, ref) => {
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
									<li className={styles.item} key={spec.specCode}>
										<TextListSpec spec={spec} onChange={onChange} />
									</li>
								);
							case SpecViewType.IMAGE_SINGLE_LINE:
							case SpecViewType.IMAGE_DOUBLE_LINE:
							case SpecViewType.IMAGE_TRIPLE_LINE:
								return (
									<li className={styles.item} key={spec.specCode}>
										<ImageListSpec spec={spec} onChange={onChange} />
									</li>
								);

							case SpecViewType.NUMERIC:
								return spec.numericSpec == null ||
									hidden(spec.numericSpec) ? null : (
									<li className={styles.item} key={spec.specCode}>
										<NumericSpec spec={spec} onChange={onChange} />
									</li>
								);
							case SpecViewType.TREE:
								return (
									<li className={styles.item} key={spec.specCode}>
										<TreeSpec spec={spec} onChange={onChange} />
									</li>
								);
							default:
								return null;
						}
					})}

				{cadTypeList.some(notHidden) && (
					<li className={styles.item} key="cad">
						<CadTypeListSpec cadTypeList={cadTypeList} onChange={onChange} />
					</li>
				)}
			</ul>
		);
	}
);
SpecList.displayName = 'SpecList';
