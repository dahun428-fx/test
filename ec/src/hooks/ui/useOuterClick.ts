import { RefObject, useCallback } from 'react';
import useEventListener from '@/hooks/utils/useEventListener';

/**
 * 指定の要素外がクリックされた場合に、指定の処理を実行します。
 *
 * @param {RefObject<HTMLElement>} target 検証対象の要素群
 * @param {(event: MouseEvent) => void} callback 指定の要素外をクリックした場合に実行するコールバック
 */
const useOuterClick = (
	target: RefObject<HTMLElement> | RefObject<HTMLElement>[],
	callback: (event: MouseEvent) => void
): void => {
	const handleOuterClick = useCallback(
		(event: MouseEvent) => {
			if (
				Array.isArray(target)
					? target.some(ref => includesEventTarget(event, ref.current))
					: includesEventTarget(event, target.current)
			) {
				return;
			}
			callback(event);
		},
		[callback, target]
	);

	useEventListener('click', handleOuterClick);
};

/**
 * イベント発生ノードを子要素に持つ or 自身であるかを判定します。
 *
 * @param {MouseEvent} event クリックイベント
 * @param {HTMLElement} target クリックされたか検証したい要素
 * @returns event#target が target の子要素または自身であるか
 */
const includesEventTarget = (
	event: MouseEvent,
	target: HTMLElement | null
): boolean => {
	if (!target || !(event.target instanceof Node)) {
		return false;
	}

	// FIXME: target#contains で判定すると、EventTarget が既に消えている場合に
	//        外側がクリックされたと誤判定されてしまう可能性があります。
	//        Event#composedPath を利用すれば正しく判定できますが、IE, Edge で非対応のため、
	//        検討が必要です。 https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath
	return target.contains(event.target);
};

export default useOuterClick;
