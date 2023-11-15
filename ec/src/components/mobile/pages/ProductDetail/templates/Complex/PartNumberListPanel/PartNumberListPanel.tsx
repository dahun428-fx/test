import React, { MouseEvent } from 'react';
import styles from './PartNumberListPanel.module.scss';
import { PartNumberList } from '@/components/mobile/pages/ProductDetail/PartNumberList';

type Props = {
	onClose: () => void;
};

export const PartNumberListPanel: React.VFC<Props> = ({ onClose }) => {
	const handleClose = (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		onClose();
	};

	return (
		<>
			<div className={styles.container} onClick={onClose} />
			<div className={styles.panel}>
				<PartNumberList onClickPartNumber={onClose} />
				<a
					href=""
					onClick={handleClose}
					className={styles.close}
					aria-label="Close"
				>
					˅
				</a>
			</div>
		</>
	);
};
PartNumberListPanel.displayName = 'PartNumberListPanel';
