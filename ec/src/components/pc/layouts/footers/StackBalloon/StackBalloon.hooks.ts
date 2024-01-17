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
import { selectAuth } from '@/store/modules/auth';
import { useCallback, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';

const PAST_DATE = 1;

export const useStackBalloon = () => {
	const [t] = useTranslation();

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
				//t('components.ui.layouts.footers.stackBalloon.')
				showMessage(
					t('components.ui.layouts.footers.stackBalloon.message.progress')
				);
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
	 * 1. check caddownload status 'done' or 'pending'
	 * 2. receive file url from api server
	 * 3. api data check
	 * 4. download excute ( iframe )
	 */
	const downloadCadenas = useCallback(
		async (item: CadDownloadStackItem, token) => {
			if (
				item.status === CadDownloadStatus.Done &&
				!!item.downloadHref &&
				!!item.cadFilename
			) {
				downloadCadIframe(url.cadDownload(item.downloadHref, item.cadFilename));
			} else {
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
					return false;
				}

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
			//다운로드 완료시 다운로드 중인 id 삭제
			downloadingItemIds.current.delete(item.id);
		},
		[dispatch, getCadenasFileUrl]
	);

	/**
	 * sinus cad download excute function
	 * 1. check caddownload status 'done' or 'pending'
	 * 2. receive file url from api server
	 * 3. api data check
	 * 4. download excute ( iframe )
	 */
	const downloadSinus = useCallback(
		async (item: CadDownloadStackItem, token: CancelToken) => {
			if (
				item.status === CadDownloadStatus.Done &&
				!!item.downloadHref &&
				!!item.cadFilename
			) {
				downloadCadIframe(url.cadDownload(item.downloadHref, item.fileName));
			} else {
				let partNumberList = item.requestData?.partNumberList;
				if (partNumberList) {
					try {
						let response = await downloadCad({ partNumberList }, token);

						if (response.status === '201') {
							if (response.path) {
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
								downloadUrl: getDownloadFileName(item.fileName, response.path),
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
						sinusErrorHandler();
						let localStack = getCadDownloadStack();

						if (error instanceof ApiCancelError) {
							return false;
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

								return false;
							}
						}
						return false;
					}
				}
			}
			//다운로드 완료시 다운로드 중인 id 삭제
			downloadingItemIds.current.delete(item.id);
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

	/**
	 * cad download common function << cadenas, sinus >>
	 */
	const cadDownload = useCallback(
		async (checkedCadDownloadItems: CadDownloadStackItem[]) => {
			const token = generateToken(c => (cancelerRef.current = c));
			const items = checkedCadDownloadItems
				.filter(
					item =>
						item.status !== CadDownloadStatus.Error &&
						!downloadingItemIds.current.has(item.id)
				)
				.sort((a, b) => {
					return b.created - a.created;
				});
			if (items.length > 0) {
				for await (const item of items) {
					downloadingItemIds.current.add(item.id);
					//putsth ==> pending start
					if (
						item.status === CadDownloadStatus.Putsth ||
						item.status === CadDownloadStatus.Direct
					) {
						const pendingItem: Partial<CadDownloadStackItem> = {
							status: CadDownloadStatus.Pending,
							time: '5',
						};
						//CadDownloadStatus Change in localStorage and store (putsth | cad direct ===> pending)
						updateCadDownloadStackItem({ id: item.id, ...pendingItem });
						updateItemOperation(dispatch)({ id: item.id, ...pendingItem });
					}
					await timer.sleep(1000);

					//cad download excute for type
					if (item.type === 'sinus') {
						downloadSinus(item, token);
					} else {
						downloadCadenas(item, token);
					}
				}
			}
		},
		[dispatch, generateToken, cadDownloadStack]
	);

	/**
	 * sinus error => show message (system error)=> cad download cancel => downloadingItem reset
	 */
	const sinusErrorHandler = () => {
		showMessage(
			t('components.ui.layouts.footers.stackBalloon.message.error.system')
		);
		cancelDownload();
		clearDownloadingItemIds();
	};

	/**
	 * cancel cad download use 'ref' and 'Canceler' function
	 */
	const cancelDownload = useCallback(() => {
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
