import styles from './ChatPlus.module.scss';
import { pagesPath } from '@/utils/$path';
import { convertToURLString } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

/**
 * ChatPlus
 */
export const ChatPlus: React.FC = () => {
	/** popUp window handler */
	const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		e.preventDefault();
		openSubWindow(
			convertToURLString(
				pagesPath.vona2.chat.$url({
					query: { referrer: 'ec', site: '1', pagereferrer: location.href },
				})
			),
			'chat',
			{ width: 445, height: 650 }
		);
	};

	return (
		<div className={styles.chatplus}>
			<a
				href="#"
				onClick={handleClick}
				className={styles.link}
				aria-label="ChatPlus"
			/>
		</div>
	);
};
ChatPlus.displayName = 'ChatPlus';
