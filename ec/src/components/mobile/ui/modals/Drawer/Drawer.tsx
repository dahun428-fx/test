import classNames from 'classnames';
import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './Drawer.module.scss';

type Props = {
	isOpen: boolean;
	slideFrom?: 'left' | 'right';
	top?: number;
	className?: string;
};

/**
 * Drawer component
 */
export const Drawer: React.FC<Props> = ({
	children,
	isOpen,
	slideFrom = 'right',
	top = 0,
	className,
}) => {
	/** NOTE: React strict mode complains when using CSS transition group.
	 * Refer to: https://github.com/reactjs/react-transition-group/issues/668#issuecomment-695162879
	 */
	const ref = useRef(null);

	return (
		<CSSTransition
			nodeRef={ref}
			in={isOpen}
			timeout={300}
			classNames={{
				enter:
					slideFrom === 'left'
						? styles.enterSlideFromLeft
						: styles.enterSlideFromRight,
				enterActive:
					slideFrom === 'left'
						? styles.enterActiveSlideFromLeft
						: styles.enterActiveSlideFromRight,
				exit: styles.exit,
			}}
			unmountOnExit
		>
			<div
				ref={ref}
				className={classNames(styles.drawer, className, {
					[String(styles.slideFromLeft)]: slideFrom === 'left',
					[String(styles.slideFromRight)]: slideFrom === 'right',
				})}
				style={{
					top: `${top}px`,
				}}
			>
				{children}
			</div>
		</CSSTransition>
	);
};
