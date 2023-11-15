import styles from './SimpleHeader.module.scss';
import { SimpleLogo } from './SimpleLogo/SimpleLogo';

/**
 * simple layout header
 */
export const SimpleHeader: React.VFC = () => {
	return (
		<header className={styles.container}>
			<div className={styles.header}>
				<SimpleLogo />
			</div>
		</header>
	);
};
SimpleHeader.displayName = 'SimpleHeader';
