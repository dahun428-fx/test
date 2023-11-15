import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './TextListSpec.module.scss';
import { SpecFrame } from '@/components/mobile/domain/specs/SpecFrame';
import { Checkbox } from '@/components/mobile/domain/specs/checkboxes';
import { NumericSpecField } from '@/components/mobile/domain/specs/fields/NumericSpecField';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { Flag } from '@/models/api/Flag';
import {
	AlterationSpec,
	PartNumberSpec,
	SpecValue,
	SpecViewType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SeriesSpec } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { assertNotNull } from '@/utils/assertions';
import { notHidden, selected } from '@/utils/domain/spec';
import { getNumericSpecLogList } from '@/utils/domain/spec/logs';
import {
	isAvailableNumericSpec,
	useNormalizeSpec,
} from '@/utils/domain/spec/normalize';

type SpecValueList = string[];

export type Props = {
	spec: PartNumberSpec | AlterationSpec | SeriesSpec;
	onChange: (payload: ChangePayload) => void;
};

export const TextListSpec: React.VFC<Props> = ({ spec, onChange }) => {
	const normalizedSpec = useNormalizeSpec(spec);
	const { specCode } = normalizedSpec;
	const [checkedSpecValueList, setCheckedSpecValueList] =
		useState<SpecValueList>([]);

	const specValueList = useMemo(() => {
		return normalizedSpec.specValueList.filter(notHidden);
	}, [normalizedSpec.specValueList]);

	useEffect(() => {
		setCheckedSpecValueList(
			specValueList.filter(selected).map(specValue => specValue.specValue)
		);
	}, [specValueList]);

	const handleClick = useCallback(
		({ specValue, specValueDisp, selectedFlag }: SpecValue) => {
			const foundValue = specValueList.find(
				value => specValue === value.specValue
			);
			assertNotNull(foundValue);

			const newList = [...checkedSpecValueList];

			checkedSpecValueList?.includes(specValue)
				? newList.splice(checkedSpecValueList.indexOf(specValue), 1)
				: newList.push(specValue);

			setCheckedSpecValueList(newList);
			onChange({
				selectedSpecs: { [specCode]: newList },
				log: {
					specName: spec.specName,
					specValueDisp,
					selected: !Flag.isTrue(selectedFlag),
				},
			});
		},
		[specValueList, checkedSpecValueList, onChange, specCode, spec.specName]
	);

	/** Blur handler of numeric spec field */
	const handleBlur = useCallback(
		(specValue: string) => {
			onChange(
				specValue === ''
					? {
							selectedSpecs: {
								[specCode]: [...checkedSpecValueList],
							},
							log: getNumericSpecLogList(specValue, normalizedSpec),
					  }
					: {
							// numeric spec を変化させてもその1つに選択を絞り込まない。
							// 現在の選択に加えて、numeric spec の入力を追加する形で型番検索APIを呼び出す
							selectedSpecs: {
								[specCode]: [...checkedSpecValueList, specValue],
							},
							log: getNumericSpecLogList(specValue, normalizedSpec),
					  }
			);
		},
		[checkedSpecValueList, normalizedSpec, onChange, specCode]
	);

	const handleClear = useCallback(() => {
		onChange({ selectedSpecs: { [specCode]: [] } });
	}, [onChange, specCode]);

	return (
		<SpecFrame {...normalizedSpec} onClear={handleClear}>
			<ul className={styles.container}>
				{specValueList.map(specValue => {
					const checked = checkedSpecValueList.includes(specValue.specValue);
					const isDefault = Flag.isTrue(specValue.defaultFlag);
					return (
						<li
							key={specValue.specValue}
							className={classNames(styles.item, {
								[String(styles.triple)]:
									spec.specViewType === SpecViewType.TEXT_TRIPLE_LINE,
								[String(styles.double)]:
									spec.specViewType === SpecViewType.TEXT_DOUBLE_LINE,
								[String(styles.typeCode)]: spec.specCode === 'typeCode',
							})}
						>
							<Checkbox
								className={styles.tile}
								checked={checked}
								disabled={isDefault}
								onClick={() => handleClick(specValue)}
							>
								<span
									dangerouslySetInnerHTML={{
										__html: specValue.specValueDisp,
									}}
								/>
							</Checkbox>
						</li>
					);
				})}
			</ul>
			{isAvailableNumericSpec(normalizedSpec) && (
				<div>
					<NumericSpecField spec={normalizedSpec} onBlur={handleBlur} inline />
				</div>
			)}
		</SpecFrame>
	);
};
TextListSpec.displayName = 'TextListSpec';
