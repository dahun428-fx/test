import { Anchor } from '@/components/pc/ui/links';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import styles from './SocialShare.module.scss';
import { useSocialShare } from './SocialShare.hooks';

type Props = {
	series: Series;
};

export const SocialShare: React.VFC<Props> = ({ series }) => {
	const {
		ogDesc,
		ogSitename,
		ogTitle,
		ogType,
		ogUrl,
		twitterDesc,
		twitterTitle,
		twitterUrl,
		productImageUrl,
		shareFacebook,
		shareTwitter,
	} = useSocialShare(series);

	const [t] = useTranslation();

	return (
		<div>
			<Head>
				<meta property="fb:app_id" content="864488337234574" />
				<meta property="og:title" id="og_title" content={ogTitle} />
				<meta property="og:type" content={ogType} />
				<meta property="og:site_name" content={ogSitename} />
				<meta property="og:description" id="og_description" content={ogDesc} />
				<meta property="og:url" id="og_url" content={ogUrl} />
				<meta property="og:image" id="og_image" content={productImageUrl} />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:url" id="twit_url" content={twitterUrl} />
				<meta name="twitter:title" id="twit_title" content={twitterTitle} />
				<meta name="twitter:image" content={productImageUrl} />
				<meta
					name="twitter:description"
					id="twit_description"
					content={twitterDesc}
				/>
			</Head>
			<div className={styles.snsBox}>
				<Anchor
					href={ogUrl}
					onClick={e => shareFacebook(e)}
					className={styles.snsBtnfb}
				>
					{t('pages.productDetail.socialShare.name.fb')}
				</Anchor>

				<Anchor
					href={twitterUrl}
					onClick={e => shareTwitter(e)}
					className={styles.snsBtntw}
				>
					{t('pages.productDetail.socialShare.name.tw')}
				</Anchor>

				<Anchor
					href={ogUrl}
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();
					}}
					className={styles.snsBtnkt}
					id="kakao-link-btn"
				>
					{t('pages.productDetail.socialShare.name.kt')}
				</Anchor>
			</div>
		</div>
	);
};

SocialShare.displayName = 'SocialShare';
