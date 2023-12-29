import React, { useEffect } from 'react';
import { useStackBalloon } from './StackBalloon.hooks';
import styles from './StackBalloon.module.scss';
import { StackBalloonItems } from './StackBallonItem';
import { CadDownloadStackItem } from '@/models/localStorage/CadDownloadStack';
import { isEmpty } from '@/utils/predicate';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { Router } from 'next/router';
import { selectAuthenticated } from '@/store/modules/auth';
import { useSelector } from '@/store/hooks';
import { useLoginModal } from '@/components/pc/modals/LoginModal';

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
	handleDeleteItems: () => void;
	// handleCadDownloadClick: () => void;
	resetCheckedPendingCadDownloadItems: () => void;
	resetCheckedDoneCadDownloadItems: () => void;
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
	resetCheckedPendingCadDownloadItems,
	resetCheckedDoneCadDownloadItems,
	// handleCadDownloadClick,
}) => {
	const {
		showsStatus,
		cadDownloadStack,
		authenticated,
		setShowsStatus,
		setTabDone,
		cadDownload,
		clearDownloadingItemIds,
		generateCadData,
		showLoginModal,
		showMessage,
	} = useStackBalloon();

	const tabDoneStatus = cadDownloadStack.tabDone;

	const handleCadDownloadClick = async () => {
		if (!authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}

		if (cadDownloadStack.tabDone) {
			console.log(checkedDoneCadDownloadItems);
			if (isEmpty(Array.from(checkedDoneCadDownloadItems))) {
				showMessage('다운로드 할 데이터를 선택하여 주세요.');
				return false;
			}
			await cadDownload(Array.from(checkedDoneCadDownloadItems));
			resetCheckedDoneCadDownloadItems();
		} else {
			if (isEmpty(Array.from(checkedPendingCadDownloadItems))) {
				showMessage('다운로드 할 데이터를 선택하여 주세요.');
				return false;
			}
			console.log(checkedPendingCadDownloadItems);
			await cadDownload(Array.from(checkedPendingCadDownloadItems));
			resetCheckedPendingCadDownloadItems();
		}
		clearDownloadingItemIds();
	};

	useEffect(() => {
		const handleGenerateData = () => {
			clearDownloadingItemIds();
			generateCadData();
		};
		generateCadData();
		Router.events.on('routeChangeComplete', handleGenerateData);
		return () => Router.events.off('routeChangeComplete', handleGenerateData);
	}, [generateCadData, cadDownloadStack.items, clearDownloadingItemIds]);

	return (
		<div>
			{showsStatus && (
				<div className={styles.wrapper}>
					<div className={styles.balloonBox}>
						<div className={styles.balloonBoxInner}>
							<div>
								<h3 className={styles.h3}>CAD 다운로드</h3>
								<div className={styles.tab}>
									<ul>
										<li onClick={() => setTabDone(false)}>
											<a className={!tabDoneStatus ? styles.on : ''}>
												다운로드 대기
											</a>
										</li>
										<li onClick={() => setTabDone(true)}>
											<a className={!tabDoneStatus ? '' : styles.on}>
												다운로드 완료
											</a>
										</li>
									</ul>
								</div>
								<div className={styles.listArea}>
									<div className={styles.info}>
										<p>
											총
											<span>
												{tabDoneStatus ? doneList.length : pendingList.length}
											</span>
											건
										</p>
										<p>|</p>
										<p>
											<span>
												{tabDoneStatus
													? checkedDoneCadDownloadItems.size
													: checkedPendingCadDownloadItems.size}
											</span>
											건 선택
										</p>
										<div>
											<p className={styles.selectAllItem}>
												<a onClick={handleSelectAllItem}>전체 선택</a>
											</p>
											<div className={styles.delimiter1}></div>
											<p className={styles.deleteItem}>
												<a onClick={handleDeleteItems}>삭제</a>
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
													<p className={styles.notCad}>CAD 데이터가 없습니다</p>
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
													<p className={styles.notCad}>CAD 데이터가 없습니다</p>
												)}
											</ul>
										)}
									</div>
								</div>
								<div className={styles.stackMyCad}>
									<a>CAD 다운로드 이력조회</a>
								</div>
								<div className={styles.btnSection}>
									<span
										className={styles.btnArrow}
										onClick={() => handleCadDownloadClick()}
									>
										다운로드
									</span>
									<span
										className={styles.btnClose}
										onClick={() => setShowsStatus(!showsStatus)}
									>
										닫기
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
