import NextLink from 'next/link';
import { VFC } from 'react';
import styles from './OrderQuoteLink.module.scss';

type Props = {
	label: string;
	url: string;
	disabled?: boolean;
};

/**
 * Order link
 */
export const OrderQuoteLink: VFC<Props> = ({
	label,
	url,
	disabled: isDisabled,
}) => {
	if (isDisabled) {
		return <span className={styles.disabledLink}>{label}</span>;
	}
	return (
		<NextLink href={url}>
			<a className={styles.link}>{label}</a>
		</NextLink>
	);
};

OrderQuoteLink.displayName = 'OrderQuoteLink';
