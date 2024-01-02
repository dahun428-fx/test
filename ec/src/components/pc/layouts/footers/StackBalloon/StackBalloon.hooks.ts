import {
	CadDownloadStack,
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';
import { useSelector } from '@/store/hooks';
import {
	selectShowCadDownloadBalloon,
	selectCadDownloadStack,
	updateStackOperation,
	updateShowsStatusOperation,
	updateTabDoneStatusOperation,
	removeItemOperation,
	updateItemOperation,
	setErrorOperation,
} from '@/store/modules/common/stack';
import { refreshAuth, selectAuth } from '@/store/modules/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	getCadDownloadStack,
	updateCadDownloadStackItem,
	updateCadDownloadStack,
	removeExpiryItemOnlyIfNeeded,
	removePendingItemIfNeeded,
} from '@/services/localStorage/cadDownloadStack';
import { useApiCancellation } from '@/api/clients/cancel/useApiCancellation';
import { CancelToken, Canceler } from 'axios';
import { useGetCadenasFileUrl } from '@/utils/domain/cad/cadenas.hooks';
import { downloadCadIframe, getDownloadFileName } from '@/utils/cad';
import { url } from '@/utils/url';
import { getSelectedCadDataFormat } from '@/utils/domain/cad/shared';
import { getCadFormat } from '@/utils/domain/cad/cadenas';
import { useTimer } from '@/utils/timer';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { downloadCad } from '@/api/services/sinus/downloadCad';
import dayjs from 'dayjs';
import { CadDownloadApiError } from '@/errors/api/CadDownloadApiError';
import { ApiCancelError } from '@/errors/api/ApiCancelError';

const PAST_DATE = 1;

