import { useTranslation } from 'react-i18next';
import styles from './NewsArea.module.scss';
import { Anchor, NagiLink } from '@/components/mobile/ui/links';
import { NewsArticle } from '@/models/api/cms/home/GetNewsArticleResponse';
import { url } from '@/utils/url';

type Props = {
	newsArticleList: NewsArticle[];
};

export const NewsArea: React.VFC<Props> = ({ newsArticleList }) => {
	const [t] = useTranslation();

	if (newsArticleList.length === 0) {
		return null;
	}

	return (
		<div className={styles.area}>
			<div className={styles.head}>
				<span className={styles.title}>
					{t('mobile.pages.home.newsArea.news')}
				</span>
				<span className={styles.readMore}>
					<Anchor href={url.news}>
						{t('mobile.pages.home.newsArea.readMore')}
					</Anchor>
				</span>
			</div>

			<ul className={styles.content}>
				{newsArticleList?.map((article, index) => (
					<li key={`${article.title}-${index}`} className={styles.article}>
						<dl>
							<dt className={styles.date}>{article.postedDate}</dt>
							<dd>
								<NagiLink
									href={article.url}
									theme="secondary"
									newTab={article.targetBlankFlag === '1'}
								>
									{article.title}
								</NagiLink>
							</dd>
						</dl>
					</li>
				))}
			</ul>
		</div>
	);
};
NewsArea.displayName = 'NewsArea';
