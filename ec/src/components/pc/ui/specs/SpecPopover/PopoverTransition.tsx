import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './PopoverTransition.module.scss';

type Props = {
	isOpen: boolean;
};

/**
 * Popover transition
 */
export const PopoverTransition: React.FC<Props> = ({ isOpen, children }) => {
	const ref = useRef(null);

	return (
		<CSSTransition
			in={isOpen}
			timeout={200}
			classNames={{
				enter: styles.enter,
				enterActive: styles.enterActive,
				exitActive: styles.exitActive,
				exit: styles.exit,
			}}
			unmountOnExit
			nodeRef={ref}
		>
			<div ref={ref}>{children}</div>
		</CSSTransition>
	);
};
PopoverTransition.displayName = 'PopoverTransition';
