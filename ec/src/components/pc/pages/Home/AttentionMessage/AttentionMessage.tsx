import React, { useMemo, VFC } from 'react';
import styles from './AttentionMessage.module.scss';
import { AttentionMessageGroup } from './AttentionMessageGroup';
import {
	MaintenanceMessage,
	MessageType,
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
	// maintenanceMessageList を messageType 毎にまとめて仕分けるための処理
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
