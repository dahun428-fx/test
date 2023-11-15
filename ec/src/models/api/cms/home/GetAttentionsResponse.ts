import { ApiResponse } from '@/models/api/ApiResponse';

/**
 * Get attentions response
 */
export interface GetAttentionsResponse extends ApiResponse {
	/** Maintenance message list */
	maintenanceMessageList: MaintenanceMessage[];
}

export const MessageType = {
	Warning: '1',
	Caution: '2',
	Notice: '3',
	Info: '4',
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];

export const MessageLevel = {
	Level1: '1',
	Level2: '2',
	Level3: '3',
	Level4: '4',
} as const;

export type MessageLevel = typeof MessageLevel[keyof typeof MessageLevel];

type WarningMessage = {
	messageType: '1';
	messageLevel: '1' | '2';
	message: string;
};

type CautionMessage = {
	messageType: '2';
	messageLevel: '1';
	message: string;
};

type NoticeMessage = {
	messageType: '3';
	messageLevel: '1' | '2' | '3' | '4';
	message: string;
};

type InfoMessage = {
	messageType: '4';
	messageLevel: '1' | '2';
	message: string;
};

export type MaintenanceMessage =
	| WarningMessage
	| CautionMessage
	| NoticeMessage
	| InfoMessage;
