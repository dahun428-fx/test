import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './BaseFilterPanel.module.scss';
import { digit } from '@/utils/number';

type Props = {
	totalCount: number;
	onClear: () => void;
	onConfirm: () => void;
	onClose: () => void;
};

/**
 * Base Filter Panel component which will be used on Keyword Search and Category spec filter.
 */
export const BaseFilterPanel: React.FC<Props> = ({
	children,
	totalCount,
	onClear,
	onConfirm,
	onClose,
}) => {
	const [t] = useTranslation();

	return (
		<div className={styles.container} onClick={onClose}>
			<div
				className={styles.filterModal}
				onClick={event => {
					event.stopPropagation();
				}}
			>
				<div className={styles.content}>
					<div className={styles.closeButton} onClick={onClose} />
					{children}
				</div>

				<div className={styles.footerContent}>
					<div className={styles.searchResultCount}>
						<Trans i18nKey="mobile.components.domain.specs.series.filterPanel.partNumberTotalCount">
							<span className={styles.totalCount}>
								{{ totalCount: digit(totalCount) }}
							</span>
						</Trans>
					</div>

					<div className={styles.actionContainer}>
						<a
							className={styles.clearButton}
							href="#"
							onClick={event => {
								event.preventDefault();
								onClear();
							}}
						>
							{t('mobile.components.domain.specs.series.filterPanel.clear')}
						</a>
						<a
							className={styles.confirmButton}
							href="#"
							onClick={event => {
								event.preventDefault();
								onConfirm();
							}}
						>
							{t('mobile.components.domain.specs.series.filterPanel.confirm')}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

BaseFilterPanel.displayName = 'BaseFilterPanel';
