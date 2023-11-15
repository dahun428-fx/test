import React, { useMemo, VFC } from 'react';
import styles from './AttentionMessageGroup.module.scss';
import {
	Icon,
	TextColor,
	AttentionMessageItem,
} from '@/components/pc/pages/Home/AttentionMessage/AttentionMessageItem';
import {
	MaintenanceMessage,
	MessageLevel,
	MessageType,
} from '@/models/api/cms/home/GetAttentionsResponse';

type Props = {
	messageType: MessageType;
	messageList: MaintenanceMessage[];
};

type MessageInfo = {
	theme: Theme;
	messageInfo: Partial<
		Record<MessageLevel, { icon: Icon; textColor: TextColor }>
	>;
};

const Themes = ['warning', 'caution', 'notice', 'info'] as const;
type Theme = typeof Themes[number];

type MessageInfoMap = Record<MessageType, MessageInfo>;

const messageInfoMap: MessageInfoMap = {
	[MessageType.Warning]: {
		theme: 'warning',
		messageInfo: {
			[MessageLevel.Level1]: { icon: 'warning', textColor: 'red' },
			[MessageLevel.Level2]: {
				icon: 'warning',
				textColor: 'black',
			},
		},
	},
	[MessageType.Caution]: {
		theme: 'caution',
		messageInfo: {
			[MessageLevel.Level1]: {
				icon: 'none',
				textColor: 'black',
			},
		},
	},
	[MessageType.Notice]: {
		theme: 'notice',
		messageInfo: {
			[MessageLevel.Level1]: {
				icon: 'warning',
				textColor: 'red',
			},
			[MessageLevel.Level2]: {
				icon: 'warning',
				textColor: 'black',
			},
			[MessageLevel.Level3]: {
				icon: 'red-dot',
				textColor: 'red',
			},
			[MessageLevel.Level4]: {
				icon: 'red-dot',
				textColor: 'black',
			},
		},
	},
	[MessageType.Info]: {
		theme: 'info',
		messageInfo: {
			[MessageLevel.Level1]: {
				icon: 'info',
				textColor: 'black',
			},
			[MessageLevel.Level2]: {
				icon: 'blue-dot',
				textColor: 'black',
			},
		},
	},
} as const;

/**
 * Get message icon, text color from mapping data
 * @param messageType {MessageType}
 * @param messageLevel {MessageLevel}
 * @param messageCount {number}
 * @returns
 */
const getMessageInfo = (
	messageType: MessageType,
	messageLevel: MessageLevel,
	messageCount: number
): { icon: Icon; textColor: TextColor } => {
	const messageInfo = messageInfoMap[messageType]?.messageInfo[messageLevel];

	if (!messageInfo) {
		return { icon: 'none', textColor: 'black' };
	}

	if (messageCount <= 1) {
		let isNoIcon = false;

		if (
			messageType === MessageType.Notice &&
			(messageLevel === MessageLevel.Level3 ||
				messageLevel === MessageLevel.Level4)
		) {
			isNoIcon = true;
		}

		if (
			messageType === MessageType.Info &&
			messageLevel === MessageLevel.Level2
		) {
			isNoIcon = true;
		}

		return { ...messageInfo, icon: isNoIcon ? 'none' : messageInfo.icon };
	}

	return messageInfo;
};

/** Attention message group component */
export const AttentionMessageGroup: VFC<Props> = ({
	messageType,
	messageList,
}) => {
	const theme = useMemo(() => {
		return messageInfoMap[messageType].theme;
	}, [messageType]);

	return (
		<ul data-theme={theme} className={styles.attention}>
			{messageList.map((message, index) => {
				const messageInfo = getMessageInfo(
					message.messageType,
					message.messageLevel,
					messageList.length
				);

				return (
					<AttentionMessageItem
						key={`${message.messageType}-${index}`}
						attentionMessage={message}
						icon={messageInfo.icon}
						textColor={messageInfo.textColor}
					/>
				);
			})}
		</ul>
	);
};

AttentionMessageGroup.displayName = 'AttentionMessageGroup';
