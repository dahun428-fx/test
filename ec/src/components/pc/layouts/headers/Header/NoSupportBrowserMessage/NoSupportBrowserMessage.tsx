import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NoSupportBrowserMessage.module.scss';
import { isNoSupportOS } from '@/utils/device';

/**
 * No Support Browser Message
 */
export const NoSupportBrowserMessage: React.VFC = () => {
	const { t } = useTranslation();
	if (!isNoSupportOS()) {
		return null;
	}
	return (
		<div className={styles.noSupportWrap}>
			<div className={styles.noSupport}>
				<p className={styles.noSupportMessage}>
					<span className={styles.exclamationIcon} />
					{t(
						'components.ui.layouts.headers.header.noSupportBrowserMessage.message'
					)}
				</p>
			</div>
		</div>
	);
};
NoSupportBrowserMessage.displayName = 'NoSupportBrowserMessage';
