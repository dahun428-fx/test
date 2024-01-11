import { FC, useCallback, useEffect, useRef, useState } from 'react';
import styles from './CadDownloadProgressArea.module.scss';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';
import classNames from 'classnames';

type Props = {
	selectedCad: SelectedCadDataFormat | null;
	onClose: () => void;
};

export const CadDownloadProgressArea: FC<Props> = ({
	selectedCad,
	onClose,
}) => {
	const [selectedItems, setSelectedItems] = useState<
		Set<SelectedCadDataFormat>
	>(new Set());

	const [cadDownloadProgressList, setCadDownloadProgressList] = useState<
		Set<SelectedCadDataFormat>
	>(new Set());

	const [cadDownloadProgressIdsList, setCadDownloadProgressIdsList] = useState<
		Set<string>
	>(new Set());

	useEffect(() => {
		if (!!selectedCad) {
			let selectedCadId = getSelectedCadId(selectedCad);
			if (!cadDownloadProgressIdsList.has(selectedCadId)) {
				cadDownloadProgressIdsList.add(selectedCadId);
				setCadDownloadProgressIdsList(new Set(cadDownloadProgressIdsList));
				cadDownloadProgressList.add(selectedCad);
				setCadDownloadProgressList(new Set(cadDownloadProgressList));
				selectedItems.add(selectedCad);
				setSelectedItems(new Set(selectedItems));
			}
		}
	}, [selectedCad]);

	const handleClickItem = (item: SelectedCadDataFormat) => {
		const isSelected = selectedItems.has(item);
		if (isSelected) {
			selectedItems.delete(item);
		} else {
			selectedItems.add(item);
		}
		setSelectedItems(new Set(selectedItems));
	};

	const handleClickAllItem = () => {
		if (cadDownloadProgressList && cadDownloadProgressList.size > 0) {
			if (selectedItems.size === cadDownloadProgressList?.size) {
				setSelectedItems(new Set());
			} else {
				setSelectedItems(new Set(cadDownloadProgressList));
			}
		}
	};

	const handleClickDelete = useCallback(() => {
		if (!cadDownloadProgressList || selectedItems.size === 0) {
			return;
		}

		const data = Array.from(cadDownloadProgressList).filter(item => {
			if (!selectedItems.has(item)) {
				return item;
			}
		});

		setCadDownloadProgressIdsList(
			new Set(data.map(item => getSelectedCadId(item)))
		);
		setCadDownloadProgressList(new Set(data));
		setSelectedItems(new Set());
	}, [
		cadDownloadProgressList,
		selectedItems,
		setSelectedItems,
		setCadDownloadProgressList,
	]);

	const getSelectedCadId = (item: SelectedCadDataFormat) => {
		let versionText = !!item.versionText ? ` | ${item.versionText}` : '';
		if (item.format === 'others') {
			return `${item.grp} | 기타 | ${item.formatOthersText}${versionText}`;
		}
		return `${item.grp} | ${item.formatText}${versionText}`;
	};

	const handleAddStackPutsth = useCallback(() => {
		console.log('selectedItems', selectedItems);

	}, [selectedItems]);

	const startStackPutsth = () => {
		
	}

	return (
		<>
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
						<span className={styles.cadPrSelectedCnt}>
							{selectedItems.size}
						</span>{' '}
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
							Array.from(cadDownloadProgressList).map((item, index) => {
								const itemId = getSelectedCadId(item);
								const hasItem = selectedItems.has(item) && styles.on;
								return (
									<li
										key={index}
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
											{itemId}
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
			<div className={styles.btnSection}>
				<span className={classNames(styles.btnArrow, styles.direct)}>
					즉시 다운로드
				</span>
				<span
					className={classNames(styles.btnArrow, styles.putsth)}
					onClick={handleAddStackPutsth}
				>
					담기
				</span>
				<span
					className={classNames(styles.btnClose, styles.selectBtn)}
					onClick={() => onClose()}
				>
					닫기
				</span>
			</div>
			<ul className={styles.infoList}>
				<li>담기 유효시간은 24시간입니다.</li>
			</ul>
		</>
	);
};
