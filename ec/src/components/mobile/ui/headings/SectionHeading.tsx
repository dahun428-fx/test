import styles from './SectionHeading.module.scss';

/** セクションの heading */
export const SectionHeading: React.FC = props => (
	<>
		<h2 className={styles.heading} {...props} />
	</>
);
SectionHeading.displayName = 'SectionHeading';
