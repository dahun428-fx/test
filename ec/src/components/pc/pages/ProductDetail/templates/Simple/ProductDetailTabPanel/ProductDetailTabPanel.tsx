import {
	FC,
	ReactNode,
	useRef,
	useState,
	useEffect,
	useLayoutEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import Sticky from 'react-stickynode';
import { CSSTransition } from 'react-transition-group';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './ProductDetailTabPanel.module.scss';
import { ACTIONS_PANEL_SELECTOR } from '@/components/pc/pages/ProductDetail/constants';

const increment = (count: number) =>
	count >= Number.MAX_SAFE_INTEGER ? 0 : count + 1;

type Props = {
	tabName?: string;
	shows: boolean;
	productSpecRef: React.RefObject<HTMLDivElement>;
	children: ReactNode;
};

export const ProductDetailTabPanel: FC<Props> = ({
	tabName,
	shows,
	productSpecRef,
	children,
}) => {
	const [t] = useTranslation();
	const [isOpen, setIsOpen] = useState(true);
	const [showButton, setShowButton] = useState(!isOpen);
	const nodeRef = useRef(null);

	// 闇魔法用 state (後述)
	const [, setCount] = useState(0);

	// 右側のパネルのサイズが変化した時に
	// 無為な state 更新をすることで sticky 座標再計算を発火させる闇の魔法。代替手段があるなら今すぐそれにしたい。
	useEffect(() => {
		if (productSpecRef.current) {
			const observer = new ResizeObserver(() => {
				setCount(increment);
			});
			observer.observe(productSpecRef.current);
			return () => observer.disconnect();
		}
	}, [productSpecRef]);

	// タブを切り替えた時に切り替え前のタブの高さが小 → 大と切り替わった時に、
	// 無為な state 更新をすることで sticky 座標再計算を発火させる闇の魔法。代替手段があるなら今すぐそれにしたい。
	// - 2022/12/12 以下商品の「外形図」の高さが小さいので、動確に使える。
	//   https://stg1-jp.misumi-ec.com/vona2/detail/110600001370/?Template=simple
	useLayoutEffect(() => {
		if (nodeRef.current) {
			const observer = new ResizeObserver(() => {
				setCount(increment);
			});
			observer.observe(nodeRef.current);
			return () => observer.disconnect();
		}
	}, [nodeRef]);

	// タブパネルの下端を resize 時にプルプルさせないために
	// 無為な state 更新をすることで sticky 座標再計算を発火させる闇の魔法。代替手段があるなら今すぐそれにしたい。
	useLayoutEffect(() => {
		const onResize = () => setCount(increment);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	return shows ? (
		<div className={styles.panel} aria-expanded={!showButton}>
			<Sticky
				top={ACTIONS_PANEL_SELECTOR}
				bottomBoundary="#productContents"
				className={styles.sticky}
				innerClass={styles.stickyInner}
			>
				<CSSTransition
					in={isOpen}
					nodeRef={nodeRef}
					timeout={300}
					classNames={{
						enter: styles.enter,
						enterActive: styles.enterActive,
						exit: styles.exit,
						exitActive: styles.exitActive,
						exitDone: styles.exitDone,
					}}
					onEnter={() => setShowButton(false)}
					onExited={() => setShowButton(true)}
				>
					<div ref={nodeRef} className={styles.wrapper}>
						<div className={styles.container}>
							<div className={styles.header}>
								<button
									className={styles.closeButton}
									onClick={() => setIsOpen(!isOpen)}
								>
									{t(
										'pages.productDetail.simple.productDetailTabPanel.closeLabel',
										{
											tabName,
										}
									)}
								</button>
							</div>
							<div>{children}</div>
						</div>
					</div>
				</CSSTransition>
				{showButton && (
					<button
						className={styles.openButton}
						onClick={() => setIsOpen(!isOpen)}
					>
						{t('pages.productDetail.simple.productDetailTabPanel.openLabel', {
							tabName,
						})}
					</button>
				)}
			</Sticky>
		</div>
	) : (
		<div className={styles.noTab} />
	);
};
