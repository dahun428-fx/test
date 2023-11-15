import React, { useMemo } from 'react';
import styles from './AttentionMessageItem.module.scss';
import { MaintenanceMessage } from '@/models/api/cms/home/GetAttentionsResponse';

const iconList = ['warning', 'info', 'red-dot', 'blue-dot', 'none'] as const;
export type Icon = typeof iconList[number];

const textColorList = ['black', 'red'] as const;
export type TextColor = typeof textColorList[number];

type Props = {
	icon: Icon;
	attentionMessage: MaintenanceMessage;
	textColor: TextColor;
};

/** Message item component */
export const AttentionMessageItem: React.VFC<Props> = ({
	attentionMessage,
	icon,
	textColor,
}) => {
	const content = useMemo(() => {
		return (
			<span dangerouslySetInnerHTML={{ __html: attentionMessage.message }} />
		);
	}, [attentionMessage.message]);

	return (
		<li
			className={styles.messageItem}
			data-icon={icon}
			data-text-color={textColor}
		>
			{content}
		</li>
	);
};

AttentionMessageItem.displayName = 'AttentionMessageItem';
