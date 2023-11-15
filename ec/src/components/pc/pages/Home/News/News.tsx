import { useTranslation } from 'react-i18next';
import styles from './News.module.scss';
import { Anchor, Link } from '@/components/pc/ui/links';
import { NewsArticle } from '@/models/api/cms/home/GetNewsArticleResponse';
import { url } from '@/utils/url';

type Props = {
	newsArticleList: NewsArticle[];
};

export const News: React.VFC<Props> = ({ newsArticleList }) => {
	const [t] = useTranslation();

	if (!newsArticleList.length) {
		return null;
	}
	return (
		<div className={styles.area}>
			<div className={styles.titleContainer}>
				<div className={styles.title}>{t('pages.home.news.title')}</div>
				<div className={styles.readMore}>
					<Anchor href={url.news}>{t('pages.home.news.readMore')}</Anchor>
				</div>
			</div>
			<ul className={styles.content}>
				{newsArticleList?.map(article => (
					<li key={article.title} className={styles.article}>
						<dl>
							<dt className={styles.date}>{article.postedDate}</dt>
							<dd>
								<Link
									href={article.url}
									theme="secondary"
									newTab={article.targetBlankFlag === '1'}
									className={styles.articleLink}
								>
									{article.title}
								</Link>
							</dd>
						</dl>
					</li>
				))}
			</ul>
		</div>
	);
};
News.displayName = 'News';
