import {
	FC,
	ReactNode,
	useRef,
	useState,
	useEffect,
	useLayoutEffect,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './ProductDetailTabPanel.module.scss';

const increment = (count: number) =>
	count >= Number.MAX_SAFE_INTEGER ? 0 : count + 1;

type Props = {
	shows: boolean;
	productSpecRef: React.RefObject<HTMLDivElement>;
	children: ReactNode;
};

export const ProductDetailTabPanel: FC<Props> = ({
	shows,
	productSpecRef,
	children,
}) => {
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
		<div className={styles.show}>{children}</div>
	) : (
		<div className={styles.noTab} />
	);
};

ProductDetailTabPanel.displayName = 'ProductDetailTabPanel';
