import React, {
	createContext,
	ReactElement,
	useContext,
	useMemo,
	useReducer,
} from 'react';
import { MessageModal } from './MessageModal';
import { isObject } from '@/utils/object';

type ButtonNode = string | ReactElement;
type MessageNode = string | ReactElement;
type TitleNode = string | ReactElement;

/** message modal content resource */
type MessageResource =
	| MessageNode
	| {
			title?: TitleNode;
			message: MessageNode;
			button?: ButtonNode;
	  };

/** message modal context type */
type MessageModalContext =
	| {
			isOpen: false;
			resource?: MessageResource;
			onOk?: () => void;
	  }
	| {
			isOpen: true;
			resource: MessageResource;
			onOk: () => void;
	  };

/** message dispatch context type */
type MessageDispatchContext = {
	showMessage: (message: MessageResource) => Promise<void>;
	forceClose: () => void;
};

const MessageModalContext = createContext<MessageModalContext>({
	isOpen: false,
});
const MessageDispatchContext = createContext<MessageDispatchContext>({
	showMessage: async () => {
		// noop
	},
	forceClose: () => {
		// noop
	},
});

type MessageModalAction =
	| {
			type: 'OPEN';
			context: Required<Omit<MessageModalContext, 'isOpen'>>;
	  }
	| {
			type: 'CLOSE';
	  };

function reducer(
	state: MessageModalContext,
	action: MessageModalAction
): MessageModalContext {
	switch (action.type) {
		case 'OPEN':
			return { ...action.context, isOpen: true };
		case 'CLOSE':
			return { ...state, isOpen: false };
	}
}

/**
 * Message modal provider
 * It is assumed to be the only one used by the App component.
 */
export const MessageModalProvider: React.FC = ({ children }) => {
	const [context, dispatch] = useReducer(reducer, { isOpen: false });

	const dispatcher = useMemo(() => {
		let promiseKill: () => void;
		const close = () => dispatch({ type: 'CLOSE' });
		return {
			showMessage: (message: MessageResource) => {
				return new Promise<void>(resolve => {
					promiseKill = resolve;
					dispatch({
						type: 'OPEN',
						context: {
							resource: message,
							onOk() {
								close();
								resolve();
							},
						},
					});
				});
			},
			forceClose() {
				close();
				promiseKill?.();
			},
		};
	}, []);

	return (
		<MessageModalContext.Provider value={context}>
			<MessageDispatchContext.Provider value={dispatcher}>
				{children}
			</MessageDispatchContext.Provider>
		</MessageModalContext.Provider>
	);
};
MessageModalContext.displayName = 'MessageModalProvider';

export const MessageModalController: React.VFC = () => {
	const { isOpen, resource, onOk } = useContext(MessageModalContext);
	return <MessageModal {...{ isOpen, onOk, ...normalizeResource(resource) }} />;
};
MessageModalController.displayName = 'MessageModalController';

function normalizeResource(resource: MessageResource | undefined) {
	if (typeof resource === 'string') {
		return { message: resource };
	}

	if (isObject(resource) && 'message' in resource) {
		return resource;
	}
	return { message: resource };
}

/**
 * Message Modal hook.
 * @example
 * // at any components
 * const { showMessage } = useMessageModal();
 *
 * // Basic usage
 * const handler = async () => {
 *   // "showMessage" will return "Promise"
 *   await showMessage('Shows this message in message modal.')
 *   nextProcess();
 * }
 *
 * // Advanced usage
 * const otherHandler = () => {
 *   showMessage({
 *     title: 'Message Modal Title'
 *     message: 'Shows this message in message modal.'
 *     button: <a href="...">jump to other page</a>
 *   })
 * }
 */
export const useMessageModal = () => useContext(MessageDispatchContext);
