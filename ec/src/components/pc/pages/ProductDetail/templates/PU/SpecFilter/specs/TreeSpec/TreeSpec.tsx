import { ParametricUnitPartNumberSpec } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';
import { Flag } from '@/models/api/Flag';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import {
	AlterationSpec,
	SpecValue,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SendLogPayload } from '@/utils/domain/spec/types';
import styles from './TreeSpec.module.scss';
import { notEmpty, notNull } from '@/utils/predicate';
import { RadioButton } from '@/components/pc/ui/specs/RadioButton';
import { useNormalizeSpec } from '@/utils/domain/spec/normalize';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { selected } from '@/utils/domain/spec';
import { assertNotNull } from '@/utils/assertions';

type SpecValues = string[];

type ClickPayload = {
	specValue: string;
	specValueDisp: string;
	selectedFlag: Flag;
};

export type Props = {
	spec: ParametricUnitPartNumberSpec | AlterationSpec;
	onChange: (
		specs: Partial<SearchPartNumberRequest>,
		isHiddenSpec?: boolean
	) => void;
	sendLog: (payload: SendLogPayload) => void;
};

export const TreeSpec: React.VFC<Props> = ({ spec, onChange, sendLog }) => {
	const { specCode } = spec;

	const normalizedSpec = useNormalizeSpec(spec);

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

			setCheckedSpecValues([specValue]);
			const isHidden = Flag.isTrue(foundValue.hiddenFlag);
			onChange({ [specCode]: [specValue] }, isHidden);
		},
		[normalizedSpec.specName, onChange, sendLog, specCode, specValueList]
	);

	return (
		<TreeSpecSelect
			specValueList={specValueList}
			checkedSpecValues={checkedSpecValues}
			onClick={handleClick}
		/>
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
					<div key={spec.specValue} className={styles.specItemWithNoChildren}>
						<RadioButton
							className={styles.tile}
							checked={checkedSpecValues.includes(spec.specValue)}
							onClick={() => onClick(spec)}
						>
							<span>{spec.specValueDisp}</span>
						</RadioButton>
					</div>
				) : (
					<li key={spec.specValue} className={styles.specItemWithChildren}>
						<p>{spec.specValueDisp}</p>
						<ul className={styles.specChildList}>
							{spec.childSpecValueList?.map(childSpec => (
								<div key={childSpec.specValue} className={styles.specChildItem}>
									<RadioButton
										className={styles.tile}
										checked={checkedSpecValues.includes(childSpec.specValue)}
										onClick={() => onClick(childSpec)}
									>
										{childSpec.specValueDisp}
									</RadioButton>
								</div>
							))}
						</ul>
					</li>
				)
			)}
		</ul>
	);
};

TreeSpecSelect.displayName = 'TreeSpecSelect';
