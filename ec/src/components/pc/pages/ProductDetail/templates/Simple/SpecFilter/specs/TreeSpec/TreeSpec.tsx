import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './TreeSpec.module.scss';
import { SpecFrame } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/SpecFrame';
import { Checkbox } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/checkboxes/Checkbox';
import { Flag } from '@/models/api/Flag';
import {
	PartNumberSpec,
	SpecValue,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { assertNotNull } from '@/utils/assertions';
import { hidden, selected } from '@/utils/domain/spec';
import { useNormalizeSpec } from '@/utils/domain/spec/normalize';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { notEmpty, notNull } from '@/utils/predicate';

type SpecCode = string;
type SpecValues = string[];

type ClickPayload = {
	specValue: string;
	specValueDisp: string;
	selectedFlag: Flag;
};

export type Props = {
	partNumberSpec: PartNumberSpec;
	onChange: (selectedSpecs: Record<SpecCode, SpecValues>) => void;
	onSelectHiddenSpec: (selectedSpec: Record<SpecCode, string>) => void;
	sendLog: (payload: SendLogPayload) => void;
};

/**
 * Tree spec
 */
export const TreeSpec: React.VFC<Props> = ({
	partNumberSpec,
	onChange,
	onSelectHiddenSpec,
	sendLog,
}) => {
	const { specCode } = partNumberSpec;

	const normalizedSpec = useNormalizeSpec(partNumberSpec);

	const specValueList = useMemo(
		() => normalizedSpec.specValueList,
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

			sendLog({
				specName: normalizedSpec.specName,
				specValueDisp,
				selected: !Flag.isTrue(selectedFlag), // toggle
			});

			if (Flag.isTrue(foundValue.hiddenFlag)) {
				setCheckedSpecValues([specValue]);
				return onSelectHiddenSpec({ [specCode]: specValue });
			}

			const newValues = [...checkedSpecValues];

			checkedSpecValues?.includes(specValue)
				? newValues.splice(checkedSpecValues.indexOf(specValue), 1)
				: newValues.push(specValue);

			setCheckedSpecValues(newValues);

			onChange({ [specCode]: newValues });
		},
		[
			checkedSpecValues,
			normalizedSpec.specName,
			onChange,
			onSelectHiddenSpec,
			sendLog,
			specCode,
			specValueList,
		]
	);

	const handleClear = useCallback(() => {
		setCheckedSpecValues([]);
		onChange({ [specCode]: [] });
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
			{specValueList.map(spec =>
				!notEmpty(spec.childSpecValueList) ? (
					<li key={spec.specValue} className={styles.specItemWithNoChildren}>
						<Checkbox
							checked={checkedSpecValues.includes(spec.specValue)}
							weak={hidden(spec)}
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
							{spec.childSpecValueList?.map(childSpec => (
								<li key={childSpec.specValue} className={styles.specChildItem}>
									<Checkbox
										checked={checkedSpecValues.includes(childSpec.specValue)}
										weak={hidden(childSpec)}
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
