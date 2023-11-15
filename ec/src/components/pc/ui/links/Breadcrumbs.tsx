import React, { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { UrlObject } from 'url';
import styles from './Breadcrumbs.module.scss';
import { Link } from '@/components/pc/ui/links';
import { BreadcrumbsLinkedData } from '@/components/shared/seo/BreadcrumbsLinkedData';
import { pagesPath } from '@/utils/$path';

export type Breadcrumb = {
	/** 表示テキスト */
	text: string;
	/** href 属性に埋め込まれる文字列 */
	href?: string | UrlObject;
	/** リンクの target, 例：_blank */
	target?: `_blank` | `_self`;
	/** 強調表示（テキスト表示の場合のみ） */
	strong?: boolean;
};

/** props 定義 */
export type Props = {
	breadcrumbList: Breadcrumb[];
	displayMode?: 'text' | 'html';
};

/**
 * Breadcrumbs コンポーネント
 */
export const Breadcrumbs: VFC<Props> = ({
	breadcrumbList,
	displayMode = 'text',
}) => {
	const { t } = useTranslation();
	//===========================================================================
	return (
		<>
			<ul className={styles.breadcrumbList}>
				<li className={styles.breadcrumb}>
					<Link href={pagesPath.$url()}>
						{t('components.ui.links.breadcrumbs.home')}
					</Link>
				</li>
				{breadcrumbList.map((breadcrumb, key) => (
					<li
						className={styles.breadcrumb}
						key={key}
						data-strong={breadcrumb.strong}
					>
						{breadcrumb.href ? (
							// hrefの指定がある場合はリンク
							<Link
								href={breadcrumb.href}
								{...(displayMode === 'text'
									? { children: breadcrumb.text }
									: {
											dangerouslySetInnerHTML: { __html: breadcrumb.text },
									  })}
							/>
						) : (
							// hrefの指定がない場合はテキスト（パンくず最後の項目）
							<span
								{...(displayMode === 'text'
									? { children: breadcrumb.text }
									: {
											dangerouslySetInnerHTML: { __html: breadcrumb.text },
									  })}
							/>
						)}
					</li>
				))}
			</ul>
			<BreadcrumbsLinkedData breadcrumbList={breadcrumbList} />
		</>
	);
};
