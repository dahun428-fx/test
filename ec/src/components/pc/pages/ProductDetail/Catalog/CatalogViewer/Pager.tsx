import classNames from 'classnames';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Sticky from 'react-stickynode';
import styles from './Pager.module.scss';
import { getRect } from '@/utils/dom';

type Props = {
	hovering: boolean;
	prevOrNext: 'prev' | 'next';
	stickyBottomBoundary?: string | number;
	onClick: (prevOrNext: 'prev' | 'next') => void;
};

export const Pager: React.VFC<Props> = ({
	hovering,
	prevOrNext,
	stickyBottomBoundary,
	onClick,
}) => {
	const { t } = useTranslation();
	const pagerRef = useRef<HTMLDivElement>(null);
	const isPrev = prevOrNext === 'prev';

	const top = document.documentElement.clientHeight / 3;
	const { bottom = 0 } = getRect(pagerRef) ?? {};
	const bottomBoundary = stickyBottomBoundary
		? stickyBottomBoundary
		: (window.scrollY ?? window.pageYOffset) + bottom - top;

	return (
		<div
			ref={pagerRef}
			className={isPrev ? styles.pagerAreaLeft : styles.pagerAreaRight}
			onClick={() => onClick(prevOrNext)}
		>
			<div className={styles.buttonWrap}>
				<Sticky top={top} bottomBoundary={bottomBoundary}>
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
				</Sticky>
			</div>
		</div>
	);
};
