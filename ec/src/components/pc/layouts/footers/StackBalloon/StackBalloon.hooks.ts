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

	const setShowsStatus = useCallback(
		(show: boolean) => {
			updateShowsStatusOperation(dispatch)(show);
			updateCadDownloadStack({ show });
		},
		[dispatch]
	);

	const setTabDone = useCallback(
		(tabDone: boolean) => {
			console.log(downloadingItemIds.current.size);
			if (downloadingItemIds.current.size > 0) {
				showMessage('다운로드 진행 중입니다. 잠시 후 다시 시도하세요.');
				return;
			}
			updateTabDoneStatusOperation(dispatch)(tabDone);
			updateCadDownloadStack({ tabDone });
		},
		[dispatch]
	);

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

	const downloadCadenas = useCallback(
		async (
			cadenasIncompleteItems: CadDownloadStackItem[],
			token: CancelToken
		) => {
			for (const item of cadenasIncompleteItems) {
				downloadingItemIds.current.add(item.id);

				//putsth ==> pending
				if (item.status === CadDownloadStatus.Putsth) {
					const pendingItem: Partial<CadDownloadStackItem> = {
						status: CadDownloadStatus.Pending,
					};
					updateCadDownloadStackItem({ id: item.id, ...pendingItem });
					updateItemOperation(dispatch)({ id: item.id, ...pendingItem });
				}
			}
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

	const cadDownload = useCallback(
		async (checkedCadDownloadItems: CadDownloadStackItem[]) => {
			const token = generateToken(c => (cancelerRef.current = c));
			const sinusIncompleteItems = checkedCadDownloadItems.filter(
				item =>
					item.type === 'sinus' &&
					item.status !== CadDownloadStatus.Done &&
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
			}
		},
		[dispatch, generateToken, cadDownloadStack]
	);

	const cancelDownload = useCallback(() => {
		console.log(cancelerRef.current);
		cancelerRef.current?.();
		cancelTimer();
	}, [cancelTimer]);

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
