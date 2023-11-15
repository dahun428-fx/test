import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './Section.module.scss';
import { getHeight } from '@/utils/dom';

type Props = {
	id: string;
	title: string | React.ReactNode;
	aside?: React.ReactNode;
	defaultExpanded?: boolean;
	disabledExpand?: boolean;
	className?: string;
	enableSticky?: boolean;
	onChange?: (expanded: boolean) => void;
};

export const Section: React.FC<Props> = ({
	id,
	title,
	aside,
	children,
	defaultExpanded = true,
	disabledExpand = false,
	className,
	enableSticky = false,
	onChange,
}) => {
	const [expanded, setExpanded] = useState(defaultExpanded);
	const contentsRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState<number>();

	const headingId = enableSticky ? `${id}Heading` : undefined;
	const contentsId = `${id}Contents`;
	const ariaExpanded = disabledExpand ? undefined : expanded;
	const ariaHidden = disabledExpand ? undefined : !expanded;
	const tabIndex = disabledExpand ? undefined : 0;
	const role = disabledExpand ? undefined : 'button';
	const handleClick = useCallback(() => {
		if (!disabledExpand) {
			onChange?.(!expanded);
			setExpanded(prev => !prev);
		}
	}, [disabledExpand, expanded, onChange]);

	useEffect(() => {
		if (contentsRef.current) {
			if (expanded) {
				setHeight(getHeight(contentsRef.current));
				const observer = new ResizeObserver(([entry]) => {
					if (entry) {
						setHeight(entry.contentRect.height);
					}
				});
				observer.observe(contentsRef.current);
				return () => observer.disconnect();
			}
			setHeight(0);
		}
	}, [expanded]);

	return (
		<div className={className} id={id}>
			<div
				className={classNames({
					[String(styles.sticky)]: enableSticky && expanded,
				})}
			>
				<div
					className={styles.headingWrap}
					onClick={handleClick}
					onKeyPress={handleClick}
					tabIndex={tabIndex}
					role={role}
					aria-expanded={ariaExpanded}
					aria-controls={contentsId}
					id={headingId}
				>
					<h2 className={styles.heading}>{title}</h2>
					{aside && (
						<div
							className={styles.aside}
							aria-hidden={ariaHidden}
							onClick={event => event.stopPropagation()}
						>
							{aside}
						</div>
					)}
				</div>
			</div>

			<div
				className={classNames(styles.contentsContainer, {
					[String(styles.collapsed)]: !expanded,
				})}
				style={{ maxHeight: height != null ? `${height}px` : undefined }}
			>
				<div id={contentsId} aria-hidden={ariaHidden} ref={contentsRef}>
					{children}
				</div>
			</div>
		</div>
	);
};
Section.displayName = 'Section';
