import classNames from 'classnames';
import { MouseEvent, useEffect, useState, VFC } from 'react';
import Sticky from 'react-stickynode';
import styles from './DetailTab.module.scss';
import { getActionsPanelHeight } from '@/components/pc/pages/ProductDetail/ProductDetail.utils';
import {
	getTabHeight,
	scrollToTab,
} from '@/components/pc/pages/ProductDetail/templates/Complex/Complex.utils';
import { useDetailTabStickyTop } from '@/components/pc/pages/ProductDetail/templates/Complex/DetailTab/DetailTab.hooks';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { aa } from '@/logs/analytics/adobe';
import { TabId, WysiwygTab } from '@/models/domain/series/complexTab';
import { getVerticalScrollbarWidth } from '@/utils/dom';

type Props = {
	tabList: WysiwygTab[];
	onSendLog: (tabId: TabId) => void;
};

/** Detail tab component */
export const DetailTab: VFC<Props> = ({ tabList, onSendLog }) => {
	const { translateTab } = useTabTranslation();
	const [currentTabId, setCurrentTabId] = useState<TabId | undefined>(
		tabList[0]?.tabId
	);

	const handleClickTab = (event: MouseEvent, tabId: TabId) => {
		event.preventDefault();
		scrollToTab(tabId);
		if (tabId === 'catalog') {
			aa.events.sendCatalogTab();
		}
		// NOTE: better to use `onClickTab` as prop name and handle sending log outside. Should be refactored later due to time constraint.
		onSendLog(tabId);
	};

	useEffect(() => {
		const panelHeight = getActionsPanelHeight();
		const tabHeight = getTabHeight();
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry && entry.isIntersecting) {
					setCurrentTabId(entry.target.id as TabId);
				}
			},
			{
				rootMargin: `-${panelHeight + tabHeight}px 0px -${
					window.innerHeight -
					(panelHeight + tabHeight + 3) -
					getVerticalScrollbarWidth()
				}px 0px`,
			}
		);

		for (const tab of tabList) {
			const tabElement = document.querySelector(`#${tab.tabId}`);
			if (tabElement) {
				observer.observe(tabElement);
			}
		}

		return () => observer.disconnect();
	}, [tabList]);

	const detailTabStickyTop = useDetailTabStickyTop();

	return (
		<Sticky
			top={detailTabStickyTop}
			bottomBoundary="#productContents"
			innerActiveClass={styles.sticky}
		>
			<div className={styles.container} id="detailTabs">
				<ul className={styles.list}>
					{tabList.map((tab, index) => {
						return (
							<li className={styles.item} key={index}>
								<a
									onClick={event => handleClickTab(event, tab.tabId)}
									href={`#${tab.tabId}`}
									className={classNames(styles.itemLink, {
										[String(styles.active)]: currentTabId === tab.tabId,
									})}
								>
									{translateTab(tab.tabId)}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</Sticky>
	);
};
DetailTab.displayName = 'DetailTab';
