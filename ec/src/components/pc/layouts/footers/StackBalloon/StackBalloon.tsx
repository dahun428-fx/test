import React, { useCallback, useEffect, useMemo } from 'react';
import { useStackBalloon } from './StackBalloon.hooks';
import styles from './StackBalloon.module.scss';
import { StackBalloonItems } from './StackBalloonItem';
import { CadDownloadStackItem } from '@/models/localStorage/CadDownloadStack';
import { isEmpty } from '@/utils/predicate';
import { Router } from 'next/router';
import { CadDownloadStatus } from '@/models/localStorage/CadDownloadStack';
import { CancelCadDownloadResult } from '../CadDownloadStatusBalloon/CancelCadDownloadModal/CancelCadDownloadContent';
import { url } from '@/utils/url';
import classNames from 'classnames';
import { Trans, useTranslation } from 'react-i18next';

type Props = {
	doneList: CadDownloadStackItem[];
	pendingList: CadDownloadStackItem[];
	checkedDoneCadDownloadItems: Set<CadDownloadStackItem>;
	checkedPendingCadDownloadItems: Set<CadDownloadStackItem>;
	handleSelectDoneItem: (cadDownloadDoneItem: CadDownloadStackItem) => void;
	handleSelectPendingItem: (
		cadDownloadPendingItem: CadDownloadStackItem
	) => void;
	handleSelectAllItem: () => void;
	handleDeleteItems: (downloadPendingItemSize: number) => void;
	showCancelCadDownloadModal: () => Promise<void | CancelCadDownloadResult>;
};

