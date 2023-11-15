import React, {
	useMemo,
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CategoryListView.module.scss';
import { TextField } from '@/components/pc/ui/fields/TextField';
import { Checkbox } from '@/components/pc/ui/specs/checkboxes/Checkbox';
import { Category } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { notHidden, notSelected, selected } from '@/utils/domain/spec';

type CategoryValues = string[];
type SpecCode = string;
type SpecValues = string[];

export type Props = {
	categoryList: Category[];
	text?: string;
	onChange: (spec: Record<SpecCode, SpecValues>) => void;
};

export type CategoryListViewRefType = {
	clearCategoryPopoverFilter: () => void;
};

/**
 * Category spec checkbox list view
 */
// NOTE: This special usage of both forwardRef and useImperativeHandle is not recommended
// because we expose the children's functions to the parents. Please try to avoid doing this if possible.
export const CategoryListView = forwardRef<CategoryListViewRefType, Props>(
	({ categoryList, text: refinedText, onChange }, ref) => {
		const { t } = useTranslation();
		const [text, setText] = useState(refinedText ?? '');

		const [checkedCategoryValues, setCheckedCategoryValues] =
			useState<CategoryValues>([]);

		const categoryListValueList = useMemo(() => {
			const categoryListWithFilter = categoryList.filter(notHidden);

			if (!categoryListWithFilter.length) {
				return [];
			}

			return categoryListWithFilter;
		}, [categoryList]);

		useImperativeHandle(
			ref,
			() => {
				return {
					clearCategoryPopoverFilter() {
						setText('');
					},
				};
			},
			[]
		);

		useEffect(() => {
			setCheckedCategoryValues(
				categoryListValueList
					.filter(selected)
					.map(categoryListValue => categoryListValue.categoryCode)
			);
		}, [categoryListValueList]);

		const refinedCategoryValuesList = useMemo(
			() =>
				categoryListValueList.filter(
					category =>
						category.categoryName
							.toLowerCase()
							.startsWith(text.toLowerCase()) ||
						checkedCategoryValues?.includes(category.categoryCode)
				),
			[categoryListValueList, checkedCategoryValues, text]
		);

		// show no filtered value message excluding selected values
		const showsNoFilteredValueWarning =
			categoryList.length > 0 &&
			refinedCategoryValuesList.filter(notSelected).length === 0;

		const handleClick = (clickedCategoryValue: string) => {
			const newValues = [...checkedCategoryValues];

			checkedCategoryValues?.includes(clickedCategoryValue)
				? newValues.splice(
						checkedCategoryValues.indexOf(clickedCategoryValue),
						1
				  )
				: newValues.push(clickedCategoryValue);

			setCheckedCategoryValues(newValues);
			onChange({
				categoryCode: newValues,
			});
		};

		return (
			<>
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
				<ul className={styles.categoryList}>
					{refinedCategoryValuesList.map(categoryItem => (
						<Checkbox
							key={categoryItem.categoryCode}
							className={styles.tripleColumn}
							checked={checkedCategoryValues?.includes(
								categoryItem.categoryCode
							)}
							onClick={() => handleClick(categoryItem.categoryCode)}
						>
							{categoryItem.categoryName} ({categoryItem.seriesCount})
						</Checkbox>
					))}
				</ul>
				{showsNoFilteredValueWarning && (
					<div className={styles.noCandidate}>
						{t('components.ui.specs.textListSpec.notCandidate')}
					</div>
				)}
			</>
		);
	}
);
CategoryListView.displayName = 'CategoryListView';
