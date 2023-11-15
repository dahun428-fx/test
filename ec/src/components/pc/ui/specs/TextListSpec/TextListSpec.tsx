import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TextListSpec.module.scss';
import { TextSpecSelect } from './TextSpecSelect';
import { MIN_SPEC_VALUE_COUNT_TO_SHOW_TEXT_FILTER } from './constants';
import { TextField } from '@/components/pc/ui/fields/TextField';
import { SpecFrame } from '@/components/pc/ui/specs/SpecFrame';
import { PopoverTrigger } from '@/components/pc/ui/specs/SpecPopover';
import { Checkbox } from '@/components/pc/ui/specs/checkboxes/Checkbox';
import { NumericSpecField } from '@/components/pc/ui/specs/fields/NumericSpecField';
import { Flag } from '@/models/api/Flag';
import {
	AlterationSpec,
	PartNumberSpec,
	SpecViewType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SeriesSpec } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import {
	findSpecValue,
	hasSpecVisibilityToggle,
	notHidden,
	selected,
} from '@/utils/domain/spec';
import { sendNumericSpecLog } from '@/utils/domain/spec/logs';
import {
	isAvailableNumericSpec,
	useNormalizeSpec,
} from '@/utils/domain/spec/normalize';
import { NormalizedSpec, SendLogPayload } from '@/utils/domain/spec/types';

type SpecCode = string;
type SpecValues = string[];

export type Props = {
	spec: PartNumberSpec | AlterationSpec | SeriesSpec;
	isCategory?: boolean;
	// TODO: Refactoring.
	//       Separate to TextListSpec and AlterationTextListSpec and
	//       remove hidePopoverTextFilter props.
	hidePopoverTextFilter?: boolean;
	onChange: (
		selectedSpecs: Record<SpecCode, SpecValues>,
		isClear?: boolean
	) => void;
	sendLog?: (payload: SendLogPayload) => void;
	/**
	 * テキストを改行させるとき、true
	 * 現在の対象は、
	 * - メーカーカテゴリー画面[/vona2/maker/[brandCode]/[...categoryCode].pc.tsx]
	 * - カテゴリー画面[/vona2/[...categoryCode].pc.tsx]
	 */
	isBreakWordForText?: boolean;
};

/**
 * Text spec checkbox list
 */
