import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MegaNavMenu.module.scss';
import { MegaNav } from '@/components/pc/ui/navigations/MegaNav';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { useTimer } from '@/utils/timer';

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
			ref={rootRef}
			className={styles.wrapper}
			// NOTE: Suppress automatic opening when the mouse is already over a button
			//       when moving from the TOP page to other pages. Last resort.
			onMouseEnter={mounted && handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<button
				className={styles.trigger}
				onClick={handleClick}
				aria-haspopup="menu"
				aria-expanded={isOpen}
			>
				<h2>{t('components.ui.layouts.headers.header.megaNavMenu.heading')}</h2>
			</button>
			<div className={styles.menu} aria-hidden={!isOpen}>
				<MegaNav onClickLink={handleClickLink} />
			</div>
		</div>
	);
};
MegaNavMenu.displayName = 'MegaNavMenu';
