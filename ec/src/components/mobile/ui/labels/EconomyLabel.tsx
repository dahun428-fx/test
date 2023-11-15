import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EconomyLabel.module.scss';

type Props = {
	className?: string;
	backgroundSize?: 'cover' | 'auto';
	width?: number;
	height?: number;
};

/**
 * Economy label.
 */
export const EconomyLabel: React.VFC<Props> = ({
	className,
	backgroundSize = 'cover',
	width = 81,
	height = 28,
}) => {
	const { t } = useTranslation();
	return (
		<span
			className={classNames(styles.economyLabel, className, {
				[String(styles.sizeAuto)]: backgroundSize === 'auto',
			})}
			style={{ width, height }}
		>
			{t('mobile.ui.labels.economyLabel.caption')}
		</span>
	);
};
EconomyLabel.displayName = 'EconomyLabel';
