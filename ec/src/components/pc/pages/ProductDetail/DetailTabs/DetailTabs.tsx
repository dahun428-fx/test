import React, { FC, useCallback } from 'react';
import { useDetailTab } from './DetailTabs.hooks';
import styles from './DetailTabs.module.scss';
import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';
import { Catalog } from '@/components/pc/pages/ProductDetail/Catalog';
import { PartNumberList } from '@/components/pc/pages/ProductDetail/PartNumberList';
import { BasicInformation } from '@/components/pc/pages/ProductDetail/templates/Complex/BasicInformation';
import { scrollToTab } from '@/components/pc/pages/ProductDetail/templates/Complex/Complex.utils';
import { DetailInformationTab } from '@/components/pc/pages/ProductDetail/templates/Complex/DetailInformationTab';
import { DetailTab } from '@/components/pc/pages/ProductDetail/templates/Complex/DetailTab';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { aa } from '@/logs/analytics/adobe';
import { ectLogger } from '@/logs/ectLogger';
import { TabId } from '@/models/domain/series/complexTab';

const SELECTORS = ['#actionsPanel', '#detailTabs'];

type Props = {
	ignoreTabs?: TabId[];
};

export const DetailTabs: FC<Props> = ({ ignoreTabs }) => {
	const { translateTab } = useTabTranslation();
	const { tabList, showsDetailInfo, tabContents, basicInfo, series } =
		useDetailTab({ ignoreTabs });
	const { seriesCode } = series;

	const sendTabChangeLog = useCallback(
		(tabId: TabId) => {
			ectLogger.tab.change({
				brandCode: series.brandCode,
				seriesCode,
				tabId,
			});
		},
		[series, seriesCode]
	);

	const handleClickInformationTab = useCallback(
		(tabId: TabId) => {
			scrollToTab(tabId);
			if (tabId === 'catalog') {
				aa.events.sendCatalogTab();
			}
			sendTabChangeLog(tabId);
		},
		[sendTabChangeLog]
	);

	return (
		<div>
			<div className={styles.tabContainer}>
				<DetailTab tabList={tabList} onSendLog={sendTabChangeLog} />
			</div>
			{tabList.map(tab => {
				switch (tab.tabId) {
					case 'catalog':
						return (
							<div id={tab.tabId} key={tab.tabId}>
								<Catalog />
							</div>
						);
					case 'codeList':
						return (
							<div className={styles.sectionMargin} key={tab.tabId}>
								<PartNumberList
									seriesCode={seriesCode}
									stickyTopSelectors={SELECTORS}
								/>
							</div>
						);
					case 'detailInfo':
						return (
							<div
								id={tab.tabId}
								key={tab.tabId}
								className={styles.sectionMargin}
							>
								<DetailInformationTab
									informationTabList={tabContents.filter(
										content => content.showsOnDetail
									)}
									showsDetailInfo={showsDetailInfo}
									onClickTab={handleClickInformationTab}
								/>
								{tabContents
									.filter(content => content.showsOnDetail)
									.map(detailTabContent => {
										switch (detailTabContent.tabId) {
											case 'basicInfo':
												return (
													<div
														id={detailTabContent.tabId}
														key={detailTabContent.tabId}
													>
														<BasicInformation {...basicInfo} />
													</div>
												);
											case 'catalog':
												return (
													<div
														id={detailTabContent.tabId}
														key={detailTabContent.tabId}
													>
														<Catalog />
													</div>
												);
											default:
												return (
													detailTabContent.htmlList &&
													detailTabContent.htmlList.length > 0 && (
														<div
															id={detailTabContent.tabId}
															key={detailTabContent.tabId}
														>
															<h3 className={styles.detailTabTitle}>
																{translateTab(detailTabContent.tabId)}
															</h3>
															{detailTabContent.htmlList.map(html => (
																<LegacyStyledHtml
																	key={html.name}
																	html={html.html ?? ''}
																	isDetail
																	isComplex
																	isWysiwyg
																/>
															))}
														</div>
													)
												);
										}
									})}
							</div>
						);
					default:
						return (
							<div id={tab.tabId} key={tab.tabId}>
								<h2 className={styles.tabTitle}>{translateTab(tab.tabId)}</h2>
								{tabContents
									.find(tabContent => tabContent.tabId === tab.tabId)
									?.htmlList?.map(html => (
										<LegacyStyledHtml
											key={html.name}
											html={html.html ?? ''}
											isDetail
											isComplex
											isWysiwyg
										/>
									))}
							</div>
						);
				}
			})}
		</div>
	);
};
DetailTabs.displayName = 'DetailTabs';
