import React from 'react';
import styles from './StackBalloonItems.module.scss';
import { StackStatusType } from '../StackBalloon.types';
import {
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';
import classNames from 'classnames';
import { CadenasDownloadProgress } from './CadenasDownloadProgress';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

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
	const handleOnClickHelp = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		openSubWindow(`${url.contact}?series_code=${item.seriesCode}`, 'guide', {
			width: 1000,
			height: 800,
		});
	};

	const checkedItem = (id: string) => {
		let checkedItem = Array.from(checkedItems).filter(checkedItem => {
			if (checkedItem.id === id) {
				return item;
			}
		});
		if (checkedItem.length > 0) {
			return true;
		}
		return false;
	};

	if (item.status === CadDownloadStatus.Done) {
		return (
			<li
				className={classNames(
					styles.itemBox,
					checkedItem(item.id) ? styles.on : ''
				)}
				key={item.id}
				id={item.id}
				onClick={() => onClick(item)}
			>
				<div className={styles.itemDetail}>
					<p>
						<a href={item.downloadHref}>{item.seriesName}</a>
					</p>
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
					checkedItem(item.id) ? styles.on : ''
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
								<a onClick={event => handleOnClickHelp(event)}>
									<span>?</span>
								</a>
							</span>
						</p>
					</div>
				) : item.status === CadDownloadStatus.Pending ? (
					<div className={styles.progressDownload}>
						<span className={styles.progressSmall}>
							<CadenasDownloadProgress {...item} />
							{/* <span>0</span>/5 */}
						</span>
						<span className={styles.progressIng}>다운로드 중</span>
					</div>
				) : null}
			</li>
		);
	}
};

StackBalloonItems.displayName = 'StackBalloonItems';
