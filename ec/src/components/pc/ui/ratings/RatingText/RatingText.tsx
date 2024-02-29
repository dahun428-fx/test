import classNames from 'classnames';
import React, { AnchorHTMLAttributes, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RatingText.module.scss';
import { Anchor } from '@/components/pc/ui/links';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
	href: string;
	rate?: number;
	displayType?: 'block' | 'inline';
};

/** Rating text component */
export const RatingText: VFC<Props> = ({
	href,
	rate,
	displayType = 'inline',
}) => {
	const [t] = useTranslation();

	if (!rate) {
		return null;
	}

	return (
		<Anchor
			href={href}
			className={classNames(styles.link, {
				[String(styles.block)]: displayType === 'block',
			})}
			target="_blank"
			rel="noreferrer"
		>
			{t('components.ui.ratings.ratingText.averageSatisfaction', {
				rate: rate > 5 ? '5.0' : rate.toFixed(1),
			})}
		</Anchor>
	);
};
RatingText.displayName = 'RatingText';
