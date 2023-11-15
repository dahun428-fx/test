import classNames from 'classnames';
import React from 'react';
import styles from './MessageToast.module.scss';
import { Anchor } from '@/components/pc/ui/links';
import { Toast } from '@/components/pc/ui/toasts';
import { useMessageToast } from '@/components/pc/ui/toasts/MessageToast';

// TODO: part number のスペルミス修正、other 要らないのでそもそもラインナップ整理、小文字で定義、export 削除、、、etc
export const Themes = ['MAIL', 'PARTNUMER_COMPLETE', 'OTHER'] as const;
export type Theme = typeof Themes[number];

export type Props = {
	/** 表示するか */
	shows: boolean;
	/** メッセージ */
	message?: string;
	/** メッセージリンク先URL */
	href?: string;
	/** アイコン */
	icon?: 'mail';
	/** message theme for rendering different html layout  */
	messageTheme?: Theme;
	/** delay time (in milisecond) before hiding toast message */
	delayTime?: number;
	/** delay time (in milliseconds) before shows toast message */
	showMessageDelayTime?: number;
	/** class name */
	className?: string;
};

/**
 * Message toast
 */
export const MessageToast: React.VFC<Props> = ({
	shows,
	message,
	href,
	icon,
	messageTheme = 'MAIL',
	className,
}) => {
	const { hideMessageToast } = useMessageToast();

	const handleHide = () => {
		hideMessageToast();
	};

	return (
		<Toast shows={shows} className={className}>
			{/** theme toast for new message arrived */}
			{messageTheme == 'MAIL' && href && (
				<Anchor href={href} className={styles.toast}>
					<div
						className={classNames(styles.message, {
							[String(styles.mail)]: icon === 'mail',
						})}
					>
						{message}
					</div>
				</Anchor>
			)}

			{/** theme toast for partnumber completed OR other */}
			{(messageTheme == 'PARTNUMER_COMPLETE' || messageTheme == 'OTHER') && (
				<div className={classNames(styles.codeMessageBox, styles.completed)}>
					{message}

					<div>
						<div className={styles.btnCloseMessageToast} onClick={handleHide}>
							<span className={styles.iconClose}></span>
						</div>
					</div>
				</div>
			)}
		</Toast>
	);
};
MessageToast.displayName = 'MessageToast';
