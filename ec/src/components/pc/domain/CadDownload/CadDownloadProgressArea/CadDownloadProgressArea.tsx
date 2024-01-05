import { FC, useCallback, useEffect, useRef, useState } from 'react';
import styles from './CadDownloadProgressArea.module.scss';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';
import classNames from 'classnames';

type Props = {
	selectedCad: SelectedCadDataFormat | null;
};

export const CadDownloadProgressArea: FC<Props> = ({ selectedCad }) => {
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
	const [cadDownloadProgressList, setCadDownloadProgressList] = useState<
		Set<SelectedCadDataFormat>
	>(new Set());

	useEffect(() => {
		if (selectedCad) {
			cadDownloadProgressList.add(selectedCad);
			setCadDownloadProgressList(new Set(cadDownloadProgressList));
			selectedItems.add(getSelectedCadData(selectedCad));
			setSelectedItems(selectedItems);
		}
		console.log(
			're-render ====> ',
			cadDownloadProgressList,
			'|| selectedItems ===> ',
			selectedItems
		);
	}, [selectedCad]);

	const handleClickItem = (item: SelectedCadDataFormat) => {
		const target = getSelectedCadData(item);
		const isSelected = selectedItems.has(target);
		if (isSelected) {
			selectedItems.delete(target);
		} else {
			selectedItems.add(target);
		}
		setSelectedItems(new Set(selectedItems));
	};
	// console.log('selected item : ', selectedItems);

	const handleClickAllItem = () => {
		if (cadDownloadProgressList && cadDownloadProgressList.size > 0) {
			if (selectedItems.size === cadDownloadProgressList?.size) {
				setSelectedItems(new Set());
			} else {
				setSelectedItems(
					new Set(
						Array.from(cadDownloadProgressList).map(item => {
							return getSelectedCadData(item);
						})
					)
				);
			}
		}
	};

	const handleClickDelete = useCallback(() => {
		// console.log(
		// 	'handle delete : cadDownloadProgressList ==> ',
		// 	cadDownloadProgressList,
		// 	selectedItems
		// );
		if (!cadDownloadProgressList || selectedItems.size === 0) {
			// console.log('삭제할 대상이 없습니다.');
			return;
		}

		const data = Array.from(cadDownloadProgressList).filter(item => {
			if (!selectedItems.has(getSelectedCadData(item))) {
				return item;
			}
		});

		setCadDownloadProgressList(new Set(data));

		setSelectedItems(new Set());
	}, [
		cadDownloadProgressList,
		selectedItems,
		setSelectedItems,
		setCadDownloadProgressList,
	]);

	const getSelectedCadData = (item: SelectedCadDataFormat) => {
		if (item.formatOthersText && item.formatOthersText !== item.versionText) {
			const data = [
				item.grp,
				'기타',
				item.formatOthersText,
				item.versionText,
			].join(' | ');
			console.log('data ===> ', data);
			return `${item.grp} | 기타 | ${item.formatOthersText} | ${item.versionText}`;
		}
		return `${item.grp} | ${item.formatText} | ${item.versionText}`;
	};

	return (
		<div className={styles.progressArea}>
			<div className={styles.cadPrInfo}>
				<p className={styles.cadPrTotal}>
					총{' '}
					<span className={styles.cadPrTotal}>
						{cadDownloadProgressList?.size ?? 0}
					</span>{' '}
					건
				</p>
				<p className={styles.ndrSelCnt}>|</p>
				<p className={styles.ndrSelCnt}>
					<span className={styles.cadPrSelectedCnt}>{selectedItems.size}</span>{' '}
					건 선택
				</p>
				<div>
					<p className={styles.cadSelectAllItem}>
						<a onClick={handleClickAllItem}>전체 선택</a>
					</p>
					<div className={styles.delimiter1}></div>
					<p className={styles.cadDeleteItem}>
						<a onClick={handleClickDelete}>삭제</a>
					</p>
				</div>
			</div>
			<div className={styles.cadPrList}>
				<ul>
					{cadDownloadProgressList &&
						cadDownloadProgressList.size > 0 &&
						Array.from(cadDownloadProgressList).map(item => {
							const hasItem =
								selectedItems.has(getSelectedCadData(item)) && styles.on;
							return (
								<li
									onClick={() => handleClickItem(item)}
									className={classNames(
										styles.ndrCheckbox,
										hasItem && styles.on
									)}
								>
									<p
										className={classNames(
											styles.cadPrFileInfo,
											hasItem && styles.on
										)}
									>
										{getSelectedCadData(item)}
									</p>
								</li>
							);
						})}
				</ul>
				{(!cadDownloadProgressList || cadDownloadProgressList.size === 0) && (
					<p className={styles.mgsNotCad}>CAD 데이터가 없습니다</p>
				)}
			</div>
		</div>
	);
};