export const StackBalloon: React.FC<Props> = ({
	doneList,
	pendingList,
	checkedDoneCadDownloadItems,
	checkedPendingCadDownloadItems,
	handleSelectDoneItem,
	handleSelectPendingItem,
	handleSelectAllItem,
	handleDeleteItems,
	showCancelCadDownloadModal,
}) => {
	const {
		showsStatus,
		cadDownloadStack,
		authenticated,
		downloadingItemIds,
		setShowsStatus,
		setTabDone,
		cadDownload,
		clearDownloadingItemIds,
		generateCadData,
		showLoginModal,
		showMessage,
		cancelDownload,
	} = useStackBalloon();

	const [t] = useTranslation();

	const tabDoneStatus = cadDownloadStack.tabDone;

	/**
	 * 삭제 버튼 클릭
	 */
	const handleCancelAndDelete = async () => {
		//다운로드 중인 경우 stack에 있는 아이템은 선택 / 선택해제 할수 없으므로, 현재 다운로드 중인 item을 대상으로한다.
		const pendingItems = cadDownloadStack.items.filter(
			item =>
				downloadingItemIds.current.has(item.id) &&
				item.status === CadDownloadStatus.Pending
		);
		if (!cadDownloadStack.tabDone && pendingItems.length > 0) {
			const isPendingDownload = pendingItems.some(
				item => item.status === CadDownloadStatus.Pending
			);

			if (isPendingDownload) {
				const result = await showCancelCadDownloadModal();
				if (!result || result?.type !== 'CANCEL_DOWNLOAD') {
					return;
				}
				cancelDownload();
			}
		}

		handleDeleteItems(downloadingItemIds.current.size);
		clearDownloadingItemIds();
	};

	/**
	 * 다운로드 버튼 클릭
	 */
	const handleCadDownloadClick = useCallback(async () => {
		if (!authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}
		if (downloadingItemIds.current.size > 0) {
			showMessage(
				t(
					'components.ui.layouts.footers.stackBalloon.message.download.progress'
				)
			);
			// '다운로드 진행 중입니다.'
			return false;
		}

		if (cadDownloadStack.tabDone) {
			if (isEmpty(Array.from(checkedDoneCadDownloadItems))) {
				showMessage(
					t(
						'components.ui.layouts.footers.stackBalloon.message.download.reject'
					)
				);
				// '다운로드 할 데이터를 선택하여 주세요.'
				return false;
			}
			await cadDownload(Array.from(checkedDoneCadDownloadItems));
		} else {
			if (isEmpty(Array.from(checkedPendingCadDownloadItems))) {
				showMessage(
					t(
						'components.ui.layouts.footers.stackBalloon.message.download.reject'
					)
				);
				// '다운로드 할 데이터를 선택하여 주세요.'
				return false;
			}
			await cadDownload(Array.from(checkedPendingCadDownloadItems));
		}
	}, [
		authenticated,
		downloadingItemIds,
		cadDownloadStack,
		checkedPendingCadDownloadItems,
		checkedDoneCadDownloadItems,
	]);

	/**
	 * 다운로드 버튼 상태 변경
	 */
	const cadDownloadButton = useMemo(() => {
		const hasPendingItem =
			Array.from(checkedPendingCadDownloadItems).filter(
				item =>
					item.status === CadDownloadStatus.Pending ||
					item.status === CadDownloadStatus.Putsth
			).length > 0;
		const hasDoneItem =
			Array.from(checkedDoneCadDownloadItems).filter(
				item => item.status === CadDownloadStatus.Done
			).length > 0;
		const ableButton = (
			<span className={styles.btnArrow} onClick={handleCadDownloadClick}>
				{t('components.ui.layouts.footers.stackBalloon.downloadButton')}
				{/* 다운로드 */}
			</span>
		);

		const disableButton = (
			<span
				className={classNames(styles.btnArrow, styles.disable)}
				onClick={handleCadDownloadClick}
			>
				{t('components.ui.layouts.footers.stackBalloon.downloadButton')}
				{/* 다운로드 */}
			</span>
		);
		if (downloadingItemIds.current.size > 0) {
			return disableButton;
		}

		return tabDoneStatus
			? !!hasDoneItem
				? ableButton
				: disableButton
			: !!hasPendingItem
			? ableButton
			: disableButton;
	}, [
		checkedPendingCadDownloadItems,
		checkedDoneCadDownloadItems,
		handleCadDownloadClick,
		downloadingItemIds,
	]);

	/**
	 * 페이지 변경시 cad 데이터 불러오기
	 */
	useEffect(() => {
		const handleGenerateData = () => {
			clearDownloadingItemIds();
			generateCadData();
		};
		generateCadData();
		Router.events.on('routeChangeComplete', handleGenerateData);
		return () => Router.events.off('routeChangeComplete', handleGenerateData);
	}, [generateCadData, cadDownloadStack.items, clearDownloadingItemIds]);

	/**
	 * '즉시 다운로드' 버튼 클릭 시 'direct' 상태 인 cad 즉시다운로드 수행
	 */
	useEffect(() => {
		if (!cadDownloadStack.show || cadDownloadStack.items.length < 1) {
			return;
		}
		(async () => {
			const directItems = cadDownloadStack.items.filter(item => {
				if (item.status === CadDownloadStatus.Direct) {
					return item;
				}
			});

			if (directItems && directItems.length > 0) {
				await cadDownload(directItems);
			}
		})();
	}, [cadDownloadStack.len]);

	return (
		<div>
			{showsStatus && (
				<div className={styles.wrapper}>
					<div className={styles.balloonBox}>
						<div className={styles.balloonBoxInner}>
							<div>
								<h3 className={styles.h3}>
									{t('components.ui.layouts.footers.stackBalloon.title')}
									{/* CAD 다운로드 */}
								</h3>
								<div className={styles.tab}>
									<ul>
										<li onClick={() => setTabDone(false)}>
											<a className={!tabDoneStatus ? styles.on : ''}>
												{t(
													'components.ui.layouts.footers.stackBalloon.downloadPending'
												)}
												{/* 다운로드 대기 */}
											</a>
										</li>
										<li onClick={() => setTabDone(true)}>
											<a className={!tabDoneStatus ? '' : styles.on}>
												{t(
													'components.ui.layouts.footers.stackBalloon.downloadComplete'
												)}
												{/* 다운로드 완료 */}
											</a>
										</li>
									</ul>
								</div>
								<div className={styles.listArea}>
									<div className={styles.info}>
										<p>
											<Trans
												i18nKey="components.ui.layouts.footers.stackBalloon.totalCount"
												count={
													tabDoneStatus ? doneList.length : pendingList.length
												}
											>
												<span />
											</Trans>
										</p>
										<p>|</p>
										<p>
											<Trans
												i18nKey="components.ui.layouts.footers.stackBalloon.choosedCount"
												count={
													tabDoneStatus
														? checkedDoneCadDownloadItems.size
														: checkedPendingCadDownloadItems.size
												}
											>
												<span />
											</Trans>
											{/* 건 선택 */}
										</p>
										<div>
											<p className={styles.selectAllItem}>
												<a onClick={handleSelectAllItem}>
													{t(
														'components.ui.layouts.footers.stackBalloon.selectAll'
													)}
													{/* 전체 선택 */}
												</a>
											</p>
											<div className={styles.delimiter1}></div>
											<p className={styles.deleteItem}>
												<a onClick={handleCancelAndDelete}>
													{t(
														'components.ui.layouts.footers.stackBalloon.delete'
													)}
													{/* 삭제 */}
												</a>
											</p>
										</div>
									</div>
									<div className={styles.list}>
										{tabDoneStatus ? (
											<ul>
												{doneList.length > 0 ? (
													doneList.map((item, index) => {
														return (
															<StackBalloonItems
																key={item.id}
																item={item}
																checkedItems={checkedDoneCadDownloadItems}
																onClick={() => handleSelectDoneItem(item)}
															/>
														);
													})
												) : (
													<p className={styles.notCad}>
														{t(
															'components.ui.layouts.footers.stackBalloon.noCadData'
														)}
														{/* CAD 데이터가 없습니다 */}
													</p>
												)}
											</ul>
										) : (
											<ul>
												{pendingList.length > 0 ? (
													pendingList.map((item, index) => {
														return (
															<StackBalloonItems
																key={item.id}
																item={item}
																checkedItems={checkedPendingCadDownloadItems}
																onClick={() => handleSelectPendingItem(item)}
															/>
														);
													})
												) : (
													<p className={styles.notCad}>
														{t(
															'components.ui.layouts.footers.stackBalloon.noCadData'
														)}
														{/* CAD 데이터가 없습니다 */}
													</p>
												)}
											</ul>
										)}
									</div>
								</div>
								<div className={styles.stackMyCad}>
									<a href={url.myPage.cadDownloadHistory}>
										{t('components.ui.layouts.footers.stackBalloon.cadHistory')}
										{/* CAD 다운로드 이력조회 */}
									</a>
								</div>
								<div className={styles.btnSection}>
									{cadDownloadButton}
									<span
										className={styles.btnClose}
										onClick={() => setShowsStatus(!showsStatus)}
									>
										{t('components.ui.layouts.footers.stackBalloon.close')}
										{/* 닫기 */}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
StackBalloon.displayName = 'StackBalloon';
