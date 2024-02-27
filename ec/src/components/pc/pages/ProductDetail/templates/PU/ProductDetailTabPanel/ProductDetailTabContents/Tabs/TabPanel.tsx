import classNames from 'classnames';
import React, { useRef } from 'react';
import styles from './TabPanel.module.scss';

type Props = {
	hidden: boolean;
	contentParentId: string;
};

export const TabPanel: React.FC<Props> = ({
	hidden,
	contentParentId,
	children,
}) => {
	const contentInnerRef = useRef<HTMLDivElement>(null);

	return (
		<div
			className={classNames({
				[String(styles.hidden)]: hidden,
				[String(styles.contentMargin)]:
					contentParentId !== 'cadPreview-tabPanelContents',
				[String(styles.cad)]: contentParentId === 'cadPreview-tabPanelContents',
			})}
		>
			<div ref={contentInnerRef} id={contentParentId}>
				{children}
			</div>
		</div>
	);
};
TabPanel.displayName = 'TabPanel';
