import classNames from 'classnames';
import NextLink from 'next/link';
import styles from './FooterLink.module.scss';
import { Anchor } from '@/components/pc/ui/links';

export type Props = {
	/**
	 * リンクURL
	 * - アプリ内遷移が発生したら UrlObject も受けられるようにする必要があります。
	 */
	href: string;
	/** 新規タブで開く */
	newTab?: boolean;
	/** 外部リンクかどうか */
	isAnchor?: boolean;
};

/**
 * Footer link
 * - フッター以外で使われているところが不明なためここで定義しています。
 *   (特に右端に寄せたアイコンと空白部分もクリックできるところ)
 */
export const FooterLink: React.FC<Props> = ({
	href,
	newTab,
	isAnchor = true,
	children,
}) => {
	if (isAnchor) {
		return (
			<Anchor
				href={href}
				className={classNames(
					styles.anchor,
					newTab ? styles.newTab : styles.rightArrow
				)}
				target={newTab ? '_blank' : undefined}
				theme="tertiary"
			>
				{children}
			</Anchor>
		);
	}

	return (
		<NextLink href={href}>
			<a
				className={classNames(
					styles.link,
					newTab ? styles.newTab : styles.rightArrow
				)}
				target={newTab ? '_blank' : undefined}
			>
				{children}
			</a>
		</NextLink>
	);
};

FooterLink.displayName = 'FooterLink';
