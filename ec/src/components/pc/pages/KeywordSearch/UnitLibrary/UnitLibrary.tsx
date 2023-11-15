import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UnitLibrary.module.scss';
import { Section } from '@/components/pc/pages/KeywordSearch/Section';
import { Link } from '@/components/pc/ui/links';
import { SearchIdeaNoteResponse } from '@/models/api/cms/SearchIdeaNoteResponse';
import { url } from '@/utils/url';

type Props = {
	className?: string;
	keyword: string;
	ideaNoteResponse: SearchIdeaNoteResponse;
	defaultExpanded: boolean;
	onClickInCadLink: (index: number, link: string) => void;
	onClickSearchAllLink: () => void;
};

/**
 * Unit Library
 */
export const UnitLibrary: React.VFC<Props> = ({
	className,
	keyword,
	ideaNoteResponse,
	defaultExpanded,
	onClickInCadLink,
	onClickSearchAllLink,
}) => {
	const { t } = useTranslation();

	// 表示が３つまでの条件
	const ideaNoteBeanList = ideaNoteResponse.searchBeanList.slice(0, 3);

	return (
		<Section
			id="unitLibrary"
			className={className}
			title={t('pages.keywordSearch.unitLibrary.heading')}
			defaultExpanded={defaultExpanded}
		>
			<div>
				<ul className={styles.listContainer}>
					{ideaNoteBeanList.map((item, index) => (
						<Link
							href={url.searchInCadLibrary(keyword, item.link, true)}
							className={styles.linkContainer}
							key={item.eglibCd}
							onClick={() => onClickInCadLink(index, item.link)}
							newTab
						>
							<li className={styles.listItem}>
								<div className={styles.listArea}>
									<div className={styles.imageBox}>
										{/* Next/Image を使うために、現時点では next.config に修正が必要なので一旦 img で実装 */}
										<img // eslint-disable-line @next/next/no-img-element
											src={url.searchInCadLibraryImage(item.eglibCd)}
											alt={item.eglibNameForAlt}
											className={styles.image}
										/>
									</div>
									<div className={styles.itemDescriptionContainer}>
										<p
											className={styles.itemName}
											dangerouslySetInnerHTML={{
												__html: t(
													'pages.keywordSearch.unitLibrary.productName',
													{
														cd: item.eglibCd,
														name: item.eglibName,
													}
												),
											}}
										/>
										<div>
											<p
												className={styles.htmlSubmissionItem}
												dangerouslySetInnerHTML={{
													__html: `${item.eglibCatchCopy}`,
												}}
											/>
										</div>
										<div>
											<p
												className={styles.htmlSubmissionItem}
												dangerouslySetInnerHTML={{
													__html: `${item.text}`,
												}}
											/>
										</div>
									</div>
								</div>
							</li>
						</Link>
					))}
				</ul>
				<div className={styles.searchAllContainer}>
					<Link
						href={url.searchInCadLibraryAll(keyword)}
						newTab
						onClick={onClickSearchAllLink}
					>
						{t('pages.keywordSearch.unitLibrary.searchAllText')}
					</Link>
				</div>
			</div>
		</Section>
	);
};
UnitLibrary.displayName = 'UnitLibrary';
