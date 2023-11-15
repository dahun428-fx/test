import classNames from 'classnames';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './FullTextSearch.module.scss';
import { Section } from '@/components/pc/pages/KeywordSearch/Section';
import { Select } from '@/components/pc/ui/controls/select';
import { Option } from '@/components/pc/ui/controls/select/Select';
import { Link } from '@/components/pc/ui/links';
import { Pagination } from '@/components/pc/ui/paginations';
import { aa } from '@/logs/analytics/adobe';
import { SearchFullTextRequest } from '@/models/api/msm/ect/fullText/SearchFullTextRequest';
import { SearchFullTextResponse } from '@/models/api/msm/ect/fullText/SearchFullTextResponse';
import { url } from '@/utils/url';

const PAGE_SIZES = [10, 20, 50, 100] as const;

type Props = {
	keyword: string;
	page: number;
	pageSize: number;
	fullTextResponse: SearchFullTextResponse;
	defaultExpanded: boolean;
	reload: (specs?: Partial<SearchFullTextRequest>) => void;
	className?: string;
	onClick: (index: number) => void;
};

/**
 * Full Text Search
 */
export const FullTextSearch: React.VFC<Props> = ({
	page,
	pageSize,
	fullTextResponse,
	defaultExpanded,
	reload,
	onClick,
	className,
	keyword,
}) => {
	const { t } = useTranslation();

	const options: Option[] = PAGE_SIZES.map(count => ({
		value: `${count}`,
		label: t('pages.keywordSearch.fullTextSearch.count', {
			count,
		}),
	}));

	return (
		<Section
			id="fullTextSearch"
			className={className}
			title={t('pages.keywordSearch.fullTextSearch.heading')}
			defaultExpanded={defaultExpanded}
		>
			<div className={styles.control}>
				<div className={styles.totalCount}>
					<Trans
						i18nKey="pages.keywordSearch.fullTextSearch.totalCount"
						count={fullTextResponse.totalCount}
					>
						<span className={styles.totalCountLabel} />
					</Trans>
				</div>
				<div>
					{`${t('pages.keywordSearch.fullTextSearch.displayCount')} : `}
					<Select
						value={`${pageSize}`}
						items={options}
						onChange={option => reload({ pageSize: Number(option.value) })}
					/>
				</div>
			</div>
			<ul>
				{fullTextResponse.resultList.map((result, index) => (
					<li key={index} className={styles.tileWrapper}>
						<Link
							href={url.searchFullText(keyword, result.url)}
							newTab
							className={styles.tile}
							onClick={() => {
								if (result.url.includes('.pdf')) {
									aa.events.sendClickFullTextPDF();
								}
								onClick(index);
							}}
						>
							<p
								className={classNames(styles.link, {
									[String(styles.pdf)]: result.url.includes('.pdf'),
								})}
								dangerouslySetInnerHTML={{ __html: result.title }}
							/>
							<p
								className={styles.text}
								dangerouslySetInnerHTML={{ __html: result.text }}
							/>
						</Link>
					</li>
				))}
			</ul>
			<div className={styles.footer}>
				<Pagination
					page={page}
					pageSize={pageSize}
					totalCount={fullTextResponse.totalCount}
					maxPageCount={10}
					onChange={page => reload({ page })}
				/>
			</div>
		</Section>
	);
};
FullTextSearch.displayName = 'FullTextSearch';