export const useStackBalloon = () => {
	const { generateToken } = useApiCancellation();
	const showLoginModal = useLoginModal();
	const { showMessage } = useMessageModal();

	const cancelerRef = useRef<Canceler>();
	const showsStatus = useSelector(selectShowCadDownloadBalloon);
	const cadDownloadStack = useSelector(selectCadDownloadStack);

	const auth = useSelector(selectAuth);
	const downloadingItemIds = useRef<Set<string>>(new Set());
	const initialized = useRef(false);

	const timer = useTimer();

	const dispatch = useDispatch();
	const { getCadenasFileUrl, cancel: cancelTimer } = useGetCadenasFileUrl();

	/**
	 * footer stack open or close function
	 */
	const setShowsStatus = useCallback(
		(show: boolean) => {
			updateShowsStatusOperation(dispatch)(show); //redux dispatch : show => !show ( toggle )
			updateCadDownloadStack({ show }); //localStorage : show => !show (toggle)
		},
		[dispatch]
	);

	/**
	 * footer stack '다운로드 대기' or '다운로드 완료'
	 * tabDone true : 다운로드 완료 탭
	 * tabDone false : 다운로드 대기 탭
	 */
	const setTabDone = useCallback(
		(tabDone: boolean) => {
			if (downloadingItemIds.current.size > 0) {
				showMessage('다운로드 진행 중입니다. 잠시 후 다시 시도하세요.');
				return;
			}
			updateTabDoneStatusOperation(dispatch)(tabDone); //redux dispatch : tabDone => !tabDone ( tooggle )
			updateCadDownloadStack({ tabDone }); //localStorage : tabDone => !tabDone (toggle)
		},
		[dispatch]
	);

	/**
	 * redux dispatch stack value change ( update )
	 */
	const setCadDownloadStack = useCallback(
		(stack: CadDownloadStack) => {
			updateStackOperation(dispatch)(stack);
		},
		[dispatch]
	);

	/**
	 * Update CAD Download state
	 * - create new stack seed
	 * */
	const updateCadDownloadState = useCallback(
		(stack: CadDownloadStack) => {
			const stackWithSeed = { ...stack, seed: Math.random() };
			updateCadDownloadStack(stackWithSeed);
			setCadDownloadStack(stackWithSeed);
			return stackWithSeed;
		},
		[setCadDownloadStack]
	);

	/**
	 * stack cad data insert from localStorage
	 *  when open new page or route new page / user login and user logout
	 */
	const generateCadData = useCallback(async () => {
		if (!initialized.current) {
			removeExpiryItemOnlyIfNeeded();
			removePendingItemIfNeeded();
			let stack = getCadDownloadStack();
			setCadDownloadStack(stack);
			initialized.current = true;
		}
	}, [
		dispatch,
		showsStatus,
		cadDownloadStack,
		auth.authenticated,
		auth.isReady,
		setCadDownloadStack,
	]);

	/**
	 * cadenas cad download excute function
	 * 1. downloadItemIds ref function excute (intialize download target cad data)
	 * 2. change status putsth to pending
	 * 3. check caddownload status 'done' or 'pending'
	 * 4. download excute
	 */
	const downloadCadenas = useCallback(
		async (
			cadenasIncompleteItems: CadDownloadStackItem[],
			token: CancelToken
		) => {
			let localStack = getCadDownloadStack();
			updateCadStatusToPutsth(cadenasIncompleteItems);

			for await (const item of cadenasIncompleteItems) {
				if (
					item.status === CadDownloadStatus.Done &&
					!!item.downloadHref &&
					!!item.cadFilename
				) {
					await timer.sleep(1000);
					downloadCadIframe(
						url.cadDownload(item.downloadHref, item.cadFilename)
					);
				} else {
					//data가 없을 경우 해당 함수에서 MAX_CADENAS_RETRY(50) count 만큼 접근함으로,
					//실패했을 경우에 ApplicationError 로 처리됨, --> 사용자에게는 다운로드 실패로 처리
					const data = await getCadenasFileUrl(item.url, token);

					if (!data || data.expired) {
						if (!data) {
							// Remove from LocalStorage
							updateCadDownloadStackItem({
								id: item.id,
								status: CadDownloadStatus.Error,
							});
							//print error status
							updateItemOperation(dispatch)({
								id: item.id,
								status: CadDownloadStatus.Error,
							});
						} else if (data.expired) {
							// Remove from LocalStorage
							updateCadDownloadStackItem({ id: item.id, expiry: PAST_DATE });
							removeExpiryItemOnlyIfNeeded();
							// Remove from state (sigh...)
							removeItemOperation(dispatch)(item.id);
						}
						continue;
					}

					await timer.sleep(1000);

					downloadCadIframe(url.cadDownload(data.url, item.fileName));

					// Cookie から選択された CAD データフォーマットを取得
					const selectedFormat = getSelectedCadDataFormat();

					//pending ==> done
					const updateItem: Partial<CadDownloadStackItem> = {
						status: CadDownloadStatus.Done,
						cadSection: 'PT',
						downloadHref: data.url,
						cadFilename: data.file,
						cadFormat: getCadFormat(selectedFormat),
						cadType: (selectedFormat.grp || '2D').toUpperCase(),
						data,
						selected: selectedFormat,
						downloadUrl: getDownloadFileName(data.url, item.fileName),
					};

					updateCadDownloadStackItem({ id: item.id, ...updateItem });
					updateItemOperation(dispatch)({ id: item.id, ...updateItem });
				}
			}
		},
		[dispatch, getCadenasFileUrl]
	);

	const downloadSinus = useCallback(
		async (
			sinusIncompleteItems: CadDownloadStackItem[],
			token: CancelToken
		) => {
			let localStack = getCadDownloadStack();
			updateCadStatusToPutsth(sinusIncompleteItems);
			let index = 0;
			for await (const item of sinusIncompleteItems) {
				if (
					item.status === CadDownloadStatus.Done &&
					!!item.downloadHref &&
					!!item.cadFilename
				) {
					await timer.sleep(1000);
					downloadCadIframe(url.cadDownload(item.downloadHref, item.fileName));
				} else {
					let partNumberList = item.requestData?.partNumberList;

					if (partNumberList) {
						downloadingItemIds.current.add(item.id);
						if (index == 0) {
							partNumberList = [];
							index++;
						}

						try {
							let response = await downloadCad({ partNumberList }, token);
							// if (index == 0) {
							// 	// partNumberList = [];
							// 	response.status = '404';
							// 	index++;
							// }
							if (response.status === '201') {
								if (response.path) {
									await timer.sleep(1000);
									downloadCadIframe(
										url.cadDownload(response.path, item.fileName)
									);
								}
								const selectedFormat = getSelectedCadDataFormat();
								const updateItem: Partial<CadDownloadStackItem> = {
									...item,
									status: CadDownloadStatus.Done,
									expiry: dayjs().add(30, 'day').valueOf(),
									cadSection: 'PACD',
									cadFilename: response.path ?? '',
									cadFormat: selectedFormat.format ?? '',
									cadType: (selectedFormat.grp || '2D').toUpperCase(),
									partNumber: item.dynamicCadModifiedCommon.pn,
									downloadHref: response.path,
									selected: selectedFormat,
									downloadUrl: getDownloadFileName(
										item.fileName,
										response.path
									),
								};
								updateCadDownloadStackItem({ id: item.id, ...updateItem });
								updateItemOperation(dispatch)({ id: item.id, ...updateItem });
							} else if (Number(response.status) >= 400) {
								if (response.status === '404') {
									setErrorOperation(dispatch)({
										stackId: item.id,
										type: 'sinus-not-found',
									});
								}
								throw new CadDownloadApiError(Number(response.status));
							}
						} catch (error: any) {
							showMessage(
								'시스템 오류가 발생했습니다. 잠시 후 다시 이용해 주십시오.'
							);
							cancelDownload();
							clearDownloadingItemIds();
							if (error instanceof ApiCancelError) {
								return;
							}

							if (typeof error === 'object') {
								let itemList: CadDownloadStackItem[] = [];

								// NOTE: Handling timeout error.
								if (
									!(error instanceof CadDownloadApiError) &&
									error.status === 500
								) {
									itemList = localStack.items.map(stackItem => {
										if (stackItem.id === item.id) {
											return {
												...stackItem,
												status: CadDownloadStatus.Timeout,
											};
										}
										return stackItem;
									});
								} else {
									// itemList = localStack.items.filter(
									// 	stackItem => stackItem.id !== item.id
									// );
									itemList = localStack.items.map(stackItem => {
										if (stackItem.id === item.id) {
											return {
												...stackItem,
												status: CadDownloadStatus.Error,
											};
										}
										return stackItem;
									});
								}

								localStack = updateCadDownloadState({
									...localStack,
									items: itemList,
									len: itemList.length,
								});

								// NOTE: Do not show error message modal when having 404 error.
								if (error.status === 404) {
									setErrorOperation(dispatch)({
										stackId: item.id,
										type: 'sinus-not-found',
									});

									return;
								}
							}
							// console.log('throw error')
							// throw error;
							continue;
						}
					}
				}
			}
		},
		[
			cadDownloadStack,
			dispatch,
			generateToken,
			setCadDownloadStack,
			setShowsStatus,
			updateCadDownloadState,
		]
	);

	const updateCadStatusToPutsth = (items: CadDownloadStackItem[]) => {
		for (const item of items) {
			downloadingItemIds.current.add(item.id);

			//putsth ==> pending
			if (item.status === CadDownloadStatus.Putsth) {
				const pendingItem: Partial<CadDownloadStackItem> = {
					status: CadDownloadStatus.Pending,
					time: '5',
				};
				updateCadDownloadStackItem({ id: item.id, ...pendingItem });
				updateItemOperation(dispatch)({ id: item.id, ...pendingItem });
			}
		}
	};

	/**
	 * cad download common function < cadenas, sinus >
	 */
	const cadDownload = useCallback(
		async (checkedCadDownloadItems: CadDownloadStackItem[]) => {
			const token = generateToken(c => (cancelerRef.current = c));
			const sinusIncompleteItems = checkedCadDownloadItems.filter(
				item =>
					item.type === 'sinus' &&
					// item.status !== CadDownloadStatus.Done &&
					item.status !== CadDownloadStatus.Error &&
					!downloadingItemIds.current.has(item.id)
			);

			const cadenasIncompleteItems = checkedCadDownloadItems.filter(
				item =>
					item.type !== 'sinus' &&
					// item.status !== CadDownloadStatus.Done &&
					item.status !== CadDownloadStatus.Error &&
					!downloadingItemIds.current.has(item.id)
			);

			if (cadenasIncompleteItems.length > 0) {
				await downloadCadenas(cadenasIncompleteItems, token);
			} else if (sinusIncompleteItems.length > 0) {
				await downloadSinus(sinusIncompleteItems, token);
			}
		},
		[dispatch, generateToken, cadDownloadStack]
	);

	/**
	 * cancel cad download use 'ref' and 'Canceler' function
	 */
	const cancelDownload = useCallback(() => {
		console.log(cancelerRef.current);
		cancelerRef.current?.();
		cancelTimer();
	}, [cancelTimer]);

	/**
	 * downloadingItemIds clear
	 */
	const clearDownloadingItemIds = () => {
		downloadingItemIds.current.clear();
	};

	return {
		authenticated: auth.authenticated,
		showsStatus,
		cadDownloadStack,
		setShowsStatus,
		setTabDone,
		generateCadData,
		cadDownload,
		downloadingItemIds,
		clearDownloadingItemIds,
		showLoginModal,
		showMessage,
		cancelDownload,
	};
};
