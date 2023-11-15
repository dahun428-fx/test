import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './TreeSpec.module.scss';
import { SpecFrame } from '@/components/mobile/domain/specs/SpecFrame';
import { Checkbox } from '@/components/mobile/domain/specs/checkboxes';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { Flag } from '@/models/api/Flag';
import {
	PartNumberSpec,
	SpecValue,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SeriesSpec } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { assertNotNull } from '@/utils/assertions';
import { notHidden, selected } from '@/utils/domain/spec';
import { useNormalizeSpec } from '@/utils/domain/spec/normalize';
import { notEmpty, notNull } from '@/utils/predicate';

type SpecValues = string[];

type ClickPayload = {
	specValue: string;
	specValueDisp: string;
	selectedFlag: Flag;
};

export type Props = {
	spec: PartNumberSpec | SeriesSpec;
	onChange: (payload: ChangePayload) => void;
};

/**
 * Tree spec
 */
export const TreeSpec: React.VFC<Props> = ({ spec, onChange }) => {
	const { specCode } = spec;

	const normalizedSpec = useNormalizeSpec(spec);

	const specValueList = useMemo(
		() => normalizedSpec.specValueList.filter(notHidden),
		[normalizedSpec.specValueList]
	);
	const [checkedSpecValues, setCheckedSpecValues] = useState<SpecValues>([]);

	useEffect(() => {
		setCheckedSpecValues([
			...specValueList.filter(selected).map(specValue => specValue.specValue),
			...specValueList
				.flatMap(spec => spec.childSpecValueList)
				.filter(notNull)
				.filter(selected)
				.map(value => value.specValue),
		]);
	}, [specValueList]);

	const handleClick = useCallback(
		({ specValue, specValueDisp, selectedFlag }: ClickPayload) => {
			// flatten all childSpecs
			const childSpecs = specValueList
				.map(spec =>
					spec.childSpecValueList
						? spec.childSpecValueList.map(childSpec => {
								return { ...childSpec };
						  })
						: []
				)
				.reduce((previousSpec, currentSpec) => {
					return previousSpec.concat(currentSpec);
				});

			// find on current specs and in children
			const foundValue = [
				// parent specs
				...specValueList,
				// all child specs
				...childSpecs,
			].find(value => specValue === value.specValue);

			assertNotNull(foundValue);

			const newValues = [...checkedSpecValues];

			checkedSpecValues?.includes(specValue)
				? newValues.splice(checkedSpecValues.indexOf(specValue), 1)
				: newValues.push(specValue);

			setCheckedSpecValues(newValues);

			onChange({
				selectedSpecs: { [specCode]: newValues },
				log: {
					specName: normalizedSpec.specName,
					specValueDisp: specValueDisp,
					selected: !Flag.isTrue(selectedFlag),
				},
			});
		},
		[
			checkedSpecValues,
			normalizedSpec.specName,
			onChange,
			specCode,
			specValueList,
		]
	);

	const handleClear = useCallback(() => {
		setCheckedSpecValues([]);
		onChange({ selectedSpecs: { [specCode]: [] } });
	}, [onChange, specCode]);

	return (
		<SpecFrame {...normalizedSpec} onClear={handleClear}>
			<TreeSpecSelect
				specValueList={specValueList}
				checkedSpecValues={checkedSpecValues}
				onClick={handleClick}
			/>
		</SpecFrame>
	);
};

TreeSpec.displayName = 'TreeSpec';

/**
 * Spec Tree Select
 */
const TreeSpecSelect: React.VFC<{
	specValueList: SpecValue[];
	checkedSpecValues: SpecValues;
	onClick: (payload: ClickPayload) => void;
}> = ({ specValueList, checkedSpecValues, onClick }) => {
	return (
		<ul className={styles.container}>
			{specValueList.filter(notHidden).map(spec =>
				!notEmpty(spec.childSpecValueList) ? (
					<li key={spec.specValue} className={styles.specItemWithNoChildren}>
						<Checkbox
							checked={checkedSpecValues.includes(spec.specValue)}
							onClick={() => onClick(spec)}
						>
							<span
								dangerouslySetInnerHTML={{
									__html: spec.specValueDisp,
								}}
							/>
						</Checkbox>
					</li>
				) : (
					<li key={spec.specValue} className={styles.specItemWithChildren}>
						<ul>
							<li
								dangerouslySetInnerHTML={{
									__html: spec.specValueDisp,
								}}
							/>
						</ul>
						<ul className={styles.specChildList}>
							{spec.childSpecValueList?.filter(notHidden).map(childSpec => (
								<li key={childSpec.specValue} className={styles.specChildItem}>
									<Checkbox
										checked={checkedSpecValues.includes(childSpec.specValue)}
										onClick={() => onClick(childSpec)}
									>
										<span
											dangerouslySetInnerHTML={{
												__html: childSpec.specValueDisp,
											}}
										/>
									</Checkbox>
								</li>
							))}
						</ul>
					</li>
				)
			)}
		</ul>
	);
};

TreeSpecSelect.displayName = 'TreeSpecSelect';
