import React, { RefObject } from 'react';
import styles from './BackToTop.module.scss';

type Props = {
	layoutRootRef: RefObject<HTMLDivElement>;
};

/**
 * Back to top
 * - TOP にスクロールアップ
 */
export const BackToTop: React.VFC<Props> = ({ layoutRootRef }) => {
	const handleClickBackToTop = (event: React.MouseEvent) => {
		event.preventDefault();
		if (layoutRootRef.current) {
			// - NOTE: scrollIntoView は OS 設定の影響を受けて有効・無効が切り替わります(Chrome で確認)。 https://kakakumag.com/pc-smartphone/?id=4007
			// - NOTE: IE11 では smooth スクロールになりません。 https://developer.mozilla.org/ja/docs/Web/API/Element/scrollIntoView
			layoutRootRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<a
			href="#"
			className={styles.backToTop}
			onClick={handleClickBackToTop}
			aria-label="Back to Top"
		/>
	);
};
