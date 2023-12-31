import React, { RefObject, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './Overlayloader.module.scss';

type Props = {
	show?: boolean;
	returnElementRef?: RefObject<HTMLElement>;
};

/**
 * Overlay loader component
 */
export const OverlayLoader: React.VFC<Props> = ({ show, returnElementRef }) => {
	const ref = useRef<HTMLDivElement>(null);

	// When shows loader, it takes away focus.
	// And, when will hide loader which has focus, it returns focus the specified element.
	useEffect(() => {
		if (show) {
			ref.current?.focus();
		} else if (ref.current === document.activeElement) {
			returnElementRef?.current?.focus();
		}
	}, [returnElementRef, show]);

	return (
		<CSSTransition
			in={show}
			timeout={300}
			classNames={{
				enter: styles.enter,
				enterActive: styles.enterActive,
				exitActive: styles.exitActive,
				exit: styles.exit,
			}}
			unmountOnExit
			nodeRef={ref}
		>
			<div className={styles.overlay} ref={ref} tabIndex={-1}>
				<div className={styles.loader}>Loading...</div>
			</div>
		</CSSTransition>
	);
};

OverlayLoader.displayName = 'OverlayLoader';
