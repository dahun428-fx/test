import React, { useMemo, VFC } from 'react';
import styles from './AttentionMessage.module.scss';
import { AttentionMessageGroup } from './AttentionMessageGroup';
import {
	MessageType,
	MaintenanceMessage,
} from '@/models/api/cms/home/GetAttentionsResponse';

const messageTypeList: MessageType[] = [
	MessageType.Warning,
	MessageType.Caution,
	MessageType.Notice,
	MessageType.Info,
];

type Props = {
	maintenanceMessageList: MaintenanceMessage[];
};

/** Attention message component */
export const AttentionMessage: VFC<Props> = ({ maintenanceMessageList }) => {
	const attentions = useMemo(() => {
		if (!maintenanceMessageList?.length) {
			return {};
		}
		const initialValue: Partial<Record<MessageType, MaintenanceMessage[]>> = {};

		return maintenanceMessageList.reduce<
			Partial<Record<MessageType, MaintenanceMessage[]>>
		>((result, message) => {
			if (!result[message.messageType]) {
				result[message.messageType] = [];
			}

			// NOTE: The logic is based on the TH site. The attention information only shows the first message.
			if (
				message.messageType === MessageType.Info &&
				result[message.messageType]?.length
			) {
				return result;
			}

			result[message.messageType]?.push(message);
			return result;
		}, initialValue);
	}, [maintenanceMessageList]);

	if (!Object.entries(attentions).length) {
		return null;
	}

	return (
		<div className={styles.container}>
			{messageTypeList.map(messageType => {
				const messageList = attentions[messageType];

				if (!messageList) {
					return null;
				}

				return (
					<AttentionMessageGroup
						key={messageType}
						{...{ messageType, messageList }}
					/>
				);
			})}
		</div>
	);
};

AttentionMessage.displayName = 'AttentionMessage';
