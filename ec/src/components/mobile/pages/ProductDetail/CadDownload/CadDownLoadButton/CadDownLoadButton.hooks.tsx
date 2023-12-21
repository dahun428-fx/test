// CadDownloadStatusBalloon.hooks.ts から移植。localStorage を触らないように変更しています。
import { Canceler, CancelToken } from 'axios';
import dayjs from 'dayjs';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useApiCancellation } from '@/api/clients/cancel/useApiCancellation';
import { downloadCad } from '@/api/services/sinus/downloadCad';
import { ApiCancelError } from '@/errors/api/ApiCancelError';
import { CadDownloadApiError } from '@/errors/api/CadDownloadApiError';
import { ectLogger } from '@/logs/ectLogger';
import {
	CadDownloadStack,
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack_origin';
import { selectAuth } from '@/store/modules/auth';
import {
	clearOperation,
	removeItemOperation,
	selectCadDownloadStack,
	selectShowCadDownloadBalloon,
	setErrorOperation,
	updateItemOperation,
	updateShowsStatusOperation,
	updateStackOperation,
} from '@/store/modules/cadDownload';
import { downloadCadLink, getDownloadFileName } from '@/utils/cad';
import { getCadFormat } from '@/utils/domain/cad/cadenas';
import { useGetCadenasFileUrl } from '@/utils/domain/cad/cadenas.hooks';
import { getSelectedCadDataFormat } from '@/utils/domain/cad/shared';
import { url } from '@/utils/url';

export const useCadDownload = () => {
	const [t] = useTranslation();
	const { generateToken } = useApiCancellation();
	const cancelerRef = useRef<Canceler>();
	const auth = useSelector(selectAuth);
	const cadDownloadStack = useSelector(selectCadDownloadStack);
	const showsStatus = useSelector(selectShowCadDownloadBalloon);
	const downloadingItemIds = useRef<Set<string>>(new Set());

	const dispatch = useDispatch();

	const { getCadenasFileUrl, cancel: cancelTimer } = useGetCadenasFileUrl();

	const setCadDownloadStack = useCallback(
		(stack: CadDownloadStack) => {
			updateStackOperation(dispatch)(stack);
		},
		[dispatch]
	);

	const setShowsStatus = useCallback(
		(show: boolean) => {
			updateShowsStatusOperation(dispatch)(show);
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
			setCadDownloadStack(stackWithSeed);
			return stackWithSeed;
		},
		[setCadDownloadStack]
	);

	/**
	 * Generate and download CADENAS CAD data
	 * - NOTE: No limitation parallel download
	 */
	const downloadCadenas = useCallback(
		(cadenasIncompleteItems: CadDownloadStackItem[], token: CancelToken) => {
			// 1. poll download.xml
			// 2. update LocalStorage
			// 3. download zip
			// 4. update LocalStorage
			cadenasIncompleteItems.forEach(async item => {
				downloadingItemIds.current.add(item.id);
				const data = await getCadenasFileUrl(item.url, token);

				if (!data || data.expired) {
					// Remove from state (sigh...)
					removeItemOperation(dispatch)(item.id);
					return;
				}

				downloadCadLink(url.cadDownload(data.url, item.fileName));

				// Cookie から選択された CAD データフォーマットを取得
				const selectedFormat = getSelectedCadDataFormat();

				// NOTE: 必要ない項目がいろいろあるが、ひとまず現行に合わせる
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

				// update state
				updateItemOperation(dispatch)({ id: item.id, ...updateItem });

				ectLogger.cad.download(item, t);
			});
		},
		[dispatch, getCadenasFileUrl, t]
	);

	/** Generate and download SINUS/CADENAS CAD data */
	const generateCadData = useCallback(async () => {
		if (!auth.isReady || !auth.authenticated) {
			return;
		}

		const token = generateToken(c => (cancelerRef.current = c));

		const stack: CadDownloadStack = cadDownloadStack;

		const sinusIncompleteItems = stack.items.filter(
			item =>
				item.type === 'sinus' &&
				item.status !== CadDownloadStatus.Done &&
				!downloadingItemIds.current.has(item.id)
		);

		// CADENAS CAD Data 生成状態更新確認リスト
		const cadenasIncompleteItems = stack.items.filter(
			item =>
				item.type !== 'sinus' &&
				item.status !== CadDownloadStatus.Done &&
				!downloadingItemIds.current.has(item.id)
		);

		if (sinusIncompleteItems.length > 0) {
			let localStack = { ...stack };

			sinusIncompleteItems.forEach(item => {
				const partNumberList = item.requestData?.partNumberList;

				if (partNumberList) {
					downloadingItemIds.current.add(item.id);

					downloadCad({ partNumberList }, token)
						.then(response => {
							if (response.status === '201') {
								const itemList: CadDownloadStackItem[] = localStack.items.map(
									stackItem => {
										if (stackItem.id === item.id) {
											// Cookie から選択された CAD データフォーマットを取得
											const selectedFormat = getSelectedCadDataFormat();
											return {
												...stackItem,
												status: CadDownloadStatus.Done,
												expiry: dayjs().add(30, 'day').valueOf(),
												cadSection: 'PCAD',
												cadFilename: response.path ?? '',
												cadFormat: selectedFormat.format ?? '',
												cadType: (selectedFormat.grp || '2D').toUpperCase(),
												partNumber: stackItem.dynamicCadModifiedCommon.pn,
												downloadHref: response.path,
												selected: selectedFormat,
												downloadUrl: getDownloadFileName(
													stackItem.fileName,
													response.path
												),
											};
										}
										return stackItem;
									}
								);

								if (response.path) {
									downloadCadLink(
										url.cadDownload(response.path, item.fileName)
									);
								}
								localStack = updateCadDownloadState({
									...localStack,
									items: itemList,
									done: itemList.filter(
										item => item.status === CadDownloadStatus.Done
									).length,
								});

								ectLogger.cad.download(item, t);
							} else if (Number(response.status) >= 400) {
								if (response.status === '404') {
									setErrorOperation(dispatch)({
										stackId: item.id,
										type: 'sinus-not-found',
									});

									ectLogger.cad.error({
										partNumber: partNumberList[0]?.partNumber ?? '',
										seriesCode: partNumberList[0]?.seriesCode ?? '',
										projectPath: url.sinus().download(),
										errorType: response.status,
									});
								}
								throw new CadDownloadApiError(Number(response.status));
							}
						})
						.catch(error => {
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
									itemList = localStack.items.filter(
										stackItem => stackItem.id !== item.id
									);
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
									ectLogger.cad.error({
										partNumber: partNumberList[0]?.partNumber ?? '',
										seriesCode: partNumberList[0]?.seriesCode ?? '',
										projectPath: url.sinus().download(),
										errorType: error.status,
									});
									return;
								}
							}
							throw error;
						});
				}
			});
		}

		if (cadenasIncompleteItems.length > 0) {
			downloadCadenas(cadenasIncompleteItems, token);
		}
	}, [
		auth.authenticated,
		auth.isReady,
		cadDownloadStack,
		dispatch,
		downloadCadenas,
		generateToken,
		t,
		updateCadDownloadState,
	]);

	const cancelDownload = useCallback(() => {
		cancelerRef.current?.();
		cancelTimer();
	}, [cancelTimer]);

	const clearDownloadingItemIds = () => {
		downloadingItemIds.current.clear();
	};

	const clear = () => {
		clearOperation(dispatch)();
	};

	return {
		clear,
		cancelDownload,
		showsStatus,
		setShowsStatus,
		cadDownloadStack,
		setCadDownloadStack,
		generateCadData,
		clearDownloadingItemIds,
	};
};
