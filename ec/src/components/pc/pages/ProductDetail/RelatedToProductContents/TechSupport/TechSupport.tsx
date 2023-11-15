import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TechSupport.module.scss';
import { SectionHeading } from '@/components/pc/ui/headings/SectionHeading';
import { Link } from '@/components/pc/ui/links/Link';
import { Contact } from '@/models/api/msm/ect/series/shared';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

type Props = {
	seriesCode: string;
	contact: Contact;
};

/**
 * 技術サポート
 * - 電話・FAXによる連絡先・受付時間
 * - お問い合わせフォームへのリンク
 * - NOTE:  電話FAXによる問い合わせの表示は、とりあえず現行通りなので今の状態でも問題はないのですが、機能的に考えれば、・問い合わせ先名称 ・電話番号/FAX番号の少なくともどちらか ・受付時間（これはどちらとも取れる。いつでも連絡していいよの場合もあるかもしれない）全てが揃っていないと不自然
 */
export const TechSupport: React.VFC<Props> = ({ seriesCode, contact }) => {
	const existReception = contact.tel || contact.fax;

	const [t] = useTranslation();

	/** ポップアップURL */
	const contactUrl = url.contactDetail(seriesCode);

	/** ポップアップウィンドウハンドラ */
	const handleClickContact = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		e.preventDefault();
		openSubWindow(contactUrl, 'Contact', {
			width: 920,
			height: 703,
		});
	};

	return (
		<div>
			<SectionHeading>
				{t('pages.productDetail.techSupport.title')}
			</SectionHeading>
			<dl className={styles.techSupportContentWrap}>
				<dt>
					<strong>{contact.contactName}</strong>
				</dt>
				<dd className={styles.techSupportListWrap}>
					<p>{t('pages.productDetail.techSupport.description')}</p>
					<p className={styles.boxUpperMargin}>
						<Link
							href={contactUrl}
							onClick={handleClickContact}
							className={styles.techSupportListLink}
						>
							{t('pages.productDetail.techSupport.TechnicalInquiry')}
						</Link>
					</p>
					{existReception && (
						<p className={styles.boxUpperMargin}>
							{contact.tel &&
								t('pages.productDetail.techSupport.tel', { tel: contact.tel })}
							{/* {contact.tel && contact.fax && ' / '}
							{contact.fax &&
								t('pages.productDetail.techSupport.fax', { fax: contact.fax })} */}
						</p>
					)}
					{contact.receptionTime && (
						<p
							dangerouslySetInnerHTML={{ __html: `${contact.receptionTime}` }}
						/>
					)}
				</dd>
			</dl>
		</div>
	);
};
TechSupport.displayName = `TechSupport`;
