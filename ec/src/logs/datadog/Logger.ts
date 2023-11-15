import {
	datadogLogs,
	Logger as DatadogLogger,
	StatusType,
} from '@datadog/browser-logs';
import { GlobalContext } from './types';
import { getHandler } from './utils';

/** private custom logger config */
type LoggerConfig<LC extends LocalContext> = {
	context?: LC;
	level?: StatusType;
};

/** private custom logger context */
type LocalContext = {
	// nothing
};

type MessageContext = {
	// nothing
};

export class Logger<LC extends LocalContext, MC extends MessageContext> {
	private logger: DatadogLogger;

	/**
	 * @param name logger name
	 * @param config logger config
	 */
	constructor(name: string, config?: LoggerConfig<LC>) {
		this.logger = datadogLogs.createLogger(name, {
			...config,
			handler: getHandler(),
		});
	}

	/** Merge GlobalContext and given context */
	private static mergeContext(
		context?: Record<string, unknown>
	): GlobalContext & Record<string, unknown> {
		return {
			...(datadogLogs.getLoggerGlobalContext() as GlobalContext),
			...context,
		};
	}

	static error(message: string, context?: MessageContext): void {
		datadogLogs.logger.error(message, this.mergeContext(context));
	}

	static warn(message: string, context?: MessageContext): void {
		datadogLogs.logger.warn(message, this.mergeContext(context));
	}

	static info(message: string, context?: MessageContext): void {
		datadogLogs.logger.info(message, this.mergeContext(context));
	}

	static debug(message: string, context?: MessageContext): void {
		datadogLogs.logger.debug(message, this.mergeContext(context));
	}

	error(message: string, context?: MC): void {
		this.logger.error(message, Logger.mergeContext(context));
	}

	warn(message: string, context?: MC): void {
		this.logger.warn(message, Logger.mergeContext(context));
	}

	info(message: string, context?: MC): void {
		this.logger.info(message, Logger.mergeContext(context));
	}

	debug(message: string, context?: MC): void {
		this.logger.debug(message, Logger.mergeContext(context));
	}
}
