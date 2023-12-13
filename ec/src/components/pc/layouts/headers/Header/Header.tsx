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
			<header data-sticky-enabled={pathIsHome}>
				<div>
					{/* <div></div> l-headerFixedBg */}
					<div className={styles.headN}>
						{/* <div></div> l-header_ttUserWrap */}
						<div className={styles.headerWrap}>
							<div className={styles.header}>
								<div className={styles.headerMain}>
									<div className={styles.headerLogoWrap}>
										<h1 className={styles.headerLogo}>
											<span>MISUMI | Your Time, Our Priority</span>
										</h1>
									</div>
									<SearchBox
										keyword={keyword}
										isReSearch={pathIsResult}
										setIsOverlay={setIsOverlay}
									/>
									<MegaNavMenu />
								</div>
								<div className={styles.headerAside}>
									<AsideNavs />
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};
