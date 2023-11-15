import React, {
	cloneElement,
	ReactElement,
	useContext,
	useMemo,
	useState,
} from 'react';
import { Modal } from '@/components/mobile/ui/modals/Modal';
import {
	ModalContentContext,
	ModalContentDispatchContext,
} from '@/components/mobile/ui/modals/context';

/** Modal content provider */
export const ModalContentProvider: React.FC = ({ children }) => {
	const [state, setState] = useState<ModalContentContext>({
		isOpen: false,
	});

	const dispatcher = useMemo(() => {
		const closer = () => setState(p => ({ ...p, isOpen: false }));

		const showModal = (
			content: ReactElement,
			options?: {
				title?: string | ReactElement;
				className?: string;
			}
		) => {
			return new Promise<unknown | void>(resolve => {
				const closeModal = (result?: unknown) => {
					closer();
					resolve(result);
				};
				setState({
					isOpen: true,
					content: cloneElement(content, { close: closeModal }),
					close: closeModal,
					...options,
				});
			});
		};

		return { showModal };
	}, []);

	return (
		<ModalContentContext.Provider value={state}>
			<ModalContentDispatchContext.Provider value={dispatcher}>
				{children}
			</ModalContentDispatchContext.Provider>
		</ModalContentContext.Provider>
	);
};

/** Modal controller */
export const ModalController: React.VFC = () => {
	const { isOpen, title, content, close, className } =
		useContext(ModalContentContext);
	return (
		<Modal {...{ isOpen, title, className }} onCancel={close}>
			{content}
		</Modal>
	);
};

/** Modal hook */
export function useModal<T = void>() {
	return useContext(
		ModalContentDispatchContext
	) as ModalContentDispatchContext<T>;
}
