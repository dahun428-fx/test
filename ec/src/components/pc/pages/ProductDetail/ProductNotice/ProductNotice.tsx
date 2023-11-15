import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useProductNotice } from './ProductNotice.hooks';
import styles from './ProductNotice.module.scss';
import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';
import { Link } from '@/components/pc/ui/links';
import { InformationMessage } from '@/components/pc/ui/messages/InformationMessage';
import { Flag } from '@/models/api/Flag';
import { url } from '@/utils/url';

type Props = {
	showsPartNumberNoticeText?: boolean;
};

export const ProductNotice: React.VFC<Props> = ({
	showsPartNumberNoticeText = true,
}) => {
	const [t] = useTranslation();

	const { digitalBookList, seriesNoticeText, completedPartNumber, seriesName } =
		useProductNotice();

	const digitalCatalogUrl = useMemo(() => {
		const book = digitalBookList?.[0];
		if (!book) {
			return null;
		}
		return url.digitalBook2PageView(book);
	}, [digitalBookList]);

	const isSimpleProduct = Flag.isTrue(completedPartNumber?.simpleFlag);

	const ableToShowPartNumberNoticeText = !!(
		showsPartNumberNoticeText &&
		completedPartNumber?.partNumber &&
		isSimpleProduct
	);

	return (
		<div className={styles.container}>
			<ul>
				{/* 注意喚起文 */}
				{seriesNoticeText && (
					<li className={styles.listItem}>
						<LegacyStyledHtml
							html={seriesNoticeText}
							className={styles.seriesNotice}
							childHtmlTag="span"
						/>
					</li>
				)}
				{/* 注意喚起文（固定） */}
				{digitalCatalogUrl ? (
					<li>
						<InformationMessage>
							<Trans i18nKey="pages.productDetail.productNotice.fixedNoticeLinkText">
								<Link href={digitalCatalogUrl} />
							</Trans>
						</InformationMessage>
					</li>
				) : (
					<li>
						<InformationMessage>
							{t('pages.productDetail.productNotice.fixedNoticeText')}
						</InformationMessage>
					</li>
				)}
			</ul>
			{ableToShowPartNumberNoticeText && (
				<div>
					<Trans
						i18nKey="pages.productDetail.productNotice.partNumberNoticeText"
						values={{
							partNumber: completedPartNumber.partNumber,
						}}
					>
						<span dangerouslySetInnerHTML={{ __html: seriesName }} />
					</Trans>
				</div>
			)}
		</div>
	);
};
ProductNotice.displayName = 'ProductNotice';
