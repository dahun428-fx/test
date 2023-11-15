import classNames from 'classnames';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TextSpecSelect.module.scss';
import { TextField } from '@/components/pc/ui/fields/TextField';
import { Checkbox } from '@/components/pc/ui/specs/checkboxes/Checkbox';
import { NumericSpecField } from '@/components/pc/ui/specs/fields/NumericSpecField';
import { Flag } from '@/models/api/Flag';
import { SpecViewType } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SupplementType } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { findSpecValue, notHidden, selected } from '@/utils/domain/spec';
import { isAvailableNumericSpec } from '@/utils/domain/spec/normalize';
import { NormalizedSpec, SendLogPayload } from '@/utils/domain/spec/types';

type SpecCode = string;
type SpecValues = string[];

export type Props = {
	spec: NormalizedSpec;
	text?: string;
	// TODO: Refactor and remove hidePopoverTextFilter prop.
	//       Separate to normal and alteration spec components.
	hidePopoverTextFilter?: boolean;
	onChange: (selectedSpecs: Record<SpecCode, SpecValues>) => void;
	onBlur: (specValue: string) => void;
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
 * Text spec select
 */
export const TextSpecSelect: React.VFC<Props> = ({
	spec,
	text: refinedText,
	hidePopoverTextFilter,
	onChange,
	onBlur,
	sendLog,
	isBreakWordForText,
}) => {
	const { t } = useTranslation();
	const { specCode, specViewType, supplementType } = spec;

	const columnClass = useMemo(() => {
		switch (spec.specViewType) {
			case SpecViewType.TEXT_SINGLE_LINE:
				return styles.singleColumn;
			case SpecViewType.TEXT_DOUBLE_LINE:
				return styles.doubleColumn;
			case SpecViewType.TEXT_TRIPLE_LINE:
			case SpecViewType.TEXT_BUTTON:
			case SpecViewType.LIST:
				return styles.tripleColumn;
			default:
				return '';
		}
	}, [spec.specViewType]);

	const [checkedSpecValues, setCheckedSpecValues] = useState<SpecValues>([]);
	const [text, setText] = useState(refinedText ?? '');

	const handleChange = (value: string) => {
		setText(value.trim());
	};

	const specValueList = useMemo(
		() => spec.specValueList.filter(notHidden),
		[spec.specValueList]
	);

	const shouldRenderImage = useMemo(() => {
		const hasImageUrl = specValueList.some(value => value.specValueImageUrl);

		return hasImageUrl && supplementType === SupplementType.ILLUSTRATION;
	}, [specValueList, supplementType]);

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
					// popover also includes already selected items in the filter
					checkedSpecValues.includes(specValue.specValue) ||
					Flag.isTrue(specValue.defaultFlag)
			),
		[checkedSpecValues, specValueList, text]
	);

	const handleClick = (clickedSpecValue: string) => {
		const foundSpec = findSpecValue(clickedSpecValue, specValueList);
		if (foundSpec) {
			sendLog?.({
				specName: spec.specName,
				specValueDisp: foundSpec.specValueDisp,
				selected: !Flag.isTrue(foundSpec.selectedFlag),
			});
		}

		toggleValue(clickedSpecValue);
	};

	const handleBlurNumericInput = (value: string) => {
		toggleValue(value);
		onBlur(value);
	};

	const toggleValue = (clickedSpecValue: string) => {
		const newValues = [...checkedSpecValues];

		checkedSpecValues?.includes(clickedSpecValue)
			? newValues.splice(checkedSpecValues.indexOf(clickedSpecValue), 1)
			: newValues.push(clickedSpecValue);

		setCheckedSpecValues(newValues);
		onChange({ [specCode]: newValues });
	};
	return (
		<>
			{!hidePopoverTextFilter &&
				specViewType === SpecViewType.LIST &&
				!isAvailableNumericSpec(spec) && (
					<div>
						<TextField
							value={text}
							placeholder={t(
								'components.ui.specs.textListSpec.refineTextPlaceholder'
							)}
							className={styles.refineText}
							onChange={handleChange}
						/>
					</div>
				)}
			<ul className={styles.specValueList}>
				{refinedSpecValues.map(specValue => (
					<Fragment key={specValue.specValue}>
						{shouldRenderImage ? (
							<li
								onClick={() => handleClick(specValue.specValue)}
								className={styles.listItemDefault}
							>
								<div className={styles.imageWrapper}>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										className={styles.specValueImage}
										src={specValue.specValueImageUrl}
										// NOTE: When using next/image, app crashed due to image URLs with no http(s) or malformed URLs
										alt=""
									/>
								</div>
								<div
									className={classNames([
										styles.checkbox,
										{
											[String(styles.checked)]: checkedSpecValues.includes(
												specValue.specValue
											),
										},
									])}
									dangerouslySetInnerHTML={{ __html: specValue.specValueDisp }}
								/>
							</li>
						) : (
							<Checkbox
								className={columnClass}
								checked={checkedSpecValues.includes(specValue.specValue)}
								disabled={Flag.isTrue(specValue.defaultFlag)}
								onClick={() => handleClick(specValue.specValue)}
								isBreakWordForText={isBreakWordForText}
							>
								<span
									dangerouslySetInnerHTML={{ __html: specValue.specValueDisp }}
								/>
							</Checkbox>
						)}
					</Fragment>
				))}
			</ul>
			{isAvailableNumericSpec(spec) && (
				<NumericSpecField spec={spec} onBlur={handleBlurNumericInput} />
			)}
		</>
	);
};
TextSpecSelect.displayName = 'TextSpecSelect';
