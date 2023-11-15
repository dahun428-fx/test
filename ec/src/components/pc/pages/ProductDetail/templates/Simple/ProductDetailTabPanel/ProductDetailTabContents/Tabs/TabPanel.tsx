import classNames from 'classnames';
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './TabPanel.module.scss';
import { getActionsPanelHeight } from '@/components/pc/pages/ProductDetail/ProductDetail.utils';
import { getDocumentHeight } from '@/utils/dom';

type Props = {
	hidden: boolean;
	hideHorizontalScroll?: boolean;
	contentParentId: string;
};

const TOP_SCROLL_BAR_RATIO = 99;
const MARGIN = 16;

export const TabPanel: React.FC<Props> = ({
	hidden,
	hideHorizontalScroll,
	contentParentId,
	children,
}) => {
	const scrollBarRef = useRef<HTMLDivElement>(null);
	const contentContainerRef = useRef<HTMLDivElement>(null);
	const contentInnerRef = useRef<HTMLDivElement>(null);
	const [maxHeight, setMaxHeight] = useState<number>();
	const [draggerWidth, setDraggerWidth] = useState<number>();

	/** 上部スクロールバーのつまむ部分の幅を返します */
	const getDraggerWidth = useCallback(() => {
		if (contentContainerRef.current && contentInnerRef.current) {
			return (
				(contentContainerRef.current.scrollWidth /
					contentInnerRef.current.clientWidth) *
				TOP_SCROLL_BAR_RATIO
			);
		}

		return 0;
	}, []);

	/** タブコンテンツ部分のあるべき高さを返します */
	const getTabPanelHeight = useCallback((tabPanel: HTMLDivElement) => {
		const top = getActionsPanelHeight() + MARGIN;
		// NOTE: tabPanel.offsetTop は ProductDetailTabPanel.module.scss の
		//       position: relative に依存しているため注意してください。
		return getDocumentHeight() - top - tabPanel.offsetTop - MARGIN;
	}, []);

	// window resize による、上部スクロールバーのつまみの幅と、パネルの高さの更新
	useLayoutEffect(() => {
		const onResize = () => {
			// scrollbar
			setDraggerWidth(getDraggerWidth());

			// TabPanel max-height
			if (contentContainerRef.current) {
				setMaxHeight(getTabPanelHeight(contentContainerRef.current));
			}
		};

		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [getDraggerWidth, getTabPanelHeight, hidden]);

	// タブコンテンツをレンダリング & ロードした結果そのコンテンツサイズが変わった際の
	// 上部スクロールバーのつまみの幅の再計算
	useEffect(() => {
		if (contentInnerRef.current) {
			if (!hidden) {
				setDraggerWidth(getDraggerWidth());
				const observer = new ResizeObserver(([entry]) => {
					if (contentInnerRef.current && entry) {
						setDraggerWidth(
							(entry.target.scrollWidth / contentInnerRef.current.clientWidth) *
								TOP_SCROLL_BAR_RATIO
						);
					}
				});
				observer.observe(contentInnerRef.current);
				return () => observer.disconnect();
			}
		}
	}, [getDraggerWidth, hidden]);

	// タブ表示時の上部スクロールバーのつまみの幅の再計算
	useEffect(() => {
		if (!hidden) {
			setDraggerWidth(getDraggerWidth());
		}
	}, [getDraggerWidth, hidden]);

	// 上部スクロールバーと下部スクロールバーのスクロール位置の同期
	// (タブ表示切り替え時にイベントリスナーを再登録)
	useEffect(() => {
		const scrollBar = scrollBarRef.current;
		const contentContainer = contentContainerRef.current;

		const onScrollScrollBar = () => {
			if (scrollBar && contentContainer) {
				contentContainer.scrollTo(
					scrollBar.scrollLeft,
					contentContainer.scrollTop
				);
			}
		};

		const onScrollContentContainer = () => {
			if (scrollBar && contentContainer) {
				scrollBar.scrollTo(contentContainer.scrollLeft, 0);
			}
		};

		if (scrollBar) {
			scrollBar.addEventListener('scroll', onScrollScrollBar);
		}

		if (contentContainer) {
			contentContainer.addEventListener('scroll', onScrollContentContainer);
		}

		return () => {
			if (scrollBar) {
				scrollBar.removeEventListener('scroll', onScrollScrollBar);
			}

			if (contentContainer) {
				contentContainer.removeEventListener(
					'scroll',
					onScrollContentContainer
				);
			}
		};
	}, [hidden]);

	return (
		<div className={hidden ? styles.hidden : ''}>
			<div
				className={classNames(styles.topScrollBarContainer, {
					[String(styles.hidden)]:
						hideHorizontalScroll ||
						(draggerWidth != null && draggerWidth <= 99),
				})}
				ref={scrollBarRef}
			>
				<div
					className={styles.topScrollBar}
					style={{ width: `${draggerWidth}%` }}
				/>
			</div>
			<div
				className={classNames(styles.container, {
					[String(styles.hideHorizontalScroll)]: hideHorizontalScroll,
				})}
				ref={contentContainerRef}
				style={{ maxHeight }}
			>
				<div ref={contentInnerRef} id={contentParentId}>
					{children}
				</div>
			</div>
		</div>
	);
};
TabPanel.displayName = 'TabPanel';
