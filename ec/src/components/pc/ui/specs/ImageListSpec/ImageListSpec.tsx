import classNames from 'classnames';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import styles from './ImageListSpec.module.scss';
import { SpecFrame } from '@/components/pc/ui/specs/SpecFrame';
import { PopoverTrigger } from '@/components/pc/ui/specs/SpecPopover';
import { Flag } from '@/models/api/Flag';
import {
	PartNumberSpec,
	SpecViewType,
	SupplementType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SeriesSpec } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { imagesLoaded } from '@/utils/domain/image';
import { findSpecValue, selected } from '@/utils/domain/spec';
import { normalize } from '@/utils/domain/spec/normalize';
import { SendLogPayload, SpecValue } from '@/utils/domain/spec/types';
import { notNull } from '@/utils/predicate';
import { removeTags } from '@/utils/string';

type SpecCode = string;
type SpecValues = string[];

const Theme = {
	IMAGE_SINGLE_LINE: 'imageSingleLine',
	IMAGE_DOUBLE_LINE: 'imageDoubleLine',
	ZOOM: 'zoom',
} as const;
type Theme = typeof Theme[keyof typeof Theme];

export type Props = {
	spec: PartNumberSpec | SeriesSpec;
	maxHeight?: boolean;
	isCategory?: boolean;
	className?: string;
	onChange: (
		selectedSpecs: Record<SpecCode, SpecValues>,
		isClear?: boolean
	) => void;
	sendLog?: (payload: SendLogPayload) => void;
};

/**
 * Image List spec checkbox list
 */
export const ImageListSpec: React.VFC<Props> = ({
	spec,
	maxHeight = true,
	isCategory,
	onChange,
	sendLog,
}) => {
	const specFrameRef = useRef(null);
	const normalizedSpec = useMemo(() => normalize(spec), [spec]);
	const [isImagesLoaded, setIsImagesLoaded] = useState(false);
	const { specCode, specViewType, supplementType } = normalizedSpec;
	const specValueList = useMemo(
		() =>
			normalizedSpec.specValueList.filter(specValue =>
				Flag.isFalse(specValue.hiddenFlag)
			),
		[normalizedSpec.specValueList]
	);
	const [checkedSpecValues, setCheckedSpecValues] = useState<SpecValues>([]);

	const theme = useMemo(() => {
		switch (specViewType) {
			case SpecViewType.IMAGE_SINGLE_LINE:
				return Theme.IMAGE_SINGLE_LINE;
			case SpecViewType.IMAGE_DOUBLE_LINE:
			case SpecViewType.IMAGE_TRIPLE_LINE:
				return Theme.IMAGE_DOUBLE_LINE;
			default:
				return Theme.IMAGE_DOUBLE_LINE;
		}
	}, [specViewType]);

	useEffect(() => {
		setCheckedSpecValues(
			specValueList.filter(selected).map(specValue => specValue.specValue)
		);
	}, [specValueList]);

	// wait for images to load before rendering
	useEffect(() => {
		const imageUrls = specValueList.map(value => value.specValueImageUrl);
		imagesLoaded(imageUrls.filter(notNull)).then(() => setIsImagesLoaded(true));
	}, [specValueList]);

	const handleClick = (clickedSpecValue: string) => {
		const newValues = [...checkedSpecValues];

		checkedSpecValues?.includes(clickedSpecValue)
			? newValues.splice(checkedSpecValues.indexOf(clickedSpecValue), 1)
			: newValues.push(clickedSpecValue);

		setCheckedSpecValues(newValues);
		onChange({ [specCode]: newValues });

		const foundSpec = findSpecValue(clickedSpecValue, specValueList);
		if (foundSpec) {
			sendLog?.({
				specName: normalizedSpec.specName,
				specValueDisp: foundSpec.specValueDisp,
				selected: !Flag.isTrue(foundSpec.selectedFlag), // toggle
			});
		}
	};

	const handleClear = useCallback(() => {
		onChange({ [specCode]: [] }, true);
	}, [onChange, specCode]);

	if (!isImagesLoaded) {
		return null;
	}

	return (
		<SpecFrame
			{...normalizedSpec}
			maxHeight={maxHeight}
			onClear={handleClear}
			ref={specFrameRef}
		>
			<SpecImageSelect
				specValueList={specValueList}
				checkedSpecValues={checkedSpecValues}
				theme={theme}
				onClickSpec={handleClick}
				// NOTE: ImageListSpec is shared by SpecPanel and needs to be overwritten
				className={styles.maxHeight}
			/>
			{supplementType === SupplementType.ZOOM_IMAGE && (
				<PopoverTrigger
					isCategory={isCategory}
					spec={normalizedSpec}
					frameRef={specFrameRef}
					onClear={handleClear}
				>
					<SpecImageSelect
						specValueList={specValueList}
						checkedSpecValues={checkedSpecValues}
						theme={Theme.ZOOM}
						onClickSpec={handleClick}
					/>
				</PopoverTrigger>
			)}
		</SpecFrame>
	);
};
ImageListSpec.displayName = 'ImageListSpec';

/**
 * Spec image select
 */
const SpecImageSelect: React.VFC<{
	specValueList: SpecValue[];
	checkedSpecValues: SpecValues;
	theme: Theme;
	onClickSpec: (clickedSpecValue: string) => void;
	className?: string;
}> = ({ specValueList, checkedSpecValues, theme, onClickSpec, className }) => {
	const displayAllSpecValues =
		theme === Theme.ZOOM || checkedSpecValues.length === 0;
	const isSingleLine = theme === Theme.IMAGE_SINGLE_LINE;

	const getCheckboxStyle = useCallback(
		(specValue: string) => {
			return {
				[String(styles.checkboxDefault)]: true,
				[String(styles.checked)]: checkedSpecValues.includes(specValue),
				[String(styles.noCheck)]: !checkedSpecValues.includes(specValue),
			};
		},
		[checkedSpecValues]
	);

	return (
		<div className={classNames(styles.container, className)}>
			<ul className={styles.specListLayoutContainer}>
				{specValueList.map(
					specItem =>
						(displayAllSpecValues ||
							checkedSpecValues.includes(specItem.specValue)) && (
							<li
								key={specItem.specValue}
								className={classNames(
									styles.listItemDefault,
									styles[theme],
									isSingleLine ? getCheckboxStyle(specItem.specValue) : null
								)}
								onClick={() => onClickSpec(specItem.specValue)}
							>
								<div className={styles.specImageWrapper}>
									{/* NOTE: When using next/image, app crashed due to image URLs with no http(s) or malformed URLs */}
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={specItem.specValueImageUrl}
										alt={removeTags(specItem.specValueDisp)}
										className={
											theme === Theme.ZOOM
												? styles.zoomSpecImage
												: styles.specImage
										}
									/>
								</div>
								<div
									className={classNames(
										styles.specValueDisp,
										isSingleLine ? null : getCheckboxStyle(specItem.specValue)
									)}
									dangerouslySetInnerHTML={{ __html: specItem.specValueDisp }}
								/>
							</li>
						)
				)}
			</ul>
		</div>
	);
};
SpecImageSelect.displayName = 'SpecImageSelect';
