import React, { memo, MouseEvent, RefObject, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PartNumberSpecHeader.module.scss';
import { Flag } from '@/models/api/Flag';
import { Spec } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

type Props = {
	specList: Spec[];
	relatedLinkFrameFlag: Flag;
	rohsFrameFlag: Flag;
	innerRef: RefObject<HTMLTableSectionElement>;
	height?: number;
};

export const PartNumberSpecHeader = memo<Props>(
	({ specList, rohsFrameFlag, relatedLinkFrameFlag, innerRef, height }) => {
		const { t } = useTranslation();

		const handleClickRohs = useCallback((event: MouseEvent) => {
			event.preventDefault();
			openSubWindow(url.rohs, 'guide', {
				width: 990,
				height: 800,
			});
		}, []);

		return (
			<table className={styles.tableBase}>
				<thead ref={innerRef}>
					<tr style={{ height }}>
						{Flag.isTrue(relatedLinkFrameFlag) && (
							<th className={styles.headerCell}>
								<div>{t('pages.productDetail.partNumberList.relatedTo')}</div>
							</th>
						)}
						{specList.map(spec => (
							<th key={spec.specCode} className={styles.headerCell}>
								<p
									dangerouslySetInnerHTML={{ __html: spec.specName }}
									className={styles.data}
								/>
								{spec.specUnit && (
									<p
										dangerouslySetInnerHTML={{ __html: `(${spec.specUnit})` }}
									/>
								)}
							</th>
						))}
						{Flag.isTrue(rohsFrameFlag) && (
							<th className={styles.headerCell}>
								{t('pages.productDetail.partNumberList.rohs')}
								<br />
								<a
									target="guide"
									href={url.rohs}
									onClick={handleClickRohs}
									rel="noreferrer"
									className={styles.rohsHelp}
								>
									?
								</a>
							</th>
						)}
						<th className={styles.headerCell}>
							{t('pages.productDetail.partNumberList.quantity')}
						</th>
					</tr>
				</thead>
			</table>
		);
	}
);
PartNumberSpecHeader.displayName = 'PartNumberSpecHeader';
