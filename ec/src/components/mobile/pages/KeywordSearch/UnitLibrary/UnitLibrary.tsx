import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UnitLibrary.module.scss';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { Link } from '@/components/mobile/ui/links';
import { IdeaNote } from '@/models/api/cms/SearchIdeaNoteResponse';
import { url } from '@/utils/url';

type Props = {
	keyword: string;
	searchBeanList: IdeaNote[];
	onClickInCadLink: (index: number, link: string) => void;
	onClickSearchAllLink: () => void;
};

/**
 * Unit Library
 */
export const UnitLibrary: React.VFC<Props> = ({
	keyword,
	searchBeanList,
	onClickInCadLink,
	onClickSearchAllLink,
}) => {
	const [t] = useTranslation();

	return (
		<div>
			<SectionHeading>
				{t('mobile.pages.keywordSearch.unitLibrary.heading')}
			</SectionHeading>
			<ul className={styles.list}>
				{searchBeanList.map((ideaNote, index) => {
					return (
						<li className={styles.item} key={index}>
							<Link
								href={url.searchInCadLibrary(keyword, ideaNote.link)}
								target="_blank"
								className={styles.link}
								onClick={() => onClickInCadLink(index, ideaNote.link)}
							>
								<div className={styles.main}>
									<div className={styles.imageWrapper}>
										<img // eslint-disable-line @next/next/no-img-element
											src={url.searchInCadLibraryImage(ideaNote.eglibCd)}
											alt={ideaNote.eglibNameForAlt}
											className={styles.image}
										/>
									</div>
									<div>
										<p
											className={styles.title}
											dangerouslySetInnerHTML={{
												__html: t(
													'mobile.pages.keywordSearch.unitLibrary.title',
													{
														eglibCd: ideaNote.eglibCd,
														eglibName: ideaNote.eglibName,
													}
												),
											}}
										/>
										<p
											className={styles.text}
											dangerouslySetInnerHTML={{
												__html: ideaNote.eglibCatchCopy,
											}}
										/>
									</div>
								</div>
								<p
									className={styles.text}
									dangerouslySetInnerHTML={{ __html: ideaNote.text }}
								/>
							</Link>
						</li>
					);
				})}
			</ul>
			<div className={styles.showAllWrapper}>
				<Link
					href={url.searchInCadLibraryAll(keyword)}
					newTab
					className={styles.showAllLink}
					onClick={onClickSearchAllLink}
				>
					{t('mobile.pages.keywordSearch.unitLibrary.showAll')}
				</Link>
			</div>
		</div>
	);
};
UnitLibrary.displayName = 'UnitLibrary';
