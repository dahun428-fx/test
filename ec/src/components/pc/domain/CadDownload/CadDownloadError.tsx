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
			headword = t(
				'components.domain.cadDownload.cadDownloadError.notFixedPartNumberError.message'
			);
			primaryNote = (
				<Trans i18nKey="components.domain.cadDownload.cadDownloadError.notFixedPartNumberError.guide">
					<br />
				</Trans>
			);
			break;
		case 'no-support-browser-error':
			headword = t(
				'components.domain.cadDownload.cadDownloadError.ie11.message'
			);
			primaryNote = t(
				'components.domain.cadDownload.cadDownloadError.ie11.guide'
			);
			break;
		case 'not-available-error':
			headword = t(
				'components.domain.cadDownload.cadDownloadError.notAvailable.message'
			);
			primaryNote = t(
				'components.domain.cadDownload.cadDownloadError.notAvailable.guide'
			);
			break;
		default:
			break;
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
