import React, { useMemo } from 'react';
import styles from './DivisionBannerBox.module.scss';
import commonStyles from '@/styles/pc/legacy/common.module.scss';
import classNames from 'classnames';
import { UnitLibrary as UnitLibraryItem } from '@/models/api/msm/ect/unitLibrary/SearchUnitLibraryResponse';
import { Banner } from '@/components/pc/pages/ProductDetail/Banner';
import { useTranslation } from 'react-i18next';
import { Anchor } from '@/components/pc/ui/links';
import { BannerType } from '@/utils/domain/banner';

type Props = {
	isRightBanner: boolean;
	seriesCode: string;
	unitLibraryList: UnitLibraryItem[];
	seriesHtmlReponse?: string;
	categoryHtmlReponse?: string;
	bnrBHtmlReponse?: string;
};

export const DivisionBannerBox: React.VFC<Props> = ({
	isRightBanner,
	seriesCode,
	unitLibraryList,
	seriesHtmlReponse,
	categoryHtmlReponse,
	bnrBHtmlReponse,
}) => {
	const [t] = useTranslation();

	const unitLibrary = useMemo(() => {
		let randomTargetList = unitLibraryList.filter(
			unitLibrary => unitLibrary.unitLibraryType === '2'
		);

		if (!randomTargetList.length) {
			randomTargetList = unitLibraryList;
		}

		const randomIndex = Math.floor(Math.random() * randomTargetList.length);
		return randomTargetList[randomIndex];
	}, [unitLibraryList]);

	if (
		!unitLibrary &&
		!seriesHtmlReponse &&
		!categoryHtmlReponse &&
		!bnrBHtmlReponse
	) {
		return null;
	}

	if (isRightBanner) {
		return (
			<div
				className={classNames(commonStyles.common, styles.rightBannerContainer)}
			>
				{unitLibrary && (
					<div className="m-divisionBanner">
						<Anchor
							className="m-divisionBanner__linkBox"
							href={unitLibrary.unitLibraryPageUrl}
							target="_blank"
						>
							<div className="m-divisionBanner__img">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={unitLibrary.unitLibraryImageUrl} alt="" />
							</div>
							<div className="m-divisionBanner__header">
								<p className="m-divisionBanner__title">
									{t('pages.productDetail.divisionBannerBox.heading')}
								</p>
								<p className={styles.read}>{unitLibrary.unitLibraryName}</p>
							</div>
						</Anchor>
					</div>
				)}
				<Banner bannerType={BannerType.S_BANNER_PATH} seriesCode={seriesCode} />
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div
				className={classNames(
					commonStyles.common,
					styles.divisionBannerBoxList
				)}
			>
				{unitLibrary && (
					<div className="m-divisionBanner">
						<Anchor
							className="m-divisionBanner__linkBox"
							href={unitLibrary.unitLibraryPageUrl}
							target="_blank"
						>
							<div className="m-divisionBanner__img">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={unitLibrary.unitLibraryImageUrl} alt="" />
							</div>
							<div className="m-divisionBanner__header">
								<p className="m-divisionBanner__title">
									{t('pages.productDetail.divisionBannerBox.heading')}
								</p>
								<p className={styles.read}>{unitLibrary.unitLibraryName}</p>
							</div>
						</Anchor>
					</div>
				)}
				{seriesHtmlReponse && (
					<div
						className={styles.content}
						dangerouslySetInnerHTML={{ __html: seriesHtmlReponse }}
					/>
				)}
				{categoryHtmlReponse && (
					<div
						className={styles.content}
						dangerouslySetInnerHTML={{ __html: categoryHtmlReponse }}
					/>
				)}
				{bnrBHtmlReponse && (
					<div
						className={styles.content}
						dangerouslySetInnerHTML={{ __html: bnrBHtmlReponse }}
					/>
				)}
			</div>
			<Banner bannerType={BannerType.S_BANNER_PATH} seriesCode={seriesCode} />
		</div>
	);
};

DivisionBannerBox.displayName = 'DivisionBannerBox';
