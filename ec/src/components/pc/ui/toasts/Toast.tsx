import classNames from 'classnames';
import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './Toast.module.scss';

type Props = {
	shows: boolean;
	className?: string;
};

/**
 * The base component of Toast
 */
export const Toast: React.FC<Props> = ({ shows, className, children }) => {
	const ref = useRef<HTMLDivElement>(null);

	//===========================================================================
	return (
		<CSSTransition
			in={shows}
			timeout={300}
			nodeRef={ref}
			classNames={{
				enter: styles.enter,
				enterActive: styles.enterActive,
				exitActive: styles.exitActive,
				exit: styles.exit,
			}}
			// unmount children on exited state
			unmountOnExit
		>
			<div className={classNames(styles.toast, className)} ref={ref}>
				{children}
			</div>
		</CSSTransition>
	);
};
Toast.displayName = 'Toast';
