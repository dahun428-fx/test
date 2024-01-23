import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './CompareBalloon.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { useBoolState } from '@/hooks/state/useBoolState';
import { useSelector } from '@/store/hooks';
import {
	selectCompare,
	selectShowCompareBalloon,
	updateCompareOperation,
} from '@/store/modules/common/compare';
import { Compare, CompareItem } from '@/models/localStorage/Compare';
import { useDispatch } from 'react-redux';
import { getCompare, updateCompare } from '@/services/localStorage/compare';
import { Router } from 'next/router';
import { BlockLoader, OverlayLoader } from '@/components/pc/ui/loaders';
import { CompareTabContent } from './CompareTabContent';
import classNames from 'classnames';
import { last } from '@/utils/collection';

export const CompareBalloon: FC = () => {
	const [loading, startToLoading, endLoading] = useBoolState(true);

	const initialized = useRef(false);

	const dispatch = useDispatch();

	const compare = useSelector(selectCompare);
	const compareShowStatus = useSelector(selectShowCompareBalloon);

	// const [tabHeadList, setTabHeadList] = useState<string[]>();
	const [activeCategoryCode, setActiveCategoryCode] = useState<string>();

	const setCompare = useCallback(
		(compare: Compare) => {
			updateCompareOperation(dispatch)(compare);
		},
		[dispatch]
	);

	const updateCompareState = useCallback(
		(compare: Compare) => {
			updateCompare(compare);
			setCompare(compare);
		},
		[setCompare]
	);

	const getCategoryName = (categoryCode: string) => {
		return (
			compare.items.find(item => item.categoryCode === categoryCode)
				?.categoryName || ''
		);
	};

	// console.log('activeCategoryCode ====> ', activeCategoryCode);
	// const [loading, startToLoading, endLoading] = useBoolState(false);

	const tabHeadList = useMemo(() => {
		const categoryCodeList = compare.items.map(item => item.categoryCode);
		return categoryCodeList.reduce<string[]>(
			(previous, current) =>
				previous.includes(current) ? previous : [current, ...previous],
			[]
		);
	}, [compare.items]);

	const tabContentList = useMemo(() => {
		return compare.items.filter(
			item => item.categoryCode === activeCategoryCode
		);
	}, [activeCategoryCode]);

	useEffect(() => {
		if (!initialized.current) return;

		const compare = getCompare();
		if (!compare || compare.items.length < 1) {
			return;
		}

		console.log('compare active ====> ', compare.active);
		const activeCode = compare.active
			? compare.active
			: tabHeadList[tabHeadList.length - 1];
		setActiveCategoryCode(activeCode);
	}, [compare.active, tabHeadList]);

	const generateCompareData = useCallback(() => {
		if (!initialized.current) {
			updateCompare({ show: false });
			let compare = getCompare();
			setCompare(compare);
			initialized.current = true;
		}
	}, [dispatch, compareShowStatus, compare]);

	useEffect(() => {
		const handleGenerateData = () => {
			generateCompareData();
		};
		handleGenerateData();
		Router.events.on('routeChangeComplete', handleGenerateData);
		return () => Router.events.off('routeChangeComplete', handleGenerateData);
	}, [generateCompareData]);

	const handleTabClick = (categoryCode: string) => {
		setActiveCategoryCode(categoryCode);
	};

	return (
		<>
			{compareShowStatus && (
				<div className={styles.constrast}>
					<div className={styles.selectPopup}>
						<div className={styles.titleSection}>
							<h2>비교</h2>
						</div>

						<div className={styles.productList}>
							<div className={styles.ndrClearfix}>
								<div className={styles.productListBody}>
									<div>
										{/* list */}
										<div className={styles.tabSection}>
											{/* <OverlayLoader show={loading} /> */}
											<CompareTabContent
												compare={compare}
												tabHeads={tabHeadList}
												tabContents={tabContentList}
												activeCategoryCode={activeCategoryCode}
												onClick={handleTabClick}
											/>
											{/* content */}
										</div>
									</div>
								</div>
								<div className={styles.asideBtnSection}>
									{/* 상단버튼 */}
									<div className={styles.topBtnSection}>
										<Button
											size="m"
											type="button"
											theme="conversion"
											icon="order-now"
										>
											주문
										</Button>
										<Button
											size="m"
											type="button"
											theme="conversion"
											icon="cart"
										>
											장바구니
										</Button>
										<Button
											size="m"
											type="button"
											theme="default"
											icon="add-my-component"
										>
											My 부품표
										</Button>
									</div>
									{/* loading... */}
									{/* <div className={styles.loading}>
										<div className={styles.loadingBg}></div>
										<div className={styles.loadingImage}></div>
										<div className={styles.loadingText}>
											잠시 기다려 주십시오.
										</div>
									</div> */}
								</div>
							</div>
							<div className={styles.pcpCookieGuide}>
								<p>비교 형번은 당일 이후 자동 삭제됩니다.</p>
							</div>
							<div className={styles.btnSection}>
								<Button
									size="m"
									type="button"
									theme="strong"
									icon="right-arrow"
								>
									비교결과
								</Button>
								<Button size="m" type="button" theme="default">
									닫기
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

CompareBalloon.displayName = 'CompareBalloon';
