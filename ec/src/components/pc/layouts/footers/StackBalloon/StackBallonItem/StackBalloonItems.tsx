import React from 'react';
import styles from './StackBalloonItems.module.scss';
import { StackStatusType } from '../StackBalloon.types';
import {
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';
import classNames from 'classnames';

type Props = {
	item: CadDownloadStackItem;
	checkedItems: Set<CadDownloadStackItem>;
	onClick: (item: CadDownloadStackItem) => void;
};

export const StackBalloonItems: React.FC<Props> = ({
	item,
	checkedItems,
	onClick,
}) => {
	const array = [];

	if (item.status === CadDownloadStatus.Done) {
		return (
			<li
				className={classNames(
					styles.itemBox,
					checkedItems.has(item) ? styles.on : ''
				)}
				key={item.id}
				id={item.id}
				onClick={() => onClick(item)}
			>
				<div className={styles.itemDetail}>
					<p>{item.seriesName}</p>
					<p>{item.partNumber}</p>
					<p>{item.label}</p>
				</div>
				<div className={styles.progressDownload}>
					<p>완료</p>
				</div>
			</li>
		);
	} else {
		return (
			<li
				className={classNames(
					styles.itemBox,
					checkedItems.has(item) ? styles.on : ''
				)}
				key={item.id}
				id={item.id}
				onClick={() => onClick(item)}
			>
				<div className={styles.itemDetail}>
					<p>{item.seriesName}</p>
					<p>{item.partNumber}</p>
					<p>{item.label}</p>
				</div>
				{item.status === CadDownloadStatus.Putsth ? (
					<div className={styles.progressDownload}>
						<p className={styles.progressIng}>다운로드 대기</p>
					</div>
				) : item.status === CadDownloadStatus.Error ? (
					<div className={styles.progressDownload}>
						<p className={styles.progressIng}>
							다운로드 실패
							<span className={styles.help}>
								<a>?</a>
							</span>
						</p>
					</div>
				) : (
					<div className={styles.progressDownload}>
						<span className={styles.progressSmall}>
							<span>0</span>/5
						</span>
						<span className={styles.progressIng}>다운로드 중</span>
					</div>
				)}
			</li>
		);
	}
};

StackBalloonItems.displayName = 'StackBalloonItems';
