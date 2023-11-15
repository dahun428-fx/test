import { createContext, ReactElement } from 'react';

export const Context = createContext({
	isOpen: false,
	open: () => {
		// noop
	},
	close: () => {
		// noop
	},
});

//------------------------------------------------------------------------
// Modal Content Context

export type ModalContentContext = {
	isOpen: boolean;
	title?: string | ReactElement;
	content?: ReactElement;
	className?: string;
	close?: () => void;
};

export type ModalContentDispatchContext<T> = {
	showModal: (
		content: ReactElement,
		options?: {
			title?: string | ReactElement;
			className?: string;
		}
	) => Promise<T | void>;
};

export const ModalContentContext = createContext<ModalContentContext>({
	isOpen: false,
});

export const ModalContentDispatchContext = createContext<
	ModalContentDispatchContext<unknown>
>({
	async showModal() {
		// noop
	},
});
