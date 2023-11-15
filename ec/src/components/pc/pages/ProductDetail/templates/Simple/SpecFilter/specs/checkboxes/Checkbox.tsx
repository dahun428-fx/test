import classNames from 'classnames';
import React from 'react';
import styles from './Checkbox.module.scss';

type Props = {
	className?: string;
	checked: boolean;
	/** weak visual for hidden spec value. not disabled */
	weak?: boolean;
	onClick?: () => void;
};

/**
 * Spec checkbox tile
 */
export const Checkbox: React.FC<Props> = ({
	className,
	checked,
	weak,
	onClick,
	children,
}) => {
	return (
		<div
			className={classNames(styles.checkbox, className, {
				[String(styles.weak)]: weak,
			})}
			role="checkbox"
			// hiddenSpec の場合は selected だったとしても checked な見た目にしない。2022/12/9 時点日本本番仕様。
			aria-checked={checked && !weak}
			onClick={() => onClick && onClick()}
		>
			{children}
		</div>
	);
};
Checkbox.displayName = 'Checkbox';
