import { useTranslation } from 'react-i18next';
import styles from './TechSupport.module.scss';
import { SectionHeading } from '@/components/mobile/ui/headings/SectionHeading';
import { Link } from '@/components/mobile/ui/links/Link';
import { Contact } from '@/models/api/msm/ect/series/shared';
import { url } from '@/utils/url';

type Props = {
	contact: Contact;
	seriesCode: string;
};

/**
 * 技術サポート
 * - 電話・FAXによる連絡先・受付時間
 * - お問い合わせフォームへのリンク
 * - NOTE:  電話FAXによる問い合わせの表示は、とりあえず現行通りなので今の状態でも問題はないのですが、機能的に考えれば、・問い合わせ先名称 ・電話番号/FAX番号の少なくともどちらか ・受付時間（これはどちらとも取れる。いつでも連絡していいよの場合もあるかもしれない）全てが揃っていないと不自然
 */
export const TechSupport: React.VFC<Props> = ({ contact, seriesCode }) => {
	const existReception = contact.tel || contact.fax;

	const [t] = useTranslation();

	/** ポップアップURL */
	const contactUrl = url.contactDetail(seriesCode);

	return (
		<div>
			<SectionHeading>
				{t(
					'mobile.pages.productDetail.relatedToProductContents.techSupport.title'
				)}
			</SectionHeading>
			<dl className={styles.techSupportContentWrapper}>
				{contact.contactName && <dt>{contact.contactName}</dt>}
				<dd>
					{existReception && (
						<p>
							{contact.tel &&
								t(
									'mobile.pages.productDetail.relatedToProductContents.techSupport.tel',
									{
										tel: contact.tel,
									}
								)}
							{/* {contact.tel && contact.fax && ' / '}
							{contact.fax &&
								t(
									'mobile.pages.productDetail.relatedToProductContents.techSupport.fax',
									{
										fax: contact.fax,
									}
								)} */}
						</p>
					)}
					{contact.receptionTime && (
						<p
							dangerouslySetInnerHTML={{ __html: `${contact.receptionTime}` }}
						/>
					)}
					<p>
						<Link
							href={contactUrl}
							className={styles.techSupportListLink}
							target="_blank"
						>
							{t(
								'mobile.pages.productDetail.relatedToProductContents.techSupport.TechnicalInquiry'
							)}
						</Link>
					</p>
				</dd>
			</dl>
		</div>
	);
};
TechSupport.displayName = 'TechSupport';
