//=============================================================================
// 「アプリで Toast は同時に 1 つしか表示されない」という前提に基づいて作られています。
// (そんなの Toast として許されないとは思いつつ。)
// この前提が変わる時は修正が必要です。
//=============================================================================
import React, {
	createContext,
	useCallback,
	useContext,
	useReducer,
} from 'react';
import { MessageToast, Props } from './MessageToast';
import { useTimer } from '@/utils/timer';

//=============================================================================
// constants

/**
 * 表示されてから消えるまでのミリ秒
 * (画面表示されてから2秒後に表示を開始し、14秒表示して消える)
 */
const DELAY_TO_HIDE = 14000;

const DELAY_TO_SHOW = 0;

//=============================================================================
// types

type MessageResource = Omit<Props, 'shows'>;

type MessageToastContext =
	| { shows: false; resource?: MessageResource }
	| { shows: true; resource: MessageResource };

type MessageDispatchContext = {
	showMessageToast: (resource: MessageResource) => void;
	hideMessageToast: () => void;
};

type MessageToastAction =
	| {
			type: 'SHOW';
			context: Required<Omit<MessageToastContext, 'shows'>>;
	  }
	| {
			type: 'HIDE';
	  };

//=============================================================================
// context

const MessageToastContext = createContext<MessageToastContext>({
	shows: false,
});

const MessageDispatchContext = createContext<MessageDispatchContext>({
	showMessageToast: () => {
		// noop
	},
	hideMessageToast: () => {
		// noop
	},
});

//=============================================================================
// provider

/** Reducer for message toast provider */
function reducer(
	state: MessageToastContext,
	action: MessageToastAction
): MessageToastContext {
	switch (action.type) {
		case 'SHOW':
			return { ...action.context, shows: true };
		case 'HIDE':
			return { ...state, shows: false };
	}
}

/**
 * Message toast provider
 */
export const MessageToastProvider: React.FC = ({ children }) => {
	const [context, dispatch] = useReducer(reducer, { shows: false });
	const { debounce: debounceShow } = useTimer();
	const { debounce: debounceHide } = useTimer();

	const showMessageToast = useCallback(
		(resource: MessageResource) => {
			const delayToHide = resource.delayTime ?? DELAY_TO_HIDE;
			const delayToShow = resource.showMessageDelayTime ?? DELAY_TO_SHOW;

			debounceShow(() => {
				dispatch({
					type: 'SHOW',
					context: { resource },
				});
			}, delayToShow);

			debounceHide(() => {
				dispatch({ type: 'HIDE' });
			}, delayToHide);
		},
		[debounceHide, debounceShow]
	);

	const hideMessageToast = useCallback(() => {
		dispatch({ type: 'HIDE' });
	}, []);

	return (
		<MessageToastContext.Provider value={context}>
			<MessageDispatchContext.Provider
				value={{ showMessageToast, hideMessageToast }}
			>
				{children}
			</MessageDispatchContext.Provider>
		</MessageToastContext.Provider>
	);
};
MessageToastContext.displayName = 'MessageToastContext';

//=============================================================================
// controller

export const MessageToastController: React.VFC = () => {
	const { shows, resource } = useContext(MessageToastContext);
	return <MessageToast {...{ shows, ...resource }} />;
};
MessageToastController.displayName = 'MessageToastController';

//=============================================================================
// hooks

/** Message toast hook */
export const useMessageToast = () => ({
	...useContext(MessageDispatchContext),
});
