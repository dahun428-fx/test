import styles from './SectionHeading.module.scss';

type Props = {
	title: string;
};

/**
 * Section Heading component
 */
export const SectionHeading: React.VFC<Props> = ({ title }) => {
	return <h2 className={styles.title}>{title}</h2>;
};

SectionHeading.displayName = 'SectionHeading';
