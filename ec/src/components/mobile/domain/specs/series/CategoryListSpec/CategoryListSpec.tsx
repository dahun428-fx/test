import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CategoryListSpec.module.scss';
import { Checkbox } from '@/components/mobile/domain/specs/checkboxes';
import { CommonListSpec } from '@/components/mobile/domain/specs/series/CommonListSpec';
import { Category } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { notHidden, selected } from '@/utils/domain/spec';

type CategoryValues = string[];
type SpecCode = string;
type SpecValues = string[];

type Props = {
	categoryList: Category[];
	onChange: (spec: Record<SpecCode, SpecValues>, isClear?: boolean) => void;
};

/**
 * Category List Spec Component
 */
export const CategoryListSpec: React.FC<Props> = ({
	categoryList,
	onChange,
}) => {
	const [t] = useTranslation();
	const [checkedCategoryValues, setCheckedCategoryValues] =
		useState<CategoryValues>([]);

	const notHiddenCategoryList = useMemo(() => {
		return categoryList.filter(notHidden);
	}, [categoryList]);

	useEffect(() => {
		setCheckedCategoryValues(
			notHiddenCategoryList
				.filter(selected)
				.map(category => category.categoryCode)
		);
	}, [notHiddenCategoryList]);

	const handleClick = (clickedCategoryValue: string) => {
		const newValues = [...checkedCategoryValues];

		const isClear = checkedCategoryValues?.includes(clickedCategoryValue);
		isClear
			? newValues.splice(checkedCategoryValues.indexOf(clickedCategoryValue), 1)
			: newValues.push(clickedCategoryValue);

		setCheckedCategoryValues(newValues);
		onChange(
			{
				categoryCode: newValues,
			},
			isClear
		);
	};

	return (
		<CommonListSpec
			title={t('mobile.components.domain.specs.series.categoryListSpec.title')}
		>
			<div className={styles.content}>
				<span className={styles.list}>
					{notHiddenCategoryList.map(categoryItem => (
						<div className={styles.item} key={categoryItem.categoryCode}>
							<Checkbox
								className={styles.checkbox}
								checked={checkedCategoryValues?.includes(
									categoryItem.categoryCode
								)}
								onClick={() => handleClick(categoryItem.categoryCode)}
								theme="sub"
							>
								{categoryItem.categoryName}
							</Checkbox>
						</div>
					))}
				</span>
			</div>
		</CommonListSpec>
	);
};

CategoryListSpec.displayName = 'CategoryListSpec';
