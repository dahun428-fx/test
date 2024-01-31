import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { CompareDetail as Presenter } from './CompareDetail';
import { useDispatch, useSelector } from 'react-redux';
import { selectCompare } from '@/store/modules/common/compare';
import {
	CompareDetailLoadStatus,
	SpecListType,
	loadCompareOperation,
	selectCompareDetailLoadStatus,
	selectPartNumberResponses,
	selectSeriesResponses,
	selectSpecListResponses,
	updateStatusOperation,
} from '@/store/modules/pages/compareDetail';
import {
	PartNumber,
	PartNumberCadType,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { assertNotNull } from '@/utils/assertions';

type Props = {
	categoryCode: string;
};

export const CompareDetail: FC<Props> = ({ categoryCode }) => {
	const initialize = useRef(false);
	const compare = useSelector(selectCompare);
	const status = useSelector(selectCompareDetailLoadStatus);
	const specResponses = useSelector(selectSpecListResponses);
	const partNumberResponses = useSelector(selectPartNumberResponses);
	const seriesResponses = useSelector(selectSeriesResponses);
	const dispatch = useDispatch();

	const [categoryName, setCategoryName] = useState('');
	const [specList, setSpecList] = useState<SpecListType[]>([]);
	const [seriesList, setSeriesList] = useState<Series[]>([]);
	const [partNumberList, setPartNumberList] = useState<PartNumber[]>([]);

	useEffect(() => {
		if (compare && compare.items.length > 0) {
			if (!initialize.current) {
				loadCompareOperation(dispatch)({
					compare,
					categoryCode,
				});
				setCategoryName(compare.items[0]?.categoryName || '');
				initialize.current = true;
			}
		}
	}, [dispatch, categoryCode, compare]);

	useEffect(() => {
		if (status === CompareDetailLoadStatus.LOADED_MAIN) {
			console.log(
				'loaded ===> ',
				specResponses,
				partNumberResponses,
				seriesResponses
			);
			assertNotNull(specResponses);
			assertNotNull(seriesResponses);
			assertNotNull(partNumberResponses);
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
			setSeriesList(seriesItems);
			setPartNumberList(partNumberItems);
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
		let specList0: SpecListType[] = []; //데이터가 다른 항목 저장 array
		let specList1: SpecListType[] = []; //데이터가 같은 항목 저장 array

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
		let specList0: SpecListType[] = []; //데이터가 다른 항목 저장 array
		let specList1: SpecListType[] = []; //데이터가 같은 항목 저장 array
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
				makeCadTypeListDisp(partNumber?.cadTypeList) !==
					makeCadTypeListDisp(item.cadTypeList)
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

	const getSortdisFlag0 = (items: SpecListType[]): SpecListType[] => {
		return [...items, { diffTypeCode: 3, specTypeCode: '0' }];
	};
	const getSortdisFlag1 = (items: SpecListType[]): SpecListType[] => {
		return [...items, { diffTypeCode: 4, specTypeCode: '0' }];
	};
	const getSortCad0 = (items: SpecListType[]): SpecListType[] => {
		return [...items, { diffTypeCode: 3, specTypeCode: '2' }];
	};
	const getSortCad1 = (items: SpecListType[]): SpecListType[] => {
		return [...items, { diffTypeCode: 4, specTypeCode: '2' }];
	};
	const getSortDayToShip0 = (items: SpecListType[]): SpecListType[] => {
		return [...items, { diffTypeCode: 3, specTypeCode: '1' }];
	};
	const getSortDayToShip1 = (items: SpecListType[]): SpecListType[] => {
		return [...items, { diffTypeCode: 4, specTypeCode: '1' }];
	};
	const getSortRohs0 = (items: SpecListType[]): SpecListType[] => {
		return [...items, { diffTypeCode: 3, specTypeCode: '3' }];
	};
	const getSortRohs1 = (items: SpecListType[]): SpecListType[] => {
		return [...items, { diffTypeCode: 4, specTypeCode: '3' }];
	};
	const getSortPrice0 = (items: SpecListType[]): SpecListType[] => {
		return [...items, { diffTypeCode: 3, specTypeCode: '4' }];
	};
	const getSortPrice1 = (items: SpecListType[]): SpecListType[] => {
		return [...items, { diffTypeCode: 4, specTypeCode: '4' }];
	};

	const makeCadTypeListDisp = (
		cadTypeList: PartNumberCadType[] | undefined
	): string => {
		if (cadTypeList) {
			return cadTypeList.join(' | ');
		}
		return '-';
	};

	const sortSpecList = (specItems: Spec[], partNumberItems: PartNumber[]) => {
		let specList0: SpecListType[] = [];
		let specList1: SpecListType[] = [];

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
		searchSpecCode: string
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
		if (
			status === CompareDetailLoadStatus.READY &&
			seriesList.length > 0 &&
			specList.length > 0
		) {
			return true;
		}
		return false;
	}, [status, seriesList, specList]);

	const totalCount = useMemo(() => {
		return seriesList.length;
	}, [seriesList]);

	return (
		<>
			<Presenter
				status={readyToStatus}
				specList={specList}
				seriesList={seriesList}
				partNumberList={partNumberList}
				totalCount={totalCount}
				categoryName={categoryName}
			/>
		</>
	);
};
