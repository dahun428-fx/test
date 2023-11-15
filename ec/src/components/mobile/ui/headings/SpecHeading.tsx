import styles from './SpecHeading.module.scss';

/** セクションの heading */
export const SpecHeading: React.FC = props => (
	<div className={styles.wrapper}>
		<div className={styles.heading} {...props} />
	</div>
);
SpecHeading.displayName = 'SpecHeading';
