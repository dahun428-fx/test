import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './CancelCadDownloadModal.module.scss';
import { Button } from '@/components/pc/ui/buttons';

export type CancelCadDownloadResult = {
	type: 'CANCEL_DOWNLOAD' | 'CONTINUE_DOWNLOAD';
};

type Props = {
	close?: (result?: CancelCadDownloadResult) => void;
};

/**
 * Cancel Cad Download Content
 */
export const CancelCadDownloadContent: React.VFC<Props> = ({ close }) => {
	const { t } = useTranslation();

	const handleCancelDownload = () => {
		close?.({ type: 'CANCEL_DOWNLOAD' });
	};

	const handleContinueDownload = () => {
		close?.({ type: 'CONTINUE_DOWNLOAD' });
	};

	return (
		<div className={styles.container}>
			<Trans i18nKey="components.ui.layouts.footers.cadDownloadStatusBalloon.cancelCadDownloadModal.message">
				<br />
			</Trans>

			<ul className={styles.buttonList}>
				<li className={styles.buttonItem}>
					<Button size="max" onClick={handleCancelDownload}>
						{t(
							'components.ui.layouts.footers.cadDownloadStatusBalloon.cancelCadDownloadModal.cancelButton'
						)}
					</Button>
				</li>
				<li className={styles.buttonItem}>
					<Button size="max" onClick={handleContinueDownload}>
						{t(
							'components.ui.layouts.footers.cadDownloadStatusBalloon.cancelCadDownloadModal.continueButton'
						)}
					</Button>
				</li>
			</ul>
		</div>
	);
};

CancelCadDownloadContent.displayName = 'CancelCadDownloadContent';
