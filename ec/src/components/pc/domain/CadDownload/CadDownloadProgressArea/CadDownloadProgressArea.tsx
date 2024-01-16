import { FC, useCallback, useEffect, useRef, useState } from 'react';
import styles from './CadDownloadProgressArea.module.scss';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

type Props = {
	handleAddStackPutsth: () => void;
	handleDirectDownload: () => void;
	handleClickDelete: () => void;
	handleClickAllItem: () => void;
	handleClickItem: (item: SelectedCadDataFormat) => void;
	getSelectedCadId: (item: SelectedCadDataFormat) => string;
	handleOnClose: () => void;
	selectedTotalCount: number;
	selectedItems: Set<SelectedCadDataFormat>;
	cadDownloadProgressList: Set<SelectedCadDataFormat>;
};

export const CadDownloadProgressArea: FC<Props> = ({
	handleAddStackPutsth,
	handleDirectDownload,
	handleClickDelete,
	handleClickAllItem,
	handleClickItem,
	getSelectedCadId,
	selectedTotalCount,
	selectedItems,
	cadDownloadProgressList,
	handleOnClose,
}) => {
	const [t] = useTranslation();

	return (
		<>
			<div className={styles.progressArea}>
				<div className={styles.cadPrInfo}>
					<p className={styles.cadPrTotal}>
						{t(
							'components.domain.cadDownload.cadDownloadProgressArea.totalPrefix'
						)}
						<span className={styles.cadPrTotal}>
							{cadDownloadProgressList?.size ?? 0}
						</span>
						{t(
							'components.domain.cadDownload.cadDownloadProgressArea.totalSuffix'
						)}
					</p>
					<p className={styles.ndrSelCnt}>|</p>
					<p className={styles.ndrSelCnt}>
						<span className={styles.cadPrSelectedCnt}>
							{selectedTotalCount}
						</span>
						{t(
							'components.domain.cadDownload.cadDownloadProgressArea.selected'
						)}
					</p>
					<div>
						<p className={styles.cadSelectAllItem}>
							<a onClick={handleClickAllItem}>
								{t(
									'components.domain.cadDownload.cadDownloadProgressArea.totalSelect'
								)}
							</a>
						</p>
						<div className={styles.delimiter1}></div>
						<p className={styles.cadDeleteItem}>
							<a onClick={handleClickDelete}>
								{t(
									'components.domain.cadDownload.cadDownloadProgressArea.delete'
								)}
							</a>
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
						<p className={styles.mgsNotCad}>
							{t(
								'components.domain.cadDownload.cadDownloadProgressArea.noCadData'
							)}
						</p>
					)}
				</div>
			</div>
			<div className={styles.btnSection}>
				<span
					className={classNames(
						styles.btnArrow,
						styles.direct,
						selectedTotalCount < 1 ? styles.disable : ''
					)}
					onClick={handleDirectDownload}
				>
					{t('components.domain.cadDownload.cadDownloadProgressArea.download')}
				</span>
				<span
					className={classNames(
						styles.btnArrow,
						styles.putsth,
						selectedTotalCount < 1 ? styles.disable : ''
					)}
					onClick={handleAddStackPutsth}
				>
					{t('components.domain.cadDownload.cadDownloadProgressArea.putsth')}
				</span>
				<span
					className={classNames(styles.btnClose, styles.selectBtn)}
					onClick={handleOnClose}
				>
					{t('components.domain.cadDownload.cadDownloadProgressArea.close')}
				</span>
			</div>
			<ul className={styles.infoList}>
				<li>
					{t('components.domain.cadDownload.cadDownloadProgressArea.notice')}
				</li>
			</ul>
		</>
	);
};

CadDownloadProgressArea.displayName = 'CadDownloadProgressArea';
