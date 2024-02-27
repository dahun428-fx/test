import { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';
import styles from './CatchCopy.module.scss';

type Props = {
	catchCopy?: string;
	catchCopyLength?: number;
};
const CATCH_COPY_MAX_LENGTH = 100;

/**
 * catch copy
 */
export const CatchCopy: React.VFC<Props> = ({ catchCopy, catchCopyLength }) => {
	const catchCopyContent = useMemo(() => {
		if (!catchCopy) {
			return '';
		}

		try {
			/** Remark: require to use the downgraded version of sanitize-html 1.27.5 due to compatibility with IE11.  There might be some security risk, but these HTML text is from SeriesResponse Api (not from user-input) */
			const cleanedCatchCopy = sanitizeHtml(catchCopy, {
				allowedTags: [], // Remove all HTML tags
				allowedAttributes: {},
			});
			if (
				cleanedCatchCopy.length > (catchCopyLength || CATCH_COPY_MAX_LENGTH)
			) {
				return (
					cleanedCatchCopy.substring(
						0,
						catchCopyLength || CATCH_COPY_MAX_LENGTH
					) + '...'
				);
			}
			return cleanedCatchCopy;
		} catch {
			return '';
		}
	}, [catchCopy, catchCopyLength]);

	return <p className={styles.catchCopy}>{catchCopyContent}</p>;
};
CatchCopy.displayName = 'CatchCopy';
