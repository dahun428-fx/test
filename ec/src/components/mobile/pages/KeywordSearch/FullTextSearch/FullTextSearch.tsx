import classNames from 'classnames';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './FullTextSearch.module.scss';
import { Select } from '@/components/mobile/ui/controls/select';
import { Option } from '@/components/mobile/ui/controls/select/Select';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { Link } from '@/components/mobile/ui/links';
import { Pagination } from '@/components/mobile/ui/paginations';
import { aa } from '@/logs/analytics/adobe';
import { SearchFullTextRequest } from '@/models/api/msm/ect/fullText/SearchFullTextRequest';
import { SearchFullTextResponse } from '@/models/api/msm/ect/fullText/SearchFullTextResponse';
import { url } from '@/utils/url';

export const PAGE_SIZES = [10, 20, 50, 100] as const;

type Props = {
	keyword: string;
	page: number;
	pageSize: number;
	fullTextResponse: SearchFullTextResponse;
	reload: (specs?: Partial<SearchFullTextRequest>) => void;
	onClick: (index: number) => void;
};

/**
 * Full Text Search
 */
export const FullTextSearch: React.VFC<Props> = ({
	page,
	pageSize,
	fullTextResponse,
	reload,
	keyword,
	onClick,
}) => {
	const { t } = useTranslation();

	const options: Option[] = PAGE_SIZES.map(count => ({
		value: `${count}`,
		label: `${count}`,
	}));

	return (
		<>
			<SectionHeading>
				{t('mobile.pages.keywordSearch.fullTextSearch.heading')}
			</SectionHeading>
			<div className={styles.control}>
				<div className={styles.totalCount}>
					<Trans
						i18nKey="mobile.pages.keywordSearch.fullTextSearch.totalCount"
						count={fullTextResponse.totalCount}
					>
						<span className={styles.totalCountLabel} />
					</Trans>
				</div>
				<div>
					<Select
						value={`${pageSize}`}
						items={options}
						onChange={option => reload({ pageSize: Number(option.value) })}
					/>
				</div>
			</div>
			<ul className={styles.list}>
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
								className={classNames(styles.text, {
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
			<Pagination
				page={page}
				pageSize={pageSize}
				totalCount={fullTextResponse.totalCount}
				onChange={page => reload({ page })}
				maxPageCount={10}
			/>
		</>
	);
};
FullTextSearch.displayName = 'FullTextSearch';
