import NextLink from 'next/link';
import styles from './SuggestionGroup.module.scss';
import { Suggestion } from '@/components/mobile/layouts/headers/SearchBox/type';

type Props = {
	title: string;
	suggestions: Suggestion[];
	showsLoading?: boolean;
};

/** SuggestionGroup component */
export const SuggestionGroup: React.VFC<Props> = ({
	title,
	suggestions,
	showsLoading = false,
}) => {
	const renderContent = () => {
		if (showsLoading) {
			return <div className={styles.loading} />;
		}

		return (
			<ul className={styles.listWrapper}>
				{suggestions.map((suggestion, index) => (
					<li onClick={suggestion.onClick} key={`${suggestion.label}-${index}`}>
						{suggestion.href ? (
							<NextLink href={suggestion.href}>
								<a className={styles.linkItem}>{suggestion.label}</a>
							</NextLink>
						) : (
							<span className={styles.linkItem}>{suggestion.label}</span>
						)}
					</li>
				))}
			</ul>
		);
	};

	return (
		<dl className={styles.container}>
			<dt className={styles.title}>{title}</dt>
			<dd>{renderContent()}</dd>
		</dl>
	);
};

SuggestionGroup.displayName = 'SuggestionGroup';
