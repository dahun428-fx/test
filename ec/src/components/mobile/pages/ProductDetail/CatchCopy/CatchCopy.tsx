import { RefCallback, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CatchCopy.module.scss';
import { LegacyStyledHtml } from '@/components/mobile/domain/LegacyStyledHtml';

type Props = {
	catchCopy?: string;
};

/**
 * catch copy
 */
export const CatchCopy: React.VFC<Props> = ({ catchCopy }) => {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);
	const [overflow, setOverflow] = useState(false);

	const catchCopyRef = useCallback<RefCallback<HTMLElement>>(ref => {
		if (ref && ref.parentElement) {
			setOverflow(ref.clientHeight > ref.parentElement.clientHeight);
		}
	}, []);

	if (!catchCopy) {
		return null;
	}

	return (
		<div className={styles.container}>
			<div className={styles.textContainer} data-expanded={isOpen}>
				<LegacyStyledHtml
					ref={catchCopyRef}
					html={catchCopy}
					parentClassName={styles.catchCopy}
					childHtmlTag="p"
				/>
			</div>
			{overflow && (
				<div
					className={styles.trigger}
					onClick={() => setIsOpen(prev => !prev)}
				>
					{!isOpen
						? t('mobile.pages.productDetail.catchCopy.readMore')
						: t('mobile.pages.productDetail.catchCopy.close')}
				</div>
			)}
		</div>
	);
};
CatchCopy.displayName = 'CatchCopy';
