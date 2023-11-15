import classNames from 'classnames';
import React, {
	CSSProperties,
	forwardRef,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from 'react';
import Sticky from 'react-stickynode';
import ResizeObserver from 'resize-observer-polyfill';
import { HorizontalScrollBar } from './HorizontalScrollBar';
import styles from './HorizontalScrollbarContainer.module.scss';

type Props = {
	children?: ReactNode;
	enabled?: boolean;
	className?: string;
	innerStyle?: CSSProperties;
	activeInnerStyle?: CSSProperties;
	stickyEnabled?: boolean;
	stickyTop?: number;
	stickyBottomBoundary?: string;
	/**
	 * true のとき、
	 * HorizontalScrollbar と Sticky部分（or ブラウザの上辺）との間に1pxの隙間が空かないスタイルを適用する。
	 * （現状[2023年4月]のtrue対象：ProductDetail ページ 複雑系などの PartNumberSpecColumnsでの使用）
	 */
	isHorizontalScrollbarBetweenSticky?: boolean;
};

export const HorizontalScrollbarContainer = forwardRef<HTMLDivElement, Props>(
	(
		{
			children,
			enabled = true,
			className,
			innerStyle,
			activeInnerStyle,
			stickyEnabled,
			stickyTop,
			stickyBottomBoundary,
			isHorizontalScrollbarBetweenSticky,
		},
		ref
	) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const innerRef = useRef<HTMLDivElement>(null);
		const [{ innerLeft, barWidth }, setScrollState] = useState<{
			innerLeft: number;
			barWidth: number;
		}>({ innerLeft: 0, barWidth: 1 });
		const [percent, setPercent] = useState<number>(0);
		const scrollable = enabled && barWidth < 1;

		useEffect(() => {
			const onResize = () => {
				if (!containerRef.current || !innerRef.current) {
					return;
				}
				setScrollState({
					innerLeft:
						innerRef.current.offsetWidth - containerRef.current.offsetWidth,
					barWidth:
						containerRef.current.clientWidth / innerRef.current.scrollWidth,
				});
			};

			onResize();
			if (enabled) {
				const observer = new ResizeObserver(onResize);
				if (innerRef.current) {
					observer.observe(innerRef.current);
				}

				if (containerRef.current) {
					observer.observe(containerRef.current);
				}
				return () => observer.disconnect();
			}
		}, [enabled]);

		// 1msかからない処理なので、useMemo 不要
		const barFallbackStyle = isHorizontalScrollbarBetweenSticky
			? styles.barFallbackBetweenSticky
			: styles.barFallback;

		return (
			<div
				className={classNames(className, styles.container, {
					[String(styles.scrollable)]: scrollable,
				})}
				ref={ref}
			>
				<div ref={containerRef}>
					<Sticky
						enabled={stickyEnabled}
						innerZ={1}
						top={stickyTop}
						bottomBoundary={stickyBottomBoundary}
					>
						{scrollable ? (
							<HorizontalScrollBar
								percent={percent}
								scrollBarWidth={barWidth}
								onScroll={setPercent}
								className={styles.stickyBar}
							/>
						) : (
							<div className={barFallbackStyle} />
						)}
					</Sticky>
					<div
						className={styles.inner}
						style={{
							...innerStyle,
							...(scrollable ? activeInnerStyle : undefined),
						}}
						ref={innerRef}
					>
						<div
							className={styles.contentsWrap}
							style={{ left: `-${innerLeft * percent}px` }}
						>
							{children}
						</div>
					</div>
				</div>
			</div>
		);
	}
);
HorizontalScrollbarContainer.displayName = 'HorizontalScrollbarContainer';
