import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PartNumberBar.module.scss';
import { AlertMessage } from '@/components/mobile/ui/messages/AlertMessage';
import { notEmpty } from '@/utils/predicate';

type Props = {
	partNumber?: string;
	partNumberTotalCount?: number;
	cautionList?: string[];
	noticeList?: string[];
	onToggleShowsSpecPanel: () => void;
};

/**
 * Part number bar component
 */
export const PartNumberBar: React.VFC<Props> = ({
	partNumber,
	partNumberTotalCount,
	cautionList = [],
	noticeList = [],
	onToggleShowsSpecPanel,
}) => {
	const [t] = useTranslation();

	return (
		<div className={styles.container}>
			<div className={styles.item} onClick={onToggleShowsSpecPanel}>
				<div className={styles.title}>
					{t(
						'mobile.pages.productDetail.templates.simple.partNumberBar.partNumber'
					)}
				</div>
				<div className={styles.value}>
					{partNumber && partNumberTotalCount === 1 ? (
						<span className={styles.partNumber}>{partNumber}</span>
					) : (
						<span>
							<span className={styles.buttonConfig}>
								{t(
									'mobile.pages.productDetail.templates.simple.partNumberBar.configure'
								)}
							</span>
						</span>
					)}

					<span className={styles.iconConfig}></span>
				</div>
				{(notEmpty(cautionList) || notEmpty(noticeList)) && (
					<ul className={styles.alertWrap}>
						{[...cautionList, ...noticeList].map((message, index) => (
							<li key={index}>
								<AlertMessage>{message}</AlertMessage>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};
PartNumberBar.displayName = 'PartNumberBar';
