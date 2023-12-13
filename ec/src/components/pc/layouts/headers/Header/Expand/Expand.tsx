import React, { forwardRef } from 'react';
// import styles from './Expand.module.scss';
// import styles from '../AsideNavs/AsideNavs.module.scss';
type Props = {
	/** プルダウンを表示するか */
	expanded: boolean;
	/** ボタンに表示するラベル */
	label: string;
	/** 開閉処理 */
	onClick: () => void;
};

/**
 * Expand component (ボタンをクリックするとプルダウンを表示)
 */
export const Expand = forwardRef<HTMLSpanElement, Props>(
	({ expanded, label, onClick, ...props }, ref) => {
		return (
			<span ref={ref} onClick={onClick} {...props}>
				{label}
			</span>
		);
	}
);
Expand.displayName = 'Expand';
