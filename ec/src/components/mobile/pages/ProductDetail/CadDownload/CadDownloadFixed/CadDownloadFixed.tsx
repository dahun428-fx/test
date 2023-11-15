import classNames from 'classnames';
import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CadDownloadFixed.module.scss';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { DynamicParams } from '@/models/domain/cad';

type Props = {
	cadData: DownloadCadResponse;
	brandCode?: string;
	cadDynamic: DynamicParams[] | null;
	partNumber: string;
};

/** NOTE: Add suffix https when external link */
const normalizedUrl = (url: string) => {
	const isExternal = url.startsWith('//');

	if (isExternal) {
		return `https:${url}`;
	}

	return url;
};

/** Cad download fixed */
export const CadDownloadFixed: VFC<Props> = ({
	cadData,
	cadDynamic,
	brandCode,
	partNumber,
}) => {
	const [t] = useTranslation();

	const handleClick = (fileName: string, cadType: '2D' | '3D') => {
		aa.events.sendDownloadFixedCad();
		ga.events.downloadCad.fixedCad();

		if (cadDynamic?.[0]) {
			ectLogger.cad.download(
				{
					dynamicCadModifiedCommon: cadDynamic[0].COMMON,
					cadFilename: fileName,
					cadType,
					cadFormat: '',
					cadSection: 'FIXCAD',
					partNumber,
				},
				t
			);
		}
	};

	return (
		<div>
			{cadData.fixed2DCadList.length || cadData.fixed3DCadList.length ? (
				<>
					{cadData.fixed2DCadList.length > 0 && (
						<>
							<h3
								className={classNames(styles.title, {
									[String(styles.noMargin)]: !cadData.cadSiteType,
								})}
							>
								{t(
									'mobile.pages.productDetail.cadDownload.cadDownloadFixed.cad2d.title'
								)}
							</h3>

							<ul className={styles.linkListWrapper}>
								{cadData.fixed2DCadList.map((item, index) => (
									<li className={styles.linkItem} key={index}>
										<a
											href={normalizedUrl(item.url)}
											onClick={() => handleClick(item.fileName, '2D')}
											className={styles.link}
										>
											{item.fileName}
										</a>
									</li>
								))}
							</ul>
							<p>
								{brandCode !== 'MSM1' && (
									<>
										{t(
											'mobile.pages.productDetail.cadDownload.cadDownloadFixed.first'
										)}
										<br />
									</>
								)}
								{t(
									'mobile.pages.productDetail.cadDownload.cadDownloadFixed.second'
								)}
								<br />
								{t(
									'mobile.pages.productDetail.cadDownload.cadDownloadFixed.third'
								)}
							</p>
						</>
					)}

					{cadData.fixed3DCadList.length > 0 && (
						<>
							<h3
								className={classNames(styles.title, {
									[String(styles.noMargin)]:
										!cadData.cadSiteType && !cadData.fixed2DCadList.length,
								})}
							>
								{t(
									'mobile.pages.productDetail.cadDownload.cadDownloadFixed.cad3d.title'
								)}
							</h3>
							<ul className={styles.linkListWrapper}>
								{cadData.fixed3DCadList.map((item, index) => (
									<li className={styles.linkItem} key={index}>
										<a
											href={normalizedUrl(item.url)}
											onClick={() => handleClick(item.fileName, '3D')}
											className={styles.link}
										>
											{item.fileName}
										</a>
									</li>
								))}
							</ul>
							<p>
								{brandCode !== 'MSM1' && (
									<>
										{t(
											'mobile.pages.productDetail.cadDownload.cadDownloadFixed.first'
										)}
										<br />
									</>
								)}
								{t(
									'mobile.pages.productDetail.cadDownload.cadDownloadFixed.second'
								)}
								<br />
								{t(
									'mobile.pages.productDetail.cadDownload.cadDownloadFixed.third'
								)}
							</p>
						</>
					)}
				</>
			) : (
				cadData.cadSiteType && (
					<>
						<h3 className={styles.title}>
							{t(
								'mobile.pages.productDetail.cadDownload.cadDownloadFixed.cad2d.title'
							)}
						</h3>
						<ul className={styles.alert}>
							<li>
								{t(
									'mobile.pages.productDetail.cadDownload.cadDownloadFixed.fourth'
								)}
							</li>
						</ul>
					</>
				)
			)}
		</div>
	);
};
CadDownloadFixed.displayName = 'CadDownloadFixed';
