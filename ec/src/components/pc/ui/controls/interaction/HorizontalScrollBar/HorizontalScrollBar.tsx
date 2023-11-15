import classNames from 'classnames';
import {
	FC,
	MouseEventHandler,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './HorizontalScrollBar.module.scss';

type Props = {
	percent: number;
	/** Scroll bar width in percentage, from 0 to 1 */
	scrollBarWidth: number;
	/** On scroll callback */
	onScroll: (percent: number) => void;

	className?: string;
	resetScrollOnResize?: boolean;
};
/**
 * Horizontal Scroll Bar component
 */
export const HorizontalScrollBar: FC<Props> = ({
	percent,
	onScroll,
	scrollBarWidth,
	className,
	resetScrollOnResize = false,
}) => {
	const [isMouseDown, setIsMouseDown] = useState(false);
	const mouseDownXRef = useRef(0);
	const [scrollBarLeft, setScrollBarLeft] = useState(0);
	const currentScrollBarLeft = useRef(0);
	const draggerContainerRef = useRef<HTMLDivElement>(null);
	const scrollBarRef = useRef<HTMLDivElement>(null);
	const [maxScrollBarLeft, setMaxScrollBarLeft] = useState(0);

	const handleOnMouseDown = useCallback((event: MouseEvent) => {
		if (event.target !== scrollBarRef.current) {
			return;
		}
		setIsMouseDown(true);
		mouseDownXRef.current = event.clientX;
	}, []);

	const handleOnMouseUp = useCallback(
		(event: MouseEvent) => {
			if (!isMouseDown) {
				return;
			}
			setIsMouseDown(false);
			const diff = event.clientX - mouseDownXRef.current;
			let left = currentScrollBarLeft.current + diff;
			if (left < 0) {
				left = 0;
			} else if (left > maxScrollBarLeft) {
				left = maxScrollBarLeft;
			}
			currentScrollBarLeft.current = left;
		},
		[isMouseDown, maxScrollBarLeft]
	);

	const moveScrollBar = useCallback(
		(diff: number) => {
			let left = currentScrollBarLeft.current + diff;
			if (left < 0) {
				left = 0;
			} else if (left > maxScrollBarLeft) {
				left = maxScrollBarLeft;
			}
			onScroll(left / maxScrollBarLeft);
			setScrollBarLeft(left);
			return left;
		},
		[maxScrollBarLeft, onScroll]
	);

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (!isMouseDown) {
				return;
			}
			event.preventDefault();
			const diff = event.clientX - mouseDownXRef.current;
			moveScrollBar(diff);
		},
		[isMouseDown, moveScrollBar]
	);

	const handleLeftButtonClick = useCallback(() => {
		// move to left 15%
		currentScrollBarLeft.current = moveScrollBar(-0.15 * maxScrollBarLeft);
	}, [maxScrollBarLeft, moveScrollBar]);

	const handleRightButtonClick = useCallback(() => {
		// move to left 15%
		currentScrollBarLeft.current = moveScrollBar(0.15 * maxScrollBarLeft);
	}, [maxScrollBarLeft, moveScrollBar]);

	const handleClickContainer: MouseEventHandler<HTMLDivElement> = useCallback(
		event => {
			if (!scrollBarRef.current || event.target === scrollBarRef.current) {
				return;
			}
			// NOTE: use .left instead of .x due to IE11 compatibility issue
			const shouldMoveLeft =
				event.clientX < scrollBarRef.current.getBoundingClientRect().left;
			if (shouldMoveLeft) {
				handleLeftButtonClick();
			} else {
				handleRightButtonClick();
			}
		},
		[handleLeftButtonClick, handleRightButtonClick]
	);

	useEffect(() => {
		if (!draggerContainerRef.current || !scrollBarRef.current) {
			return;
		}
		const maxScrollBarLeft =
			draggerContainerRef.current.offsetWidth -
			scrollBarRef.current.offsetWidth;
		setMaxScrollBarLeft(maxScrollBarLeft);
		setScrollBarLeft(maxScrollBarLeft * percent);
		window.addEventListener('mousedown', handleOnMouseDown);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleOnMouseUp);

		return () => {
			window.removeEventListener('mousedown', handleOnMouseDown);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleOnMouseUp);
		};
	}, [handleMouseMove, handleOnMouseDown, handleOnMouseUp, percent]);

	// Reset scroll to initial position when resize
	useEffect(() => {
		if (!draggerContainerRef.current || !resetScrollOnResize) {
			return;
		}

		const onResize = (): void => {
			const draggerContainer = draggerContainerRef.current;
			const scrollBar = scrollBarRef.current;
			if (!draggerContainer || !scrollBar) {
				return;
			}
			const maxScrollBarLeft =
				draggerContainer.offsetWidth - scrollBarRef.current.offsetWidth;
			setMaxScrollBarLeft(maxScrollBarLeft);
			if (currentScrollBarLeft.current !== 0) {
				onScroll(0);
				currentScrollBarLeft.current = 0;
			}
		};

		const observer = new ResizeObserver(onResize);
		observer.observe(draggerContainerRef.current);

		return () => observer.disconnect();
	}, [onScroll, resetScrollOnResize]);

	return (
		<div
			className={classNames(styles.scrollTrack, className)}
			ref={draggerContainerRef}
			onClick={handleClickContainer}
		>
			<div
				className={styles.scrollBar}
				ref={scrollBarRef}
				style={{
					width: `${scrollBarWidth * 100}%`,
					left: `${scrollBarLeft}px`,
				}}
			/>
		</div>
	);
};

HorizontalScrollBar.displayName = 'HorizontalScrollBar';
