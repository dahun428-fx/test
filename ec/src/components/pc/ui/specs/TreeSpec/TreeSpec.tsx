import classNames from 'classnames';
import React, {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import styles from './TreeSpec.module.scss';
import { SpecFrame } from '@/components/pc/ui/specs/SpecFrame';
import { PopoverTrigger } from '@/components/pc/ui/specs/SpecPopover';
import { Checkbox } from '@/components/pc/ui/specs/checkboxes/Checkbox';
import { Flag } from '@/models/api/Flag';
import {
	PartNumberSpec,
	SpecValue,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { notHidden, selected } from '@/utils/domain/spec';
import { normalize } from '@/utils/domain/spec/normalize';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { notEmpty, notNull } from '@/utils/predicate';

type SpecCode = string;
type SpecValues = string[];

const Theme = {
	POPOVER_SPEC: 'popover_spec',
} as const;
type Theme = typeof Theme[keyof typeof Theme];

export type Props = {
	partNumberSpec: PartNumberSpec;
	onChange: (selectedSpecs: Record<SpecCode, SpecValues>) => void;
	sendLog?: (payload: SendLogPayload) => void;
};

function shouldShowSpec(
	checkedSpecValues: SpecValues,
	spec: SpecValue,
	theme?: Theme
) {
	return (
		theme === Theme.POPOVER_SPEC ||
		checkedSpecValues.length === 0 || // スペックが未選択
		checkedSpecValues.includes(spec.specValue) || // 該当スペックが選択
		spec.childSpecValueList?.some(
			child => checkedSpecValues.includes(child.specValue) // 該当スペックの子スペックのいずれかが選択
		)
	);
}

/**
 * Tree spec
 */
export const TreeSpec: React.VFC<Props> = ({
	partNumberSpec,
	onChange,
	sendLog,
}) => {
	const specFrameRef = useRef(null);
	const { specCode } = partNumberSpec;

	const normalizedSpec = useMemo(
		() => normalize(partNumberSpec),
		[partNumberSpec]
	);

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

	const handleClick = (clickedSpecValue: string) => {
		const newValues = [...checkedSpecValues];

		// NOTE: Flatten all childSpecs
		//       Spec as a multi-level nested data tree.
		//       To make it easy to manipulate multi-level nested data, we need to flatten the data.
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
		const foundSpec = [
			// parent specs
			...specValueList,
			// all child specs
			...childSpecs,
		].find(value => value.specValue === clickedSpecValue);

		if (foundSpec) {
			sendLog?.({
				specName: normalizedSpec.specName,
				specValueDisp: foundSpec.specValueDisp,
				selected: !Flag.isTrue(foundSpec.selectedFlag),
			});
		}

		checkedSpecValues?.includes(clickedSpecValue)
			? newValues.splice(checkedSpecValues.indexOf(clickedSpecValue), 1)
			: newValues.push(clickedSpecValue);

		setCheckedSpecValues(newValues);

		onChange({ [specCode]: newValues });
	};

	const handleClear = useCallback(() => {
		setCheckedSpecValues([]);
		onChange({ [specCode]: [] });
	}, [onChange, specCode]);

	return (
		<SpecFrame {...normalizedSpec} ref={specFrameRef} onClear={handleClear}>
			<TreeSpecSelect
				specValueList={specValueList}
				checkedSpecValues={checkedSpecValues}
				handleClick={handleClick}
			/>

			<PopoverTrigger
				spec={normalizedSpec}
				frameRef={specFrameRef}
				onClear={handleClear}
			>
				<TreeSpecSelect
					specValueList={specValueList}
					checkedSpecValues={checkedSpecValues}
					handleClick={handleClick}
					theme={Theme.POPOVER_SPEC}
				/>
			</PopoverTrigger>
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
	theme?: Theme;
	handleClick: (clickedSpecValue: string) => void;
}> = ({ specValueList, checkedSpecValues, theme, handleClick }) => {
	return (
		<div
			className={classNames(
				styles.container,
				theme == Theme.POPOVER_SPEC ? styles.popoverContainer : ''
			)}
		>
			{specValueList.map(spec => (
				<Fragment key={spec.specValue}>
					<div className={styles.specItemContainer}>
						<ul>
							{shouldShowSpec(checkedSpecValues, spec, theme) &&
								(!notEmpty(spec.childSpecValueList) ? (
									<Checkbox
										key={spec.specValue}
										className={styles.specItem}
										checked={checkedSpecValues.includes(spec.specValue)}
										onClick={() => handleClick(spec.specValue)}
									>
										<span
											dangerouslySetInnerHTML={{ __html: spec.specValueDisp }}
										/>
									</Checkbox>
								) : (
									<li
										dangerouslySetInnerHTML={{ __html: spec.specValueDisp }}
									/>
								))}
						</ul>

						{notEmpty(spec.childSpecValueList) && (
							<ul className={styles.specChildList}>
								{spec.childSpecValueList?.map(
									(childSpec, index) =>
										shouldShowSpec(checkedSpecValues, childSpec, theme) && (
											<Checkbox
												key={childSpec.specValue}
												className={classNames(
													styles.specChildItem,
													spec.childSpecValueList?.length === index + 1 &&
														styles.specChildItemLastChild
												)}
												checked={checkedSpecValues.includes(
													childSpec.specValue
												)}
												onClick={() => handleClick(childSpec.specValue)}
											>
												<span
													className={styles.specChildDisp}
													dangerouslySetInnerHTML={{
														__html: childSpec.specValueDisp,
													}}
												/>
											</Checkbox>
										)
								)}
							</ul>
						)}
					</div>
				</Fragment>
			))}
		</div>
	);
};
TreeSpecSelect.displayName = 'TreeSpecSelect';
