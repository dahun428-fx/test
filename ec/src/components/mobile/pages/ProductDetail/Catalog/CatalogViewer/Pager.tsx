import classNames from 'classnames';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Pager.module.scss';

type Props = {
	hovering: boolean;
	prevOrNext: 'prev' | 'next';
	onClick: (prevOrNext: 'prev' | 'next') => void;
};

export const Pager: React.VFC<Props> = ({ hovering, prevOrNext, onClick }) => {
	const { t } = useTranslation();
	const pagerRef = useRef<HTMLDivElement>(null);
	const isPrev = prevOrNext === 'prev';

	return (
		<div
			ref={pagerRef}
			className={isPrev ? styles.pagerAreaLeft : styles.pagerAreaRight}
			onClick={() => onClick(prevOrNext)}
		>
			<div className={styles.buttonWrap}>
				<button
					className={classNames(
						isPrev ? styles.buttonLeft : styles.buttonRight,
						{ [String(styles.animation)]: hovering }
					)}
					aria-label={
						prevOrNext === 'prev'
							? t('pages.productDetail.catalog.pagerLabel.prev')
							: t('pages.productDetail.catalog.pagerLabel.next')
					}
				/>
			</div>
		</div>
	);
};
