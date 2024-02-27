import classnames from 'classnames';
import React from 'react';
import styles from './RadioButton.module.scss';

type Props = {
	className?: string;
	checked: boolean;
	onClick?: () => void;
};

/**
 * Radio Button UI
 * @return HTMLLIElement
 */
export const RadioButton: React.FC<Props> = ({
	className,
	checked,
	onClick,
	children,
}) => {
	return (
		<li
			className={classnames(
				styles.listDefault,
				className,
				checked ? styles.checked : styles.noCheck
			)}
			onClick={onClick}
		>
			{children}
		</li>
	);
};
RadioButton.displayName = 'RadioButton';
