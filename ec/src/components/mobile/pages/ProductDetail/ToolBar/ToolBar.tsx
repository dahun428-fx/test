import classNames from 'classnames';
import React, { MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ToolBar.module.scss';
import { aa } from '@/logs/analytics/adobe';
import { Flag } from '@/models/api/Flag';
import { assertNotNull } from '@/utils/assertions';
import { openSubWindow } from '@/utils/window';

type Props = {
	totalCount?: number;
	digitalBookPdfUrl?: string;
	misumiFlag?: Flag;
	onClickConfigure: () => void;
	className?: string;
};

export const ToolBar: React.VFC<Props> = ({
	totalCount,
	misumiFlag,
	digitalBookPdfUrl,
	onClickConfigure,
	className,
}) => {
	const { t } = useTranslation();

	const handleClickPdf = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			assertNotNull(digitalBookPdfUrl);
			if (Flag.isTrue(misumiFlag)) {
				event.preventDefault();
				// SP だと PDF がダウンロードされる？
				openSubWindow(digitalBookPdfUrl, 'digitalBookWin', {
					width: 920,
					height: 703,
				});
			}
			aa.events.sendDownloadCatalog();
		},
		[digitalBookPdfUrl, misumiFlag]
	);

	const handleClickConfigure = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			onClickConfigure();
		},
		[onClickConfigure]
	);

	return (
		<div className={classNames(className, styles.container)}>
			<p className={styles.pdfWrap}>
				{digitalBookPdfUrl && (
					<a
						className={styles.pdf}
						href={digitalBookPdfUrl}
						onClick={handleClickPdf}
						aria-label="Download Catalog"
					/>
				)}
			</p>
			<a
				className={styles.configure}
				role="button"
				onClick={handleClickConfigure}
			>
				{totalCount === 1
					? t('mobile.pages.productDetail.reconfigure')
					: t('mobile.pages.productDetail.configure')}
			</a>
		</div>
	);
};
ToolBar.displayName = 'ToolBar';
