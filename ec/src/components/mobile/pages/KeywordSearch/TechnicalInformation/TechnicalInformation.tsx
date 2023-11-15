import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TechnicalInformation.module.scss';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { Link } from '@/components/mobile/ui/links';
import { aa } from '@/logs/analytics/adobe';
import { Result } from '@/models/api/msm/ect/fullText/SearchFullTextResponse';
import { pagesPath } from '@/utils/$path';
import { convertToURLString, url } from '@/utils/url';

type Props = {
	keyword: string;
	technicalInformationList: Result[];
	onClick: (index: number) => void;
	onClickShowAll: (url: string) => void;
};

/**
 * Technical Information
 */
export const TechnicalInformation: React.VFC<Props> = ({
	keyword,
	technicalInformationList,
	onClick,
	onClickShowAll,
}) => {
	const { t } = useTranslation();
	const showAllUrl = pagesPath.vona2.result.tech_view.$url({
		query: { type: 'tech', KWSearch: keyword, kw: keyword },
	});

	return (
		<div className={styles.technicalInformation}>
			<SectionHeading>
				{t('mobile.pages.keywordSearch.technicalInformation.heading')}
			</SectionHeading>
			<ul className={styles.list}>
				{technicalInformationList.map((information, index) => (
					<li className={styles.item} key={index}>
						<Link
							href={url.technicalInformation(keyword, information.url)}
							className={styles.link}
							newTab
							onClick={() => {
								if (information.url.includes('.pdf')) {
									aa.events.sendClickTechInfoPDF();
								}
								onClick(index);
							}}
						>
							<p
								className={styles.text}
								dangerouslySetInnerHTML={{ __html: information.title }}
							/>
							<p
								className={styles.text}
								dangerouslySetInnerHTML={{ __html: information.text }}
							/>
						</Link>
					</li>
				))}
			</ul>
			<div className={styles.searchAllContainer}>
				<Link
					href={showAllUrl}
					newTab
					className={styles.showAllLink}
					onClick={() => onClickShowAll(convertToURLString(showAllUrl))}
				>
					{t('mobile.pages.keywordSearch.technicalInformation.searchAllText')}
				</Link>
			</div>
		</div>
	);
};
TechnicalInformation.displayName = 'TechnicalInformation';
