import classNames from 'classnames';
import React from 'react';
import styles from './Label.module.scss';

export const Themes = [
	'strong',
	'standard',
	'disabled',
	'pict',
	'grade',
] as const;
export type Theme = typeof Themes[number];

export type Props = {
	/** label theme */
	theme?: Theme;
	/** class name */
	className?: string;
};

/**
 * Label Component.
 */
export const Label: React.FC<Props> = ({
	children,
	className,
	theme = 'standard',
}) => {
	return (
		<span className={classNames(styles.caption, styles[theme], className)}>
			{children}
		</span>
	);
};
Label.displayName = 'Label';
