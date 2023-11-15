import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './CadDownloadError.module.scss';
import { ErrorType } from './types';

type Props = {
	errorType: ErrorType;
};

/** Cad download error */
export const CadDownloadError: React.FC<Props> = ({ errorType }) => {
	const [t] = useTranslation();
	let headword;
	let primaryNote;

	switch (errorType) {
		case 'part-number-incomplete-error':
			headword = (
				<Trans i18nKey="mobile.pages.productDetail.cadDownload.cadDownloadError.notFixedPartNumberError.message">
					<strong />
				</Trans>
			);
			primaryNote = t(
				'mobile.pages.productDetail.cadDownload.cadDownloadError.notFixedPartNumberError.guide'
			);
			break;
		case 'no-support-browser-error':
			headword = t(
				'mobile.pages.productDetail.cadDownload.cadDownloadError.ie11.message'
			);
			primaryNote = t(
				'mobile.pages.productDetail.cadDownload.cadDownloadError.ie11.guide'
			);
			break;
		case 'not-available-error':
			headword = t(
				'mobile.pages.productDetail.cadDownload.cadDownloadError.notAvailable.message'
			);
			primaryNote = t(
				'mobile.pages.productDetail.cadDownload.cadDownloadError.notAvailable.guide'
			);
			break;
		default:
			break;
	}

	if (errorType === 'part-number-incomplete-error') {
		return (
			<>
				<div className={styles.incompleteMessage}>{headword}</div>
				<div>{primaryNote}</div>
			</>
		);
	}

	return (
		<>
			{headword && (
				<p className={styles.errorMessage}>
					<strong>{headword}</strong>
				</p>
			)}
			{primaryNote && (
				<ul>
					<li className={styles.errorGuide}>{primaryNote}</li>
				</ul>
			)}
		</>
	);
};
CadDownloadError.displayName = 'CadDownloadError';
