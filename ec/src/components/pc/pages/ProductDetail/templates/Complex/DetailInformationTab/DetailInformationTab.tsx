import { MouseEvent, VFC } from 'react';
import styles from './DetailInformationTab.module.scss';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { TabId, WysiwygTab } from '@/models/domain/series/complexTab';

type Props = {
	showsDetailInfo: boolean;
	informationTabList: WysiwygTab[];
	onClickTab: (tabId: TabId) => void;
};

/** Detail Information tab component */
export const DetailInformationTab: VFC<Props> = ({
	showsDetailInfo,
	informationTabList,
	onClickTab,
}) => {
	const { translateTab } = useTabTranslation();

	const handleClickTab = (event: MouseEvent, tabId: TabId) => {
		event.preventDefault();
		onClickTab(tabId);
	};

	if (!showsDetailInfo) {
		return null;
	}

	return (
		<>
			<h2 className={styles.heading}>{translateTab('detailInfo')}</h2>
			<div className={styles.container}>
				<ul className={styles.list}>
					{informationTabList.map(tab => {
						return (
							<li className={styles.item} key={tab.tabId}>
								<a
									onClick={event => handleClickTab(event, tab.tabId)}
									href={`#${tab.tabId}`}
									className={styles.itemLink}
								>
									{translateTab(tab.tabId)}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
};
DetailInformationTab.displayName = 'DetailInformationTab';
