import { useTranslation } from 'react-i18next';
import styles from './CadPreviewError.module.scss';
import { ErrorType } from '@/components/pc/pages/CadPreview/CadPreviewError/types';

export type Props = {
	errorType: ErrorType;
	isSinus?: boolean;
};

/**
 * Preview Error
 */
export const CadPreviewError: React.VFC<Props> = ({ errorType, isSinus }) => {
	const { t } = useTranslation();

	let headword;
	let primaryNote;
	let secondaryNote;

	switch (errorType) {
		// incomplete part number
		case 'part-number-incomplete-error':
			headword = t(
				'pages.cadPreview.cadPreviewError.headword.partNumberIncomplete'
			);
			primaryNote = t(
				'pages.cadPreview.cadPreviewError.primaryNote.partNumberIncomplete'
			);
			secondaryNote = t(
				'pages.cadPreview.cadPreviewError.secondaryNote.partNumberIncomplete'
			);
			break;
		// unavailable part number
		case 'unavailable-part-number-error':
			headword = t(
				'pages.cadPreview.cadPreviewError.headword.unavailablePartNumber'
			);
			primaryNote = isSinus
				? t(
						'pages.cadPreview.cadPreviewError.primaryNote.unavailablePartNumberSinus'
				  )
				: null;
			break;
		// no support browser
		case 'no-support-browser-error':
			headword = t(
				'pages.cadPreview.cadPreviewError.headword.noSupportBrowser'
			);
			primaryNote = isSinus
				? t(
						'pages.cadPreview.cadPreviewError.primaryNote.noSupportBrowserSinus'
				  )
				: null;
			break;
		// unknown server error
		case 'unknown-server-error':
			primaryNote = t(
				'pages.cadPreview.cadPreviewError.primaryNote.unknownServerError'
			);
			break;
		default:
			break;
	}

	return (
		<div className={styles.messageBox}>
			{headword && <div className={styles.headword}>{headword}</div>}
			<ul>
				<li className={styles.note}>{primaryNote}</li>
				{secondaryNote && <li className={styles.note}>{secondaryNote}</li>}
			</ul>
		</div>
	);
};

CadPreviewError.displayName = 'CadPreviewError';
