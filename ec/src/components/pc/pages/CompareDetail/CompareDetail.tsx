import { searchPartNumber$search } from '@/api/services/searchPartNumber';
import { searchSeries$detail } from '@/api/services/searchSeries';
import {
	PartNumber,
	PartNumberCadType,
	SearchPartNumberResponse$search,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import {
	SearchSeriesResponse$detail,
	Series,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { CompareItem } from '@/models/localStorage/Compare';
import { selectCompare } from '@/store/modules/common/compare';
import { assertNotEmpty } from '@/utils/assertions';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export type Props = {
	categoryCode: string;
};

export const CompareDetail: React.FC<Props> = ({ categoryCode }) => {
	const compare = useSelector(selectCompare);

	const initialize = useRef(false);

	const [compareItems, setCompareItems] = useState<CompareItem[]>([]);

	useEffect(() => {
		if (!!compare && compare.items.length > 0) {
			console.log('compare ===> ', compare);
			const items = compare.items.filter(
				item => item.categoryCode === categoryCode
			);
			setCompareItems(items);
		}
	}, [compare.items]);

	useEffect(() => {
		if (compareItems.length < 1) return;
		if (initialize.current) return;
		// setCompareItems(items);
		try {
			(async () => {
				// const seriesResponse = await searchSeries$detail({
				// 	seriesCode,
				// });

				let specItems: Spec[] = [];
				let seriesItems: Series[] = [];
				let partNumberItems: PartNumber[] = [];
				for await (const item of compareItems) {
					const seriesCode = item?.seriesCode;
					const partNumber = item?.partNumber;
					console.log(
						'seriesCode ===> ',
						seriesCode,
						'partNumber===>',
						partNumber
					);
					assertNotEmpty(seriesCode);
					assertNotEmpty(partNumber);

					const [partNumberResponse, seriesResponse] = await Promise.all([
						searchPartNumber$search({
							seriesCode,
							partNumber,
						}),
						searchSeries$detail({
							seriesCode,
						}),
					]);

					// const partNumberResponse = await searchPartNumber$search({
					// 	seriesCode,
					// 	partNumber,
					// });
					const { specList, partNumberList, currencyCode } = partNumberResponse;
					const { seriesList } = seriesResponse;

					if (specList) {
						specItems = [...specItems, ...specList];
					}
					seriesItems = [...seriesItems, ...seriesList];
					partNumberItems = [...partNumberItems, ...partNumberList];
					// console.log('specList ===> ', specList);
					// console.log('partNumberList ===> ', partNumberList);
					// console.log('currencyCode ===> ', currencyCode);
					// console.log('seriesList ===> ', seriesList);
					console.log('partNumberList ===> ', partNumberList);
				}
				specItems = await getSpecMerge(specItems);
				let sortData0 = await fixSeriesSortList(seriesItems); //브랜드 데이터 비교
				let sortData1 = await fixPartNumberSortList(partNumberItems); //수량할인, 출하일, CAD, RoHs 데이터 비교
				let sortData2 = await sortSpecList(specItems, partNumberItems); //스펙 데이터 비교
				let specList0 = [
					...(sortData0[0] || []),
					...(sortData1[0] || []),
					...(sortData2[0] || []),
				]; //데이터가 다른 스펙리스트 merge
				let specList1 = [
					...(sortData0[1] || []),
					...(sortData1[1] || []),
					...(sortData2[1] || []),
				];
				let specList = [...specList0, ...specList1];
				// console.log('spec ===> ', specItems);
				// console.log('series ===> ', seriesItems);
				// console.log('partNumberItems ===> ', partNumberItems);
				// console.log('sortData0====> ', sortData0);
				console.log('sortData0 =====> ', sortData0);
				console.log('sortData1 =====> ', sortData1);
				console.log('sortData2 =====> ', sortData2);
				console.log('specList0 =====> ', specList0);
				console.log('specList1 =====> ', specList1);
				console.log('specList =====> ', specList);
			})();
		} catch (error) {
			console.log('error =====> ', error);
		}
		initialize.current = true;
	}, [compareItems]);

	const getSpecMerge = async (specItems: Spec[]) => {
		return specItems.reduce<Spec[]>((previous, current) => {
			const foundIndex = previous.findIndex(
				item => item.specCode === current.specCode
			);
			// console.log('foundIndex ===> ', foundIndex, current);
			return foundIndex !== -1 ? previous : [...previous, current];
		}, []);
	};

	type SpecListType = {
		spec?: Spec;
		diffTypeCode: number;
		specTypeCode?: string;
	};

	const fixSeriesSortList = async (seriesItems: Series[]) => {
		let specList0: SpecListType[] = []; //데이터가 다른 항목 저장 array
		let specList1: SpecListType[] = []; //데이터가 같은 항목 저장 array

		const size = seriesItems.length;
		const brandCode = seriesItems[0]?.brandCode;
		let index = 0;
		for await (const item of seriesItems) {
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

	const fixPartNumberSortList = async (partNumberItems: PartNumber[]) => {
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
		for await (const item of partNumberItems) {
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

	const sortSpecList = async (
		specItems: Spec[],
		partNumberItems: PartNumber[]
	) => {
		let specList0: SpecListType[] = [];
		let specList1: SpecListType[] = [];

		const partNumber = partNumberItems[0];
		const size = partNumberItems.length;
		for await (const specItem of specItems) {
			let index = 0;
			const specCode = specItem.specCode;
			for await (const partNumberItem of partNumberItems) {
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

	return (
		<div>
			{compareItems &&
				compareItems.length > 0 &&
				compareItems.map((item, index) => {
					return (
						<div key={index}>
							{item.categoryCode1}
							<span>{item.partNumber}</span>
						</div>
					);
				})}
		</div>
	);
};
CompareDetail.displayName = 'CompareDetail';
