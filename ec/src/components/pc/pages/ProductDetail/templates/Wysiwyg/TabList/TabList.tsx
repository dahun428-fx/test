import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TabList.module.scss';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';

type Props = {
	digitalBookPdfUrl: string;
	technicalInfoUrl?: string;
	className?: string;
	onChange: (value: string) => void;
};

export const TabList: React.VFC<Props> = ({
	digitalBookPdfUrl,
	technicalInfoUrl,
	className,
	onChange,
}) => {
	const { t } = useTranslation();
	const { translateTab } = useTabTranslation();

	const handleClick = (value: string) => {
		onChange(value);
	};

	return (
		<div className={className}>
			<p className={styles.priceNotice}>
				{t('pages.productDetail.wysiwyg.tabList.guideQuote')}
			</p>
			<ul className={styles.tabs}>
				<li>
					<a
						className={styles.productTabLink}
						onClick={() => handleClick('pdf')}
					>
						{translateTab('pdf')}
					</a>
				</li>
				{technicalInfoUrl && (
					<li>
						<a
							className={styles.technicalTabLink}
							href={technicalInfoUrl}
							target="_blank"
							rel="noreferrer"
							onClick={() => handleClick('technicalInformation')}
						>
							{translateTab('technicalInformation')}
						</a>
					</li>
				)}
			</ul>
			<div className={styles.contents}>
				<p className={styles.pdfNotice}>
					{t('pages.productDetail.wysiwyg.tabList.pdfNotice')}
					<a
						className={styles.adobeLink}
						href="https://www.adobe.com/products/acrobat/readstep2.html"
						target="_blank"
						aria-label="Get Adobe Reader"
						rel="noreferrer"
					/>
				</p>
				<object
					classID="clsid:CA8A9780-280D-11CF-A24D-444553540000"
					// for IE
					width="100%"
					height="800"
				>
					<param name="src" value={digitalBookPdfUrl} />
					<param name="wmode" value="transparent" />
					<embed width="100%" height="800" src={digitalBookPdfUrl} />
				</object>
			</div>
		</div>
	);
};
TabList.displayName = 'TabList';
