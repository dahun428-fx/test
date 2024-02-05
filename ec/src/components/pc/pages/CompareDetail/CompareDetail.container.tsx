import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CompareDetailPage as Presenter } from './CompareDetail';
import { useDispatch, useSelector } from 'react-redux';
import {
	CompareDetailLoadStatus,
	SpecList,
	loadCompareOperation,
	removeCompareDetailItemOperation,
	selectCompareDetailItems,
	selectCompareDetailLoadStatus,
	selectPartNumberResponses,
	selectSeriesResponses,
	selectSpecListResponses,
	updateStatusOperation,
} from '@/store/modules/pages/compareDetail';
import {
	PartNumber,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { assertNotNull } from '@/utils/assertions';
import { cadTypeListDisp } from '@/utils/cad';
import { config } from '@/config';
import { getCompare, removeCompareItem } from '@/services/localStorage/compare';

type Props = {
	categoryCode: string;
};

export const CompareDetail: FC<Props> = ({ categoryCode }) => {
	const status = useSelector(selectCompareDetailLoadStatus);
	const specResponses = useSelector(selectSpecListResponses);
	const partNumberResponses = useSelector(selectPartNumberResponses);
	const seriesResponses = useSelector(selectSeriesResponses);
	const compareDetailItems = useSelector(selectCompareDetailItems);
	const dispatch = useDispatch();

	const [categoryName, setCategoryName] = useState('');
	const [specList, setSpecList] = useState<SpecList[]>([]);

	const [selectedCompareDetailItems, setSelectedCompareDetailItems] = useState<
		Set<number>
	>(new Set());

	useEffect(() => {
		if (status === CompareDetailLoadStatus.INITIAL) {
			let compare = getCompare();
			const has = compare.items.some(
				item => item.categoryCode === categoryCode
			);
			if (has) {
				loadCompareOperation(dispatch)({
					compare,
					categoryCode,
				});
				const targetCompare = compare.items.find(item => {
					return item.categoryCode === categoryCode;
				});
				setCategoryName(targetCompare?.categoryName || '');
			}
		}
	}, [dispatch, categoryCode, status]);

	useEffect(() => {
		if (status === CompareDetailLoadStatus.LOADED_MAIN) {
			assertNotNull(specResponses);
			assertNotNull(seriesResponses);
			assertNotNull(partNumberResponses);
			assertNotNull(compareDetailItems);
			const specItems = getSpecMerge(specResponses);
			const seriesItems = seriesResponses;
			const partNumberItems = partNumberResponses;
			const sortData0 = fixSeriesSortList(seriesItems); //브랜드 데이터 비교
			const sortData1 = fixPartNumberSortList(partNumberItems); //수량할인, 출하일, CAD, RoHs 데이터 비교
			const sortData2 = sortSpecList(specItems, partNumberItems); //스펙 데이터 비교
			const specList0 = [
				...(sortData0[0] || []),
				...(sortData1[0] || []),
				...(sortData2[0] || []),
			]; //데이터가 다른 스펙리스트 merge
			const specList1 = [
				...(sortData0[1] || []),
				...(sortData1[1] || []),
				...(sortData2[1] || []),
			];
			const specList = [...specList0, ...specList1];
			setSpecList(specList);
			updateStatusOperation(dispatch)(CompareDetailLoadStatus.READY);
		}
	}, [specResponses, partNumberResponses, seriesResponses, status]);

	const getSpecMerge = (specItems: Spec[]) => {
		return specItems.reduce<Spec[]>((previous, current) => {
			const foundIndex = previous.findIndex(
				item => item.specCode === current.specCode
			);
			return foundIndex !== -1 ? previous : [...previous, current];
		}, []);
	};

	const fixSeriesSortList = (seriesItems: Series[]) => {
		let specList0: SpecList[] = []; //데이터가 다른 항목 저장 array
		let specList1: SpecList[] = []; //데이터가 같은 항목 저장 array

		const size = seriesItems.length;
		const brandCode = seriesItems[0]?.brandCode;
		let index = 0;
		for (const item of seriesItems) {
			if (item.brandCode !== brandCode) {
				specList0 = [...specList0, { diffTypeCode: 3, specTypeCode: '9' }];
				break;
			} else if (index + 1 === size) {
				specList1 = [...specList1, { diffTypeCode: 4, specTypeCode: '9' }];
			}
			index++;
		}
		return [specList0, specList1];
	};

	const fixPartNumberSortList = (partNumberItems: PartNumber[]) => {
		let specList0: SpecList[] = []; //데이터가 다른 항목 저장 array
		let specList1: SpecList[] = []; //데이터가 같은 항목 저장 array
		let diffdisFlag = false; //수량할인 데이터 가 다른지 여부 Flag
		let diffDayToShip = false; //출하일 데이터 가 다른지 여부 Flag
		let diffCadType = false; //CAD 데이터 가 다른지 여부 Flag
		let diffRohsFlag = false; //RoHs 데이터 가 다른지 여부 Flag
		let diffPriceFlag = false; //가격 데이터 가 다른지 여부 Flag

		const size = partNumberItems.length;
		let index = 0;

		const partNumber = partNumberItems[0];
		for (const item of partNumberItems) {
			//수량할인 정보비교
			if (
				!diffdisFlag &&
				partNumber?.volumeDiscountFlag !== item.volumeDiscountFlag
			) {
				diffdisFlag = true;
				specList0 = getSortdisFlag0(specList0);
			} else if (!diffdisFlag && index + 1 === size) {
				specList1 = getSortdisFlag1(specList1);
			}
			//출하일 정보비교
			if (
				(!diffDayToShip &&
					partNumber?.minStandardDaysToShip !== item.minStandardDaysToShip) ||
				partNumber?.maxStandardDaysToShip !== item.maxStandardDaysToShip
			) {
				diffDayToShip = true;
				specList0 = getSortDayToShip0(specList0);
			} else if (!diffDayToShip && index + 1 === size) {
				specList1 = getSortDayToShip1(specList1);
			}

			//CAD 정보 비교
			if (
				!diffCadType &&
				cadTypeListDisp(partNumber?.cadTypeList) !==
					cadTypeListDisp(item.cadTypeList)
			) {
				diffCadType = true;
				specList0 = getSortCad0(specList0);
			} else if (!diffCadType && index + 1 === size) {
				specList1 = getSortCad1(specList1);
			}

			//RoHs 정보 비교
			if (!diffRohsFlag && partNumber?.rohsFlag !== item.rohsFlag) {
				diffRohsFlag = true;
				specList0 = getSortRohs0(specList0);
			} else if (!diffRohsFlag && index + 1 === size) {
				specList1 = getSortRohs1(specList1);
			}

			//가격비교
			if (
				!diffPriceFlag &&
				partNumber?.standardUnitPrice !== item.standardUnitPrice
			) {
				diffPriceFlag = true;
				specList0 = getSortPrice0(specList0);
			} else if (!diffPriceFlag && index + 1 === size) {
				specList1 = getSortPrice1(specList1);
			}

			index++;
		}
		return [specList0, specList1];
	};

	const getSortdisFlag0 = (items: SpecList[]): SpecList[] => {
		return [...items, { diffTypeCode: 3, specTypeCode: '0' }];
	};
	const getSortdisFlag1 = (items: SpecList[]): SpecList[] => {
		return [...items, { diffTypeCode: 4, specTypeCode: '0' }];
	};
	const getSortCad0 = (items: SpecList[]): SpecList[] => {
		return [...items, { diffTypeCode: 3, specTypeCode: '2' }];
	};
	const getSortCad1 = (items: SpecList[]): SpecList[] => {
		return [...items, { diffTypeCode: 4, specTypeCode: '2' }];
	};
	const getSortDayToShip0 = (items: SpecList[]): SpecList[] => {
		return [...items, { diffTypeCode: 3, specTypeCode: '1' }];
	};
	const getSortDayToShip1 = (items: SpecList[]): SpecList[] => {
		return [...items, { diffTypeCode: 4, specTypeCode: '1' }];
	};
	const getSortRohs0 = (items: SpecList[]): SpecList[] => {
		return [...items, { diffTypeCode: 3, specTypeCode: '3' }];
	};
	const getSortRohs1 = (items: SpecList[]): SpecList[] => {
		return [...items, { diffTypeCode: 4, specTypeCode: '3' }];
	};
	const getSortPrice0 = (items: SpecList[]): SpecList[] => {
		return [...items, { diffTypeCode: 3, specTypeCode: '4' }];
	};
	const getSortPrice1 = (items: SpecList[]): SpecList[] => {
		return [...items, { diffTypeCode: 4, specTypeCode: '4' }];
	};

	const sortSpecList = (specItems: Spec[], partNumberItems: PartNumber[]) => {
		let specList0: SpecList[] = [];
		let specList1: SpecList[] = [];

		const partNumber = partNumberItems[0];
		const size = partNumberItems.length;
		for (const specItem of specItems) {
			let index = 0;
			const specCode = specItem.specCode;
			for (const partNumberItem of partNumberItems) {
				if (
					searchSpecValue(partNumber, specCode) !==
					searchSpecValue(partNumberItem, specCode)
				) {
					specList0 = [...specList0, { ...specItem, diffTypeCode: 1 }];
					break;
				} else if (index + 1 === size) {
					specList1 = [...specList1, { ...specItem, diffTypeCode: 0 }];
				}
				index++;
			}
		}
		return [specList0, specList1];
	};

	const searchSpecValue = (
		partNumberItem: PartNumber | undefined,
		searchSpecCode: string | undefined
	): string => {
		if (!partNumberItem) {
			return '-';
		}
		const foundIndex = partNumberItem.specValueList.findIndex(
			item => item.specCode === searchSpecCode
		);
		return partNumberItem.specValueList[foundIndex]?.specValueDisp ?? '-';
	};

	const readyToStatus = useMemo(() => {
		if (status === CompareDetailLoadStatus.READY) {
			return true;
		} else if (compareDetailItems.length < 1) {
			return true;
		}
		return false;
	}, [status, compareDetailItems]);

	const totalCount = useMemo(() => {
		return compareDetailItems.length;
	}, [compareDetailItems]);

	const handleSelectItem = useCallback(
		(item: number) => {
			const isSelected = selectedCompareDetailItems.has(item);
			if (isSelected) {
				selectedCompareDetailItems.delete(item);
			} else {
				selectedCompareDetailItems.add(item);
			}
			setSelectedCompareDetailItems(
				new Set(Array.from(selectedCompareDetailItems))
			);
		},
		[selectedCompareDetailItems]
	);
	const handleSelectAllItem = () => {
		const isAllSelected = selectedCompareDetailItems.size === totalCount;
		if (isAllSelected) {
			setSelectedCompareDetailItems(new Set());
		} else {
			compareDetailItems.map(item => {
				selectedCompareDetailItems.add(item.idx);
			});
			setSelectedCompareDetailItems(new Set(selectedCompareDetailItems));
		}
	};

	const handleDeleteItem = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		idx: number
	) => {
		e.preventDefault();
		e.stopPropagation();
		const item = compareDetailItems.find(item => item.idx === idx);
		if (!item) return;
		const seriesCode = item.seriesList[0]?.seriesCode;
		const partNumber = item.partNumberList[0]?.partNumber;
		if (seriesCode && partNumber) {
			removeCompareDetailItemOperation(dispatch)(item);
			removeCompareItem(seriesCode, partNumber);
			selectedCompareDetailItems.delete(idx);
			setSelectedCompareDetailItems(
				new Set(Array.from(selectedCompareDetailItems))
			);
		}
	};

	const handleDeleteAllItem = () => {
		if (selectedCompareDetailItems.size < 1) {
			return;
		}

		selectedCompareDetailItems.forEach(idx => {
			const detail = compareDetailItems.find(
				detailItem => detailItem.idx === idx
			);
			if (!detail) return;
			const seriesCode = detail.seriesList[0]?.seriesCode;
			const partNumber = detail.partNumberList[0]?.partNumber;
			if (seriesCode && partNumber) {
				removeCompareDetailItemOperation(dispatch)(detail);
				removeCompareItem(seriesCode, partNumber);
			}
			selectedCompareDetailItems.delete(idx);
		});
		setSelectedCompareDetailItems(
			new Set(Array.from(selectedCompareDetailItems))
		);
	};

	return (
		<>
			<Presenter
				status={readyToStatus}
				specList={specList}
				totalCount={totalCount}
				categoryName={categoryName}
				selectedCompareDetailItems={selectedCompareDetailItems}
				compareDetailItems={compareDetailItems}
				searchSpecValue={searchSpecValue}
				handleSelectItem={handleSelectItem}
				handleSelectAllItem={handleSelectAllItem}
				handleDeleteItem={handleDeleteItem}
				handleDeleteAllItem={handleDeleteAllItem}
				currencyCode={config.defaultCurrencyCode}
			/>
		</>
	);
};
