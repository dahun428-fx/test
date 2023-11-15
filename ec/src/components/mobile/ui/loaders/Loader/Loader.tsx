import React, { RefObject, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './Loader.module.scss';

type Props = {
	show?: boolean;
	returnElementRef?: RefObject<HTMLElement>;
};

/** Actions Panel Loader */
export const Loader: React.VFC<Props> = ({ show, returnElementRef }) => {
	const ref = useRef<HTMLDivElement>(null);

	// When shows loader, it takes away focus.
	// And, when will hide loader which has focus, it returns focus the specified element.
	useEffect(() => {
		if (returnElementRef) {
			if (show) {
				ref.current?.focus();
			} else if (ref.current === document.activeElement) {
				returnElementRef.current?.focus();
			}
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
			<div className={styles.loader} ref={ref} tabIndex={-1}>
				Loading...
			</div>
		</CSSTransition>
	);
};
Loader.displayName = 'Loader';
