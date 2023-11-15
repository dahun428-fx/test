import { useEffect } from 'react';

type Listener<E extends Event> = (event: E) => void;
type EventType = keyof WindowEventMap;

/**
 * イベント登録のユーティリティ
 *
 * WARNING: 利用する際は listener に変更があるたびにイベント登録解除されるため、
 *          useCallback するなどして、listener の更新は必要なタイミングのみ
 *          行われるようにしてください。
 *
 * @param {K} eventName イベント名
 * @param {Listener<WindowEventMap[K]>} listener リスナ
 * @template K
 */
const useEventListener = <K extends EventType>(
	eventName: K,
	listener: Listener<WindowEventMap[K]>
	// target: Window = window こんな感じで任意の HTMLElement や document も指定できるとよさそう。
): void => {
	useEffect(() => {
		window.addEventListener(eventName, listener);
		return () => window.removeEventListener(eventName, listener);
	}, [listener, eventName]);
};

export default useEventListener;
