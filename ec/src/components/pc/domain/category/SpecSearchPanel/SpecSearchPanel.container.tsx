import { useCallback, useRef, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { SpecSearchPanel as Presenter } from './SpecSearchPanel';
import { addLog } from '@/api/services/addLog';
import { useSpecSearchContext } from '@/components/pc/domain/category/context';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { ga } from '@/logs/analytics/google';
import { Flag } from '@/models/api/Flag';
import { LogType } from '@/models/api/msm/ect/log/AddLogParams';
import { SearchSeriesRequest } from '@/models/api/msm/ect/series/SearchSeriesRequest';
import { store } from '@/store';
import { useSelector } from '@/store/hooks';
import {
	selectBrandIndexList,
	selectPreviousSearchSeriesCondition,
	selectSeriesResponse,
} from '@/store/modules/pages/category';
import { xor, first } from '@/utils/collection';
import { flatSpecValueList } from '@/utils/domain/spec';
import { remove } from '@/utils/object';
import { notEmpty } from '@/utils/predicate';

type Props = {
	categoryMainSelector: string;
	categoryCode: string;
};

/* Spec search panel container component. */
export const SpecSearchPanel: VFC<Props> = ({
	categoryMainSelector,
	categoryCode,
}) => {
	const seriesResponse = useSelector(selectSeriesResponse);
	const brandIndexList = useSelector(selectBrandIndexList);
	const { reload, onClearAll } = useSpecSearchContext();

	const defaultSpec: Record<string, string[]> = useSelector(
		selectPreviousSearchSeriesCondition
	);
	const numericSpec = useRef<Record<string, string>>({});

	const { showMessage } = useMessageModal();
	const [t] = useTranslation();

	const handleAddLog = useCallback(
		(conditions: Partial<SearchSeriesRequest> = {}) => {
			const currentSpecKey = first(Object.keys(conditions));
			if (!currentSpecKey || !seriesResponse) {
				return;
			}

			const lastSpecValues = defaultSpec[currentSpecKey];
			const differenceItems: string[] = !lastSpecValues
				? conditions[currentSpecKey]
				: xor(lastSpecValues, conditions[currentSpecKey]);

			const differenceItem = first(differenceItems);

			let parameterName;
			let parameterValue;
			let selectedFlag;

			switch (currentSpecKey) {
				case 'daysToShip':
					return;
				case 'brandCode': {
					const seriesSpec = seriesResponse.brandList.find(
						brand => brand.brandCode === differenceItem
					);
					parameterName = 'Brand';
					parameterValue = seriesSpec?.brandName;
					selectedFlag = seriesSpec?.selectedFlag;

					// Handle cValue
					if (defaultSpec.cValueFlag !== conditions.cValueFlag) {
						addLog(LogType.SPEC, {
							categoryCode,
							parameterName: 'c_value',
							parameterValue: 'Economy series',
							select: Flag.isTrue(conditions.cValueFlag) ? 'ON' : 'OFF',
						});
					}
					break;
				}

				case 'cadType': {
					const seriesSpec = seriesResponse.cadTypeList.find(
						cad => cad.cadType === differenceItem
					);
					parameterName = 'CAD';
					parameterValue = seriesSpec?.cadTypeDisp;
					selectedFlag = seriesSpec?.selectedFlag;
					break;
				}

				default: {
					const seriesSpec = seriesResponse.seriesSpecList.find(
						spec => spec.specCode === currentSpecKey
					);
					const specValue = flatSpecValueList(
						seriesSpec?.specValueList ?? []
					).find(spec => spec.specValue === differenceItem);

					parameterName = seriesSpec?.specName;

					// Handle numeric input
					if (!specValue) {
						const numericSpecValue: string | undefined = first(
							conditions[currentSpecKey]
						);
						if (numericSpecValue == null) {
							return;
						}

						if (
							numericSpec.current[currentSpecKey] &&
							numericSpecValue !== numericSpec.current[currentSpecKey]
						) {
							parameterValue = numericSpec.current[currentSpecKey];
							addLog(LogType.SPEC, {
								categoryCode,
								parameterName,
								parameterValue,
								select: 'OFF',
							});

							numericSpec.current = remove(numericSpec.current, currentSpecKey);

							if (!notEmpty(numericSpecValue)) {
								return;
							}
						}

						numericSpec.current[currentSpecKey] = numericSpecValue;
						parameterValue = String(first(conditions[currentSpecKey]));
						selectedFlag = Flag.FALSE;
					} else {
						parameterValue = specValue?.specValueDisp;
						selectedFlag = specValue?.selectedFlag;
					}
				}
			}

			if (parameterValue) {
				addLog(LogType.SPEC, {
					categoryCode,
					parameterName,
					parameterValue,
					select: Flag.isTrue(selectedFlag) ? 'OFF' : 'ON',
				});
			}
		},
		[categoryCode, defaultSpec, numericSpec, seriesResponse]
	);

	const scrollToSeriesTop = useCallback(() => {
		const element = document.querySelector(categoryMainSelector) as HTMLElement;
		if (element && document.documentElement.scrollTop > element.offsetTop) {
			document.documentElement.scrollTop = element.offsetTop;
		}
	}, [categoryMainSelector]);

	const handleChange = useCallback(
		async (conditions: Partial<SearchSeriesRequest> = {}, isClear = false) => {
			if (!isClear) {
				handleAddLog(conditions);
				ga.events.specSearchTimes();
			}
			await reload({ ...conditions, page: 1 });
			scrollToSeriesTop();
		},
		[handleAddLog, reload, scrollToSeriesTop]
	);

	const validateFilter = useCallback(
		condition => {
			const isValid = Object.values(condition).some(
				item =>
					(Array.isArray(item) && item.length > 0) ||
					(!Array.isArray(item) && item !== undefined)
			);

			if (!isValid) {
				showMessage(
					t('components.domain.category.specSearchPanel.specConditionsNotSet')
				);
				return false;
			}

			return true;
		},
		[showMessage, t]
	);

	const handleClearAll = useCallback(() => {
		const prevCondition = selectPreviousSearchSeriesCondition(store.getState());
		const isValid = validateFilter(prevCondition);
		if (!isValid) {
			return;
		}

		onClearAll();
	}, [onClearAll, validateFilter]);

	if (!seriesResponse || seriesResponse.totalCount === 0) {
		return null;
	}

	const { brandList, cValue, cadTypeList, seriesSpecList } = seriesResponse;

	return (
		<Presenter
			stickyBottomSelector={categoryMainSelector}
			specList={seriesSpecList}
			brandIndexList={brandIndexList}
			brandList={brandList}
			cadTypeList={cadTypeList}
			cValue={cValue}
			onChange={handleChange}
			onClearAll={handleClearAll}
		/>
	);
};

SpecSearchPanel.displayName = 'SpecSearchPanel';
