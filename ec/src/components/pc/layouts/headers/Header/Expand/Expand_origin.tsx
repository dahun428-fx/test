import React, { forwardRef } from 'react';
import styles from './Expand.module.scss';
// import styles from '../AsideNavs/AsideNavs.module.scss';
type Props = {
	/** プルダウンを表示するか */
	expanded: boolean;
	/** ボタンに表示するラベル */
	label: string;
	/** Is Ellipsis */
	isEllipsis?: boolean;
	/** 開閉処理 */
	onClick: () => void;
};

/**
 * Expand component (ボタンをクリックするとプルダウンを表示)
 */
export const Expand = forwardRef<HTMLButtonElement, Props>(
	({ expanded, label, isEllipsis, onClick, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={expanded ? styles.expanded : styles.closed}
				onClick={onClick}
				type="button"
				{...props}
			>
				{isEllipsis ? <div className={styles.ellipsis}>{label}</div> : label}
			</button>
		);
	}
);
Expand.displayName = 'Expand';
