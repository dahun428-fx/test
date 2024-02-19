import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CompareDetailPage as Presenter } from './CompareDetail';
import { useDispatch, useSelector } from 'react-redux';
import {
	CompareDetailLoadStatus,
	SpecList,
	clearCompareDetailOperation,
	loadCompareOperation,
	removeItemOperation,
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
import { assertNotEmpty, assertNotNull } from '@/utils/assertions';
import { cadTypeListDisp } from '@/utils/cad';
import { config } from '@/config';
import { getCompare, removeCompareItem } from '@/services/localStorage/compare';
import { useConfirmModal } from '../../ui/modals/ConfirmModal';
import { useTranslation } from 'react-i18next';
import { useMessageModal } from '../../ui/modals/MessageModal';
import { Button } from '../../ui/buttons';
import { useAddToCartModalMulti } from '../../modals/AddToCartModalMulti/AddToCartModalMulti.hooks';
import { useAddToMyComponentsModalMulti } from '../../modals/AddToMyComponentsModalMulti/AddToMyComponentsModalMulti.hooks';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { Router } from 'next/router';
import {
	refreshAuth,
	selectAuthenticated,
	selectIsEcUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import { store } from '@/store';
import { useLoginModal } from '../../modals/LoginModal';
import { usePaymentMethodRequiredModal } from '../../modals/PaymentMethodRequiredModal';
import { PriceCheckResult } from './types';
import {
	checkPriceOperation,
	selectComparePriceCache,
} from '@/store/modules/common/compare';
import { AssertionError } from '@/errors/app/AssertionError';
import { CompareItem } from '@/models/localStorage/Compare';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { addToCart as addToCartApi } from '@/api/services/addToCart';

type Props = {
	categoryCode: string;
};

export const CompareDetail: FC<Props> = ({ categoryCode }) => {
	const status = useSelector(selectCompareDetailLoadStatus); // 로딩 상태
	const specResponses = useSelector(selectSpecListResponses); // specList from store
	const partNumberResponses = useSelector(selectPartNumberResponses); //partNumberList from store
	const seriesResponses = useSelector(selectSeriesResponses); //seriesList from store
	const compareDetailItems = useSelector(selectCompareDetailItems); //compareItems from store

	const dispatch = useDispatch();

	const { showConfirm } = useConfirmModal();
	const { showMessage } = useMessageModal();
	const showAddToCartModal = useAddToCartModalMulti();
	const showAddToMyComponentsModal = useAddToMyComponentsModalMulti();
	const showLoginModal = useLoginModal();
	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();

	const [t] = useTranslation();

	const [categoryName, setCategoryName] = useState('');
	const [specList, setSpecList] = useState<SpecList[]>([]);

	const [selectedCompareDetailItems, setSelectedCompareDetailItems] = useState<
		Set<number>
	>(new Set());

	useOnMounted(() => {
		clearCompareDetailOperation(dispatch)();
		window.scrollTo({ top: 0, left: 0 });
	});

	/**
	 * 현재 로딩 상태가 INITIAL ( 0 ) 일 경우,
	 * localStorage 에서 compare 값을 가져와서 비교결과 페이지에 출력한다.
	 */
	useEffect(() => {
		if (status === CompareDetailLoadStatus.INITIAL) {
			let compare = getCompare();
			const has = compare.items.some(
				item => item.categoryCode === categoryCode && item.chk
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
	}, [dispatch, loadCompareOperation, status]);

	/**
	 * 현재 로딩 상태가 LOADED_MAIN ( 2 ) 일 경우,
	 * store 에 저장되어 있는 데이터를 가져와서 정제한다.
	 */
	useEffect(() => {
		if (status === CompareDetailLoadStatus.LOADED_MAIN) {
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
			updateStatusOperation(dispatch)(CompareDetailLoadStatus.READY);
		}
	}, [specResponses, partNumberResponses, seriesResponses, status]);

	/**
	 * 	specList 중복제거
	 */
	const getSpecMerge = (specItems: Spec[]) => {
		return specItems.reduce<Spec[]>((previous, current) => {
			const foundIndex = previous.findIndex(
				item => item.specCode === current.specCode
			);
			return foundIndex !== -1 ? previous : [...previous, current];
		}, []);
	};

	/**
	 * specList에 seriesList 값 추가 : 브랜드 데이터 비교
	 */
	const fixSeriesSortList = (seriesItems: Partial<Series>[]) => {
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

	/**
	 * specList에 partNumberList 값 추가 : 수량할인, 출하일, CAD, RoHs 데이터 비교
	 */
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

	/**
	 * specList 순서 변경
	 */
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

	/**
	 * partNumber 에 specList 에 해당하는 값이 존재하는지 여부 확인
	 */
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

	/**
	 * 화면 출력 여부
	 */
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

	/**
	 * 유저 클릭 이벤트
	 */
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

	/**
	 * '전체 선택' 클릭 이벤트
	 */
	const handleSelectAllItem = () => {
		const isAllSelected = selectedCompareDetailItems.size === totalCount;
		if (isAllSelected) {
			setSelectedCompareDetailItems(new Set());
		} else {
			compareDetailItems.map(item => {
				selectedCompareDetailItems.add(item.idx);
			});
			setSelectedCompareDetailItems(
				new Set(Array.from(selectedCompareDetailItems))
			);
		}
	};

	/**
	 * 개별 삭제 이벤트
	 */
	const handleDeleteItem = useCallback(
		async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, idx: number) => {
			e.preventDefault();
			e.stopPropagation();

			const item = compareDetailItems.find(item => item.idx === idx);
			if (!item) {
				showMessage({
					message: t('pages.compareDetail.message.alert.delete.noSelected'),
					button: (
						<Button>{t('pages.compareDetail.message.alert.close')}</Button>
					),
				});

				return;
			}

			const confirm = await showConfirm({
				message: t('pages.compareDetail.message.confirm.deleteOne'),
				confirmButton: t('pages.compareDetail.message.confirm.yes'),
				closeButton: t('pages.compareDetail.message.confirm.no'),
			});
			if (!confirm) return;

			const seriesCode = item.seriesList[0]?.seriesCode;
			const partNumber = item.partNumberList[0]?.partNumber;
			if (seriesCode && partNumber) {
				removeItemOperation(dispatch)(item);
				removeCompareItem(seriesCode, partNumber);
				selectedCompareDetailItems.delete(idx);
				setSelectedCompareDetailItems(
					new Set(Array.from(selectedCompareDetailItems))
				);
			}
		},
		[selectedCompareDetailItems, compareDetailItems]
	);

	/**
	 * '삭제' 클릭 이벤트
	 */
	const handleDeleteAllItem = useCallback(async () => {
		if (selectedCompareDetailItems.size < 1) {
			showMessage({
				message: t('pages.compareDetail.message.alert.delete.noSelected'),
				button: <Button>{t('pages.compareDetail.message.alert.close')}</Button>,
			});

			return;
		}

		const confirm = await showConfirm({
			message: t('pages.compareDetail.message.confirm.deleteMany', {
				count: selectedCompareDetailItems.size,
			}),
			confirmButton: t('pages.compareDetail.message.confirm.yes'),
			closeButton: t('pages.compareDetail.message.confirm.no'),
		});
		if (!confirm) return;

		selectedCompareDetailItems.forEach(idx => {
			const detail = compareDetailItems.find(
				detailItem => detailItem.idx === idx
			);
			if (!detail) return;
			const seriesCode = detail.seriesList[0]?.seriesCode;
			const partNumber = detail.partNumberList[0]?.partNumber;
			if (seriesCode && partNumber) {
				removeItemOperation(dispatch)(detail);
				removeCompareItem(seriesCode, partNumber);
			}
			selectedCompareDetailItems.delete(idx);
		});
		setSelectedCompareDetailItems(
			new Set(Array.from(selectedCompareDetailItems))
		);
	}, [selectedCompareDetailItems, compareDetailItems]);

	const check = useCallback(
		async (items: CompareItem[]): Promise<PriceCheckResult> => {
			try {
				await checkPriceOperation(store)(items);
			} catch (error) {
				if (error instanceof AssertionError) {
					if (error.message[0]) {
						showMessage(error.message[0]);
						return 'error';
					}
				}
			}
			return 'success';
		},
		[showMessage]
	);

	const getPrices = useCallback(
		(compareItems: CompareItem[]) => {
			const cache = selectComparePriceCache(store.getState());
			if (!cache) return [];
			return compareItems.map(item => {
				return cache[`${item.partNumber}\t${1}`] ?? null;
			});
		},
		[store]
	);

	/** todo */
	const onClickOrderNow = useCallback(() => {
		console.log('order');
		console.log('items ===> ', selectedCompareDetailItems);
	}, [selectedCompareDetailItems]);

	/** todo */
	const addToCart = useCallback(async () => {
		try {
			updateStatusOperation(dispatch)(CompareDetailLoadStatus.LOADING);

			if (selectedCompareDetailItems.size < 1) {
				showMessage({
					message: t(
						'components.ui.layouts.footers.compareBalloon.message.notSelected'
					),
					button: (
						<Button>
							{t('components.ui.layouts.footers.compareBalloon.message.ok')}
						</Button>
					),
				});
				return;
			}

			const items = getSelectedItems;

			assertNotEmpty(items);

			// NOTE: Get the latest user info when executing add to cart
			await refreshAuth(store.dispatch)();

			if (!selectAuthenticated(store.getState())) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}

			if (selectIsEcUser(store.getState())) {
				showPaymentMethodRequiredModal();
				return;
			}

			if (!selectUserPermissions(store.getState()).hasCartPermission) {
				showMessage(t('common.cart.noPermission'));
				return;
			}

			if ((await check(items)) === 'error') {
				return;
			}

			const firstBrandCode = items[0]?.brandCode;
			assertNotNull(firstBrandCode);

			const checkedPriceList = getPrices(items);
			if (!checkedPriceList || checkedPriceList.length < 1) {
				return;
			}

			const validPriceList = checkedPriceList.reduce<Price[]>(
				(previous, current) => {
					if (current) {
						return [...previous, current];
					} else {
						return previous;
					}
				},
				[]
			);
			const cartItems = validPriceList.map(item => {
				const target = items.find(
					compareItem => compareItem.partNumber === item.partNumber
				);
				return {
					seriesCode: target?.seriesCode || '',
					brandCode: item.brandCode || firstBrandCode,
					partNumber: item.partNumber,
					quantity: item.quantity,
					innerCode: item.innerCode,
					unitPrice: item.unitPrice,
					standardUnitPrice: item.standardUnitPrice,
					daysToShip: item.daysToShip,
					shipType: item.shipType,
					piecesPerPackage: item.piecesPerPackage,
				};
			});
			assertNotEmpty(cartItems);
			const addToCartResponse = await addToCartApi({
				cartItemList: cartItems,
			});

			showAddToCartModal(addToCartResponse, validPriceList, true);
		} catch (error) {
			console.log(error);
		} finally {
			updateStatusOperation(dispatch)(CompareDetailLoadStatus.READY);
		}
	}, [selectedCompareDetailItems, compareDetailItems, getPrices, check]);

	/** todo */
	const addToMyComponents = useCallback(() => {
		console.log('addToMyComponents');
		console.log('items ===> ', selectedCompareDetailItems);
	}, [selectedCompareDetailItems]);

	const getSelectedItems: CompareItem[] = useMemo(() => {
		const targetItems = Array.from(compareDetailItems).filter(item => {
			if (selectedCompareDetailItems.has(item.idx)) return item;
		});
		let compare = getCompare();

		const items = compare.items.filter(item => {
			const foundIndex = targetItems.findIndex(
				target => target.partNumberList[0]?.partNumber === item.partNumber
			);
			if (foundIndex !== -1) {
				return item;
			}
		});
		return items;
	}, [compareDetailItems, selectedCompareDetailItems]);

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
				onClickOrderNow={onClickOrderNow}
				addToCart={addToCart}
				addToMyComponents={addToMyComponents}
				currencyCode={config.defaultCurrencyCode}
			/>
		</>
	);
};
