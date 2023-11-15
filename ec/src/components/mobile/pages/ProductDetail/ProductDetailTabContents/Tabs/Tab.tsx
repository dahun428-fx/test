import React from 'react';
import styles from './Tab.module.scss';

type Props = {
	value: string;
	href?: string;
	selected: boolean;
	onClick: (value: string) => void;
};

export const Tab: React.FC<Props> = ({
	value,
	href = '',
	selected,
	onClick,
	children,
}) => {
	const handleClick = (event: React.MouseEvent) => {
		event.preventDefault();
		onClick(value);
	};

	return (
		<li className={styles.tab}>
			<a
				href={href}
				className={styles.content}
				aria-selected={selected}
				role="tab"
				onClick={handleClick}
			>
				{children}
			</a>
		</li>
	);
};
Tab.displayName = 'Tab';
