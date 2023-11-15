import React, { ChangeEvent, VFC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TechnicalInformation.module.scss';
import { Select, Option } from '@/components/mobile/ui/controls/select';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { Link } from '@/components/mobile/ui/links';
import { BlockLoader } from '@/components/mobile/ui/loaders';
import { Pagination } from '@/components/mobile/ui/paginations';
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
		label: `${count}`,
	}));

	const handleSearch = (event: React.FormEvent) => {
		event.preventDefault();
		load();
	};

	const renderContent = useMemo(() => {
		if (loading) {
			return (
				<div className={styles.loader}>
					<BlockLoader />
				</div>
			);
		}

		if (!keywordTitle || !technicalInformationResponse) {
			return null;
		}

		return (
			<>
				<SectionHeading>
					{t('mobile.pages.techView.technicalInformation.heading')}
				</SectionHeading>
				{technicalInformationList.length ? (
					<>
						<div className={styles.control}>
							<span className={styles.totalCountLabel}>
								{t('mobile.pages.techView.technicalInformation.totalCount', {
									count: totalCount,
								})}
							</span>
							<div>
								<Select
									value={`${pageSize}`}
									items={options}
									onChange={option => onChangePageSize(Number(option.value))}
								/>
							</div>
						</div>
						<ul className={styles.itemList}>
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
						{t('mobile.pages.techView.technicalInformation.notice')}
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
				{keywordTitle
					? t('mobile.pages.techView.technicalInformation.title', {
							keyword: keywordTitle,
					  })
					: t('mobile.pages.techView.technicalInformation.guide')}
			</h1>
			<div>
				<div className={styles.formWrapper}>
					<form onSubmit={handleSearch} className={styles.form}>
						<input
							className={styles.input}
							value={keyword}
							onChange={onChangeKeyword}
						/>
						<button type="submit" className={styles.submitButton}>
							{t('mobile.pages.techView.technicalInformation.buttonSearch')}
						</button>
					</form>
				</div>
				{renderContent}
			</div>
		</>
	);
};

TechnicalInformation.displayName = 'TechnicalInformation';
