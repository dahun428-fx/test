import { HandlerType } from '@datadog/browser-logs';

export const getHandler = () =>
	process.env.NEXT_PUBLIC_SUPPRESS_DATADOG_API_LOGGER === 'true'
		? HandlerType.silent
		: process.env.NODE_ENV === 'production'
		? HandlerType.http
		: HandlerType.console;
