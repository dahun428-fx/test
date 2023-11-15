import React, { ChangeEvent, VFC, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './TechnicalInformation.module.scss';
import { Section } from '@/components/pc/pages/KeywordSearch/Section/Section';
import { Button } from '@/components/pc/ui/buttons';
import { Select } from '@/components/pc/ui/controls/select';
import { Option } from '@/components/pc/ui/controls/select/Select';
import { Link } from '@/components/pc/ui/links';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { Pagination } from '@/components/pc/ui/paginations';
import { config } from '@/config';
import { SearchTechFullTextRequest } from '@/models/api/msm/ect/fullText/SearchTechFullTextRequest';
import { SearchTechFullTextResponse } from '@/models/api/msm/ect/fullText/SearchTechFullTextResponse';
import { url } from '@/utils/url';

type Props = {
	keyword: string;
	technicalInformationResponse: SearchTechFullTextResponse | null;
	pageSize: number;
	page: number;
	keywordTitle: string;
	loading: boolean;
	load: (spec?: Partial<SearchTechFullTextRequest>) => void;
	onChangeKeyword: (event: ChangeEvent<HTMLInputElement>) => void;
	onChangePage: (page: number) => void;
	onChangePageSize: (pageSize: number) => void;
	onClickTechInfoPDF: (url: string) => void;
};

/** Technical Information component */
export const TechnicalInformation: VFC<Props> = ({
	keyword,
	page,
	pageSize,
	technicalInformationResponse,
	keywordTitle,
	loading,
	load,
	onChangeKeyword,
	onChangePage,
	onChangePageSize,
	onClickTechInfoPDF,
}) => {
	const totalCount = technicalInformationResponse?.totalCount ?? 0;

	const technicalInformationList = useMemo(() => {
		return technicalInformationResponse?.resultList ?? [];
	}, [technicalInformationResponse]);

	const [t] = useTranslation();

	const options: Option[] = config.pagination.techView.sizeList.map(count => ({
		value: `${count}`,
		label: t('pages.keywordSearch.fullTextSearch.count', {
			count,
		}),
	}));

	const handleSearch = (event: React.FormEvent) => {
		event.preventDefault();
		load();
	};

	const renderContent = useMemo(() => {
		if (loading) {
			return <BlockLoader />;
		}

		if (!keywordTitle || !technicalInformationResponse) {
			return null;
		}

		return (
			<>
				<Section
					id="technicalInformation"
					disabledExpand
					className={styles.section}
					title={t('pages.techView.technicalInformation.heading')}
				/>
				{technicalInformationList.length ? (
					<>
						<div className={styles.control}>
							<div className={styles.totalCount}>
								<Trans
									i18nKey="pages.techView.technicalInformation.totalCount"
									count={totalCount}
								>
									<span className={styles.totalCountLabel} />
								</Trans>
							</div>
							<div>
								{t('pages.techView.technicalInformation.displayCount')}
								<Select
									value={`${pageSize}`}
									items={options}
									onChange={option => onChangePageSize(Number(option.value))}
								/>
							</div>
						</div>
						<ul>
							{technicalInformationList.map((information, index) => (
								<li className={styles.item} key={index}>
									<Link
										href={url.technicalInformation(keyword, information.url)}
										className={styles.link}
										newTab
										onClick={() => {
											onClickTechInfoPDF(information.url);
										}}
									>
										<p
											className={styles.title}
											dangerouslySetInnerHTML={{
												__html: information.title,
											}}
										/>
										<p
											className={styles.text}
											dangerouslySetInnerHTML={{ __html: information.text }}
										/>
									</Link>
								</li>
							))}
						</ul>
						<div className={styles.footer}>
							<Pagination
								page={page}
								pageSize={pageSize}
								totalCount={totalCount}
								maxPageCount={10}
								onChange={onChangePage}
							/>
						</div>
					</>
				) : (
					<p className={styles.notice}>
						{t('pages.techView.technicalInformation.notice')}
					</p>
				)}
			</>
		);
	}, [
		keyword,
		keywordTitle,
		loading,
		onChangePage,
		onChangePageSize,
		onClickTechInfoPDF,
		options,
		page,
		pageSize,
		t,
		technicalInformationList,
		technicalInformationResponse,
		totalCount,
	]);

	return (
		<>
			<h1 className={styles.searchResultTitle}>
				{keywordTitle ? (
					<Trans
						i18nKey="pages.techView.technicalInformation.title"
						values={{ keyword: keywordTitle }}
					>
						<span className={styles.keyword} />
					</Trans>
				) : (
					t('pages.techView.technicalInformation.guide')
				)}
			</h1>
			<div>
				<form onSubmit={handleSearch} className={styles.form}>
					<input
						className={styles.input}
						value={keyword}
						onChange={onChangeKeyword}
					/>
					<Button theme="strong" size="s" type="submit">
						{t('pages.techView.technicalInformation.buttonSearch')}
					</Button>
				</form>

				{renderContent}
			</div>
		</>
	);
};

TechnicalInformation.displayName = 'TechnicalInformation';
