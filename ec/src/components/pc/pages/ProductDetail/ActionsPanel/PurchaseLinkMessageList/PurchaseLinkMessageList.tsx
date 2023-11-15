import classNames from 'classnames';
import styles from './PurchaseLinkMessageList.module.scss';

type Message = {
	type: 'error' | 'warn';
	message: string;
};

type Props = {
	messageList: Message[];
};

/**
 * Error or warning message list for purchase link user
 */
export const PurchaseLinkMessageList: React.VFC<Props> = ({ messageList }) => {
	return (
		<ul>
			{messageList.map(message => (
				<li
					key={`${message.type}\n${message.message}`}
					className={classNames(styles.message, {
						[String(styles.error)]: message.type === 'error',
						[String(styles.warn)]: message.type === 'warn',
					})}
				>
					{message.message}
				</li>
			))}
		</ul>
	);
};
PurchaseLinkMessageList.displayName = 'PurchaseLinkMessageList';
