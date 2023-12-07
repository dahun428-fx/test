import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MegaNavMenu.module.scss';
import { MegaNav } from '@/components/pc/ui/navigations/MegaNav';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { useTimer } from '@/utils/timer';
import classNames from 'classnames';

const delay = 500;

/**
 * Mega Nav menu.
 */
export const MegaNavMenu: React.VFC = () => {
	const { t } = useTranslation();
	// menu is open?
	const [isOpen, setIsOpen] = useState(false);
	const [mounted, setMounted] = useState<true | undefined>();
	/**
	 * timer
	 * - open: until open menu.
	 * - close: until close menu.
	 * - cooling: cool time which "isOpen" state will not be changed by button clicks.
	 */
	const timer = useTimer<'open' | 'close' | 'cooling'>();

	const handleClick = () => {
		if (!timer.isSleeping('cooling')) {
			timer.cancelAll();
			setIsOpen(p => !p);
		}
	};

	const handleClickLink = () => {
		setIsOpen(false);
	};

	const handleMouseEnter = () => {
		// If billing to open menu, stop.
		timer.cancel('close');
		timer
			.sleep(delay, 'open')
			.then(() => {
				setIsOpen(true);
				// start cool time.
				timer.sleep(delay, 'cooling').catch(() => {
					// noop
				});
			})
			.catch(() => {
				// noop
			});
	};

	const handleMouseLeave = () => {
		// If billing to menu, stop.
		timer.cancel('open');
		timer
			.sleep(delay, 'close')
			.then(() => {
				setIsOpen(false);
				// start cool time.
				timer.sleep(delay, 'cooling').catch(() => {
					// noop
				});
			})
			.catch(() => {
				// noop
			});
	};

	const rootRef = useRef(null);
	useOuterClick(
		rootRef,
		useCallback(() => {
			timer.cancelAll();
			setIsOpen(false);
		}, [timer])
	);

	useOnMounted(() => {
		setMounted(true);
	});

	return (
		<div
			className={styles.headerMeganavWrap}
			ref={rootRef}
			onMouseEnter={mounted && handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div className={styles.headerMeganav} onClick={handleClick}>
				<div
					className={
						isOpen
							? classNames(styles.meganav, styles.on)
							: classNames(styles.meganav)
					}
				>
					<h2 className={styles.h2}>
						<i></i>
						카테고리/브랜드
					</h2>
					<div className={styles.meganavBody}>
						<div className={styles.meganavSearch}>
							{/* include meganav.html */}
							<MegaNav onClickLink={handleClickLink} />
						</div>
						<div className={styles.newMeganavBanner}>
							<ul>
								<li>{/* 브랜드전체보기 */}</li>
								<li>{/* 공구,MRO,소모성자재 전용사이트 바로가기 */}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
MegaNavMenu.displayName = 'MegaNavMenu';
