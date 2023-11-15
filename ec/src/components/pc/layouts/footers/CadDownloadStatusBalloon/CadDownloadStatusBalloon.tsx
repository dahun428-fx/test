import { Router } from 'next/router';
import React, { VFC, MouseEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCadDownload } from './CadDownloadStatusBalloon.hooks';
import styles from './CadDownloadStatusBalloon.module.scss';
import { CadDownloadItem } from '@/components/pc/layouts/footers/CadDownloadStatusBalloon/CadDownloadItem';
import { useCancelCadDownloadModal } from '@/components/pc/layouts/footers/CadDownloadStatusBalloon/CancelCadDownloadModal';
import { CadDownloadStatus } from '@/models/localStorage/CadDownloadStack';
import {
	initializeCadDownloadStack,
	updateCadDownloadStack,
	initialStack,
} from '@/services/localStorage/cadDownloadStack';

/**
 * CAD Download Ballon
 * - Showing CAD data download status, floating, hiding, number of downloaded item
 */
export const CadDownloadStatusBalloon: VFC = () => {
	const [t] = useTranslation();

	const {
		cancelDownload,
		cadDownloadStack,
		setCadDownloadStack,
		generateCadData,
		showsStatus,
		setShowsStatus,
		clearDownloadingItemIds,
	} = useCadDownload();

	const showCancelCadDownloadModal = useCancelCadDownloadModal();

	const handleClickCadDownloadStatusButton = (event: MouseEvent) => {
		event.preventDefault();
		updateCadDownloadStack({ show: !showsStatus });
		setShowsStatus(!showsStatus);
	};

	const handleHide = (event: MouseEvent) => {
		event.preventDefault();
		setShowsStatus(false);
	};

	const handleCancelDownload = async (event: MouseEvent) => {
		event.preventDefault();

		const isPendingDownload = cadDownloadStack?.items.some(
			item => item.status !== CadDownloadStatus.Done
		);

		if (isPendingDownload) {
			const result = await showCancelCadDownloadModal();
			if (!result || result?.type !== 'CANCEL_DOWNLOAD') {
				return;
			}

			cancelDownload();
		}

		setShowsStatus(false);
		setCadDownloadStack(initialStack);
		initializeCadDownloadStack();
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

	if (!cadDownloadStack || !cadDownloadStack.items.length) {
		return null;
	}

	return (
		<>
			<div className={styles.cadDownloadStatusBalloonWrapper}>
				<a
					href="#"
					className={styles.cadDownloadStatusBalloon}
					onClick={handleClickCadDownloadStatusButton}
				/>
			</div>

			{cadDownloadStack.done > 0 && (
				<span className={styles.badge}>{cadDownloadStack.done}</span>
			)}

			{showsStatus && (
				<div className={styles.statusListBox}>
					<div className={styles.statusListTitle}>
						<div className={styles.statusListTitleBox}>
							<h3 className={styles.statusListTitle}>
								{cadDownloadStack.done}/{cadDownloadStack.len}{' '}
								{t(
									'components.ui.layouts.footers.cadDownloadStatusBalloon.downloadsCompleted'
								)}
							</h3>
							<div className={styles.statusListTitleAside}>
								<ul className={styles.statusListControlButtonList}>
									<li className={styles.buttonItem}>
										<a
											onClick={handleHide}
											href="#"
											className={styles.statusListHiddenButton}
										>
											{t(
												'components.ui.layouts.footers.cadDownloadStatusBalloon.hide'
											)}
										</a>
									</li>
									<li className={styles.buttonItem}>
										<a
											href="#"
											className={styles.statusListClearButton}
											onClick={handleCancelDownload}
										>
											{t(
												'components.ui.layouts.footers.cadDownloadStatusBalloon.cancelDownload'
											)}
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className={styles.statusList}>
						<ul>
							{cadDownloadStack.items.map((item, index) => (
								<li className={styles.statusItem} key={index}>
									<CadDownloadItem item={item} />
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</>
	);
};
