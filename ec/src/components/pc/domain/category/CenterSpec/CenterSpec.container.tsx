import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState, VFC } from 'react';
import { CenterSpec as Presenter } from './CenterSpec';
import { addLog } from '@/api/services/addLog';
import { useSpecSearchContext } from '@/components/pc/domain/category/context';
import { ga } from '@/logs/analytics/google';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { LogType } from '@/models/api/msm/ect/log/AddLogParams';
import { SpecViewType } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { useSelector } from '@/store/hooks';
import { selectSeriesResponse } from '@/store/modules/pages/category';
import { assertNotNull } from '@/utils/assertions';
import { selected, parseSpecValue } from '@/utils/domain/spec';
import { getOneParams } from '@/utils/query';

type Props = {
	category: Category;
};
/** Center spec container */
export const CenterSpec: VFC<Props> = ({ category }) => {
	const router = useRouter();
	const params = getOneParams(router.query, 'CategorySpec');
	const categorySpecQuery = params.CategorySpec;
	const seriesResponse = useSelector(selectSeriesResponse);
	const [checkedSpecValues, setCheckedSpecValues] = useState<Set<string>>(
		new Set()
	);
	const { reload } = useSpecSearchContext();

	const spec = useMemo(() => {
		if (!seriesResponse) {
			return null;
		}

		return seriesResponse.seriesSpecList.find(
			spec => spec.specViewType === SpecViewType.CENTER
		);
	}, [seriesResponse]);

	const hasCategorySpecParam = useMemo(() => {
		const parsedCategorySpecQuery = parseSpecValue(categorySpecQuery);

		if (!spec || !parsedCategorySpecQuery) {
			return false;
		}

		const specValues = parsedCategorySpecQuery[spec.specCode];

		if (!specValues || typeof specValues === 'string') {
			return false;
		}

		return specValues.some(specValue =>
			spec.specValueList.find(value => value.specValue === specValue)
		);
	}, [categorySpecQuery, spec]);

	const handleSelectSpec = useCallback(
		(clickedSpecValue: string) => {
			if (!spec) {
				return;
			}

			const isSelected = checkedSpecValues.has(clickedSpecValue);
			if (isSelected) {
				checkedSpecValues.delete(clickedSpecValue);
			} else {
				checkedSpecValues.add(clickedSpecValue);
			}

			setCheckedSpecValues(new Set(Array.from(checkedSpecValues)));

			const specValues = Array.from(checkedSpecValues);

			reload({
				page: 1,
				[spec.specCode]: specValues.length ? specValues.join(',') : null,
			});

			// Add log
			const specValue = spec.specValueList.find(
				spec => spec.specValue === clickedSpecValue
			);
			if (specValue) {
				addLog(LogType.SPEC, {
					categoryCode: category.categoryCode,
					parameterName: spec.specName,
					parameterValue: specValue.specValueDisp,
					select: isSelected ? 'OFF' : 'ON',
				});
			}
			ga.events.specSearchTimes();
		},
		[category, checkedSpecValues, reload, spec]
	);

	const handleClear = useCallback(() => {
		assertNotNull(spec);

		setCheckedSpecValues(new Set());
		reload({ page: 1, [spec.specCode]: null });
	}, [reload, spec]);

	useEffect(() => {
		if (!spec) {
			return;
		}

		setCheckedSpecValues(
			new Set(
				Array.from(
					spec.specValueList
						.filter(selected)
						.map(specValue => specValue.specValue)
				)
			)
		);
	}, [spec]);

	if (!spec || !spec.specValueList) {
		return null;
	}

	return (
		<Presenter
			spec={spec}
			checkedSpecValues={Array.from(checkedSpecValues)}
			hasCategorySpecParam={hasCategorySpecParam}
			onSelectSpec={handleSelectSpec}
			onClear={handleClear}
		/>
	);
};
CenterSpec.displayName = 'CenterSpec';
