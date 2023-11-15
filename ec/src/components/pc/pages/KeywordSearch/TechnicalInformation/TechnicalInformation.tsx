import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TechnicalInformation.module.scss';
import { Section } from '@/components/pc/pages/KeywordSearch/Section';
import { Link } from '@/components/pc/ui/links';
import { aa } from '@/logs/analytics/adobe';
import { Result } from '@/models/api/msm/ect/fullText/SearchFullTextResponse';
import { pagesPath } from '@/utils/$path';
import { convertToURLString, url } from '@/utils/url';

type Props = {
	keyword: string;
	technicalInformationList: Result[];
	defaultExpanded: boolean;
	className?: string;
	onClick: (index: number) => void;
	onClickShowAll: (url: string) => void;
};

/**
 * Full Text Search for Technical Information
 */
export const TechnicalInformation: React.VFC<Props> = ({
	keyword,
	technicalInformationList,
	defaultExpanded,
	className,
	onClick,
	onClickShowAll,
}) => {
	const { t } = useTranslation();

	const showAllUrl = pagesPath.vona2.result.tech_view.$url({
		query: { type: 'tech', KWSearch: keyword, kw: keyword },
	});

	return (
		<Section
			id="technicalInformation"
			className={className}
			title={t('pages.keywordSearch.technicalInformation.heading')}
			defaultExpanded={defaultExpanded}
		>
			<ul>
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
								className={styles.title}
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
					onClick={() => onClickShowAll(convertToURLString(showAllUrl))}
				>
					{t('pages.keywordSearch.technicalInformation.searchAllText')}
				</Link>
			</div>
		</Section>
	);
};
TechnicalInformation.displayName = 'TechnicalInformation';
