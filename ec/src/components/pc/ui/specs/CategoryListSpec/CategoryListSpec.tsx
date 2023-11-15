import React, {
	useMemo,
	useState,
	useCallback,
	useEffect,
	useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CategoryListSpec.module.scss';
import { TextField } from '@/components/pc/ui/fields/TextField';
import {
	CategoryListView,
	CategoryListViewRefType,
} from '@/components/pc/ui/specs/CategoryListSpec/CategoryListView';
import { CategoryPopoverTrigger } from '@/components/pc/ui/specs/CategoryPopover';
import { SpecFrame } from '@/components/pc/ui/specs/SpecFrame';
import { Checkbox } from '@/components/pc/ui/specs/checkboxes/Checkbox';
import { Flag } from '@/models/api/Flag';
import { Category } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { notHidden, selected } from '@/utils/domain/spec';

type CategoryValues = string[];
type SpecCode = string;
type SpecValues = string[];

const MIN_SPEC_VALUE_COUNT_TO_SHOW_TEXT_FILTER = 7;

export type Props = {
	categoryList: Category[];
	onChange: (spec: Record<SpecCode, SpecValues>, isClear?: boolean) => void;
};

/**
 * Category spec checkbox list
 */
export const CategoryListSpec: React.VFC<Props> = ({
	categoryList,
	onChange,
}) => {
	const { t } = useTranslation();

	const frameRef = useRef<HTMLDivElement>(null);
	const categoryListViewRef = useRef<CategoryListViewRefType>(null);
	const [text, setText] = useState('');

	const [checkedCategoryValues, setCheckedCategoryValues] =
		useState<CategoryValues>([]);

	/**  TODO: DEV MODE: if we are using DEV mode (not implemented in Malaysia Mirai PJ yet), then always display everything. 
		(if the hidden flag is "1", then show the item as greyed out and do not let the user select it)	
	*/

	const categoryListValueList = useMemo(() => {
		const categoryListWithFilter = categoryList
			.filter(notHidden)
			.filter(
				category =>
					Flag.isTrue(category.selectedFlag) ||
					category.categoryName.toLowerCase().startsWith(text.toLowerCase())
			);

		if (!categoryListWithFilter.length) {
			return [];
		}

		return categoryListWithFilter;
	}, [categoryList, text]);

	const showsNoFilteredValueWarning =
		categoryList.length > 0 && categoryListValueList.length === 0;

	useEffect(() => {
		setCheckedCategoryValues(
			categoryListValueList
				.filter(selected)
				.map(categoryListValue => categoryListValue.categoryCode)
		);
	}, [categoryListValueList]);

	const handleClick = (clickedCategoryValue: string) => {
		const newValues = [...checkedCategoryValues];

		checkedCategoryValues?.includes(clickedCategoryValue)
			? newValues.splice(checkedCategoryValues.indexOf(clickedCategoryValue), 1)
			: newValues.push(clickedCategoryValue);

		setCheckedCategoryValues(newValues);
		onChange({
			categoryCode: newValues,
		});
	};

	const handleClear = useCallback(() => {
		setCheckedCategoryValues([]);
		onChange({ categoryCode: [] }, true);
		setText('');
		// handle clear for popover as well
		categoryListViewRef.current?.clearCategoryPopoverFilter?.();
	}, [onChange]);

	return (
		<SpecFrame
			specName={t('components.ui.specs.categoryListSpec.categoryListSpecName')}
			selectedFlag={Flag.toFlag(categoryList.filter(selected).length)}
			onClear={handleClear}
			ref={frameRef}
		>
			{isShowTextFilter(categoryList) && (
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
					{categoryListValueList.map(
						categoryItem =>
							(checkedCategoryValues.length === 0 ||
								checkedCategoryValues.includes(categoryItem.categoryCode)) && (
								<Checkbox
									key={categoryItem.categoryCode}
									checked={checkedCategoryValues?.includes(
										categoryItem.categoryCode
									)}
									onClick={() => handleClick(categoryItem.categoryCode)}
								>
									{categoryItem.categoryName} ({categoryItem.seriesCount})
								</Checkbox>
							)
					)}
				</ul>
			</div>
			<CategoryPopoverTrigger
				categoryList={categoryList}
				onClear={handleClear}
				frameRef={frameRef}
			>
				<CategoryListView
					categoryList={categoryList}
					text={text}
					onChange={onChange}
					ref={categoryListViewRef}
				/>
			</CategoryPopoverTrigger>
		</SpecFrame>
	);
};

function isShowTextFilter(categoryList: Category[]) {
	const availableValueList = categoryList.filter(notHidden);
	// selected some spec values
	if (availableValueList.some(selected)) {
		return false;
	}
	// available spec values count is over 7
	return availableValueList.length >= MIN_SPEC_VALUE_COUNT_TO_SHOW_TEXT_FILTER;
}

CategoryListSpec.displayName = 'CategoryListSpec';
