import Router from 'next/router';
import { Logger as DatadogLogger } from '@/logs/datadog';

type Logger = () => void;

export class EventManager {
	/** Event logger queue */
	private static queue: Logger[] = [];

	/**
	 * Is the event ready to send?
	 * - Sent PV?
	 */
	private static isReady = false;

	/**
	 * Is reserved calling unready on before change history.
	 */
	private static reservedUnready = false;

	static ready() {
		this.isReady = true;

		if (!this.reservedUnready) {
			Router.events.on('beforeHistoryChange', this.unready);
			this.reservedUnready = true;
		}

		if (this.queue.length) {
			this.digest();
		}
	}

	static submit(logger: Logger) {
		if (!this.isReady || this.queue.length) {
			this.enqueue(logger);
		} else {
			logger();
		}
	}

	private static unready() {
		// NOTE: Needs not use "this" keyword, because will call by Router event.
		EventManager.isReady = false;
		if (EventManager.queue.length) {
			DatadogLogger.warn('The queue was jammed.');
			EventManager.digest();
		}
	}

	private static digest() {
		const logger = this.dequeue();
		logger?.();
		if (this.queue.length) {
			this.digest();
		}
	}

	private static enqueue(logger: Logger) {
		this.queue.push(logger);
	}

	private static dequeue() {
		return this.queue.shift();
	}
}
