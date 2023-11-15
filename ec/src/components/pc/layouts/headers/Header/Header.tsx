import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AsideNavs } from './AsideNavs';
import styles from './Header.module.scss';
import { Logo } from './Logo';
import { MegaNavMenu } from './MegaNavMenu';
import { NoSupportBrowserMessage } from './NoSupportBrowserMessage/NoSupportBrowserMessage';
import { SearchBox } from './SearchBox';

type Props = {
	/** 固定表示するか */
	fixed?: boolean;
};

/**
 * ヘッダー
 */
export const Header: React.VFC<Props> = ({}) => {
	const router = useRouter();
	const [isOverlay, setIsOverlay] = useState(false);

	// TODO: 本来は app から props で受けたいが、mobile にも影響がありそうなので雑に実装
	const pathIsHome = router.pathname === '/';
	const pathIsResult = router.pathname === '/vona2/result';
	const { Keyword, KWSearch } = router.query;
	const keyword =
		(Array.isArray(Keyword) ? Keyword[Keyword.length - 1] : Keyword) ||
		(Array.isArray(KWSearch) ? KWSearch[KWSearch.length - 1] : KWSearch);

	return (
		<>
			<header className={styles.header} data-sticky-enabled={pathIsHome}>
				<NoSupportBrowserMessage />
				<div className={styles.contentsWrapper}>
					<div className={styles.contents}>
						<div className={styles.main}>
							<Logo needsHeading={pathIsHome} />
							<div className={styles.searchBoxWrapper}>
								<div className={styles.megaNavWrapper}>
									<MegaNavMenu />
								</div>
								<SearchBox
									keyword={keyword}
									isReSearch={pathIsResult}
									setIsOverlay={setIsOverlay}
								/>
							</div>
						</div>
						<div className={styles.aside}>
							<AsideNavs />
						</div>
					</div>
				</div>
			</header>
			<div className={isOverlay ? styles.hasSuggestOverlay : ''} />
		</>
	);
};
