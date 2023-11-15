import React, { MouseEvent, RefObject, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './PartNumberBar.module.scss';
import { appendZeroWidthSpaceToCommas } from '@/utils/string';

type Props = {
	// この partNumber は確定型番とは限らない。partNumberList が 1 件になった時の partNumber。ect-web-th の通り…。
	partNumber?: string;
	totalCount?: number;
	partNumberBarRef: RefObject<HTMLDivElement>;
	onClickPartNumberCount: () => void;
	onClickConfigure: () => void;
};

/**
 * Part number bar
 */
export const SpecPanel: React.VFC<Props> = ({
	partNumber,
	totalCount,
	partNumberBarRef,
	onClickPartNumberCount,
	onClickConfigure,
}) => {
	const [t] = useTranslation();

	const handleClickConfigure = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			onClickConfigure();
		},
		[onClickConfigure]
	);

	return (
		<div className={styles.container} ref={partNumberBarRef}>
			<div
				className={styles.partNumberContainer}
				onClick={partNumber ? undefined : onClickPartNumberCount}
			>
				{partNumber ? (
					<div className={styles.partNumberBox}>
						<div className={styles.partNumberGuide}>
							<Trans i18nKey="mobile.pages.productDetail.templates.complex.partNumberBar.partNumber">
								<span
									className={styles.partNumber}
									dangerouslySetInnerHTML={{
										__html: appendZeroWidthSpaceToCommas(partNumber),
									}}
								/>
							</Trans>
						</div>
					</div>
				) : totalCount != null ? (
					<div className={styles.partNumberBox}>
						<Trans i18nKey="mobile.pages.productDetail.templates.complex.partNumberTotalCount">
							<div className={styles.count}>{{ totalCount }}</div>
						</Trans>
						<div className={styles.partNumberListIcon} />
					</div>
				) : null}
			</div>
			<div className={styles.configureContainer}>
				<a
					href="#"
					className={styles.configure}
					data-exists-part-number={!!partNumber}
					onClick={handleClickConfigure}
				>
					{partNumber
						? t('mobile.pages.productDetail.reconfigure')
						: t('mobile.pages.productDetail.configure')}
				</a>
			</div>
		</div>
	);
};
SpecPanel.displayName = 'SpecPanel';
