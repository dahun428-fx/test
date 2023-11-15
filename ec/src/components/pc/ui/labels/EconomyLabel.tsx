import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EconomyLabel.module.scss';

type Props = {
	className?: string;
};

/**
 * Economy label.
 */
export const EconomyLabel: React.VFC<Props> = ({ className }) => {
	const { t } = useTranslation();
	return (
		<span className={classNames(styles.economyLabel, className)}>
			{t('components.ui.labels.economyLabel.caption')}
		</span>
	);
};
EconomyLabel.displayName = 'EconomyLabel';
