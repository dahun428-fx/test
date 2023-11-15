import { CadDownloadStack } from '@/models/localStorage/CadDownloadStack';

const errors = [
	'sinus-timeout',
	'sinus-not-found',
	'sinus-other-error',
] as const;
export type CadDownloadError = typeof errors[number];

/**
 * Cad Download State
 */
export type CadDownloadState = CadDownloadStack & {
	errors?: Record<string, CadDownloadError>;
};