export const TextListSpec: React.VFC<Props> = ({
	spec,
	isCategory,
	hidePopoverTextFilter,
	onChange,
	sendLog,
	isBreakWordForText,
}) => {
	const { t } = useTranslation();

	const frameRef = useRef<HTMLDivElement>(null);
	const normalizedSpec = useNormalizeSpec(spec);

	const { specCode } = normalizedSpec;
	const specValueList = useMemo(
		() => normalizedSpec.specValueList.filter(notHidden),
		[normalizedSpec.specValueList]
	);
	const [checkedSpecValues, setCheckedSpecValues] = useState<SpecValues>([]);
	const [text, setText] = useState('');
	const [numericInputText, setNumericInputText] = useState(
		spec.numericSpec?.specValue ?? ''
	);

	useEffect(() => {
		setCheckedSpecValues(
			specValueList.filter(selected).map(specValue => specValue.specValue)
		);
	}, [specValueList]);

	const refinedSpecValues = useMemo(
		() =>
			specValueList.filter(
				specValue =>
					specValue.specValueDisp
						.toLowerCase()
						.startsWith(text.toLowerCase()) ||
					Flag.isTrue(specValue.defaultFlag)
			),
		[specValueList, text]
	);

	const showsNoFilteredValueWarning =
		specValueList.length > 0 && refinedSpecValues.length === 0;

	const handleClick = (clickedSpecValue: string) => {
		const foundSpec = findSpecValue(clickedSpecValue, specValueList);

		if (foundSpec) {
			sendLog?.({
				specName: normalizedSpec.specName,
				specValueDisp: foundSpec.specValueDisp,
				selected: !Flag.isTrue(foundSpec.selectedFlag),
			});
		}

		toggleValue(clickedSpecValue);
	};

	const handleBlurNumericInput = (value: string) => {
		setNumericInputText(value);

		if (value !== numericInputText) {
			sendNumericSpecLog({
				specValue: value,
				prevSpec: normalizedSpec,
				sendLog: payload => {
					sendLog?.(payload);
				},
			});
			toggleValue(value);
		}
	};

	const toggleValue = (value: string) => {
		const newValues = [...checkedSpecValues];
		checkedSpecValues?.includes(value)
			? newValues.splice(checkedSpecValues.indexOf(value), 1)
			: newValues.push(value);

		setCheckedSpecValues(newValues);
		onChange({ [specCode]: newValues });
	};

	const handleClear = useCallback(() => {
		onChange({ [specCode]: [] }, true);
		setText('');
		setNumericInputText('');
	}, [onChange, specCode]);

	const hideAllUnchecked = hasSpecVisibilityToggle(spec, numericInputText);

	const normalizedSpecWithNumericInputText = useMemo(() => {
		return {
			...normalizedSpec,
			numericSpec: {
				...normalizedSpec.numericSpec,
				specValue: normalizedSpec.numericSpec?.specValue ?? numericInputText,
				hiddenFlag: normalizedSpec.numericSpec?.hiddenFlag ?? Flag.TRUE,
				specValueRangeList:
					normalizedSpec.numericSpec?.specValueRangeList ?? [],
			},
		};
	}, [normalizedSpec, numericInputText]);

	return (
		<SpecFrame
			{...normalizedSpec}
			selectedFlag={
				Flag.isTrue(normalizedSpec.selectedFlag) || numericInputText !== ''
					? Flag.TRUE
					: Flag.FALSE
			}
			ref={frameRef}
			onClear={handleClear}
		>
			{isShowTextFilter(normalizedSpec) && (
				<div>
					<TextField
						value={text}
						placeholder={t(
							'components.ui.specs.textListSpec.refineTextPlaceholder'
						)}
						className={styles.refineText}
						onChange={setText}
					/>
				</div>
			)}
			<div className={styles.container}>
				{showsNoFilteredValueWarning && (
					<div className={styles.noCandidate}>
						{t('components.ui.specs.textListSpec.notCandidate')}
					</div>
				)}
				<ul>
					{refinedSpecValues.map(specValue => {
						const checked = checkedSpecValues.includes(specValue.specValue);
						const isDefault = Flag.isTrue(specValue.defaultFlag);

						if (hideAllUnchecked && !checked) {
							return null;
						}
						return (
							// "checkedSpecValues.length === 0" means "no specValue selected"
							(checkedSpecValues.length === 0 || checked || isDefault) && (
								<Checkbox
									key={specValue.specValue}
									checked={checked}
									disabled={isDefault}
									onClick={() => handleClick(specValue.specValue)}
								>
									<span
										dangerouslySetInnerHTML={{
											__html: specValue.specValueDisp,
										}}
									/>
								</Checkbox>
							)
						);
					})}
				</ul>
			</div>

			<PopoverTrigger
				isCategory={isCategory}
				spec={normalizedSpec}
				onClear={handleClear}
				frameRef={frameRef}
			>
				<TextSpecSelect
					spec={normalizedSpecWithNumericInputText}
					text={text}
					hidePopoverTextFilter={hidePopoverTextFilter}
					onChange={onChange}
					onBlur={handleBlurNumericInput}
					sendLog={sendLog}
					isBreakWordForText={isBreakWordForText}
				/>
			</PopoverTrigger>
			{isAvailableNumericSpec(normalizedSpec) && (
				<div>
					<NumericSpecField
						spec={normalizedSpecWithNumericInputText}
						onBlur={handleBlurNumericInput}
					/>
				</div>
			)}
		</SpecFrame>
	);
};
TextListSpec.displayName = 'TextListSpec';

function isShowTextFilter(spec: NormalizedSpec) {
	// TODO: 候補の絞り込みは詳細画面複雑系の場合は SpecViewType.List に限定しておかないと、
	//       numericSpec のない全てのリスト選択方式についてしまうためこのようにしているが、
	//       category view でも流用する場合はこの部分を再考する必要がある
	if (spec.specViewType !== SpecViewType.LIST || isAvailableNumericSpec(spec)) {
		return false;
	}

	const availableValueList = spec.specValueList.filter(notHidden);
	// selected some spec values
	if (availableValueList.some(selected)) {
		return false;
	}
	// available spec values count is over 7
	return availableValueList.length >= MIN_SPEC_VALUE_COUNT_TO_SHOW_TEXT_FILTER;
}
