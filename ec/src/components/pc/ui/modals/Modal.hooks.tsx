import React, {
	cloneElement,
	ReactElement,
	useContext,
	useMemo,
	useState,
} from 'react';
import { Modal } from '@/components/pc/ui/modals/Modal';
import {
	ModalContentContext,
	ModalContentDispatchContext,
} from '@/components/pc/ui/modals/context';

export const ModalContentProvider: React.FC = ({ children }) => {
	const [state, setState] = useState<ModalContentContext>({
		isOpen: false,
	});

	const dispatcher = useMemo(() => {
		const closer = () => setState(p => ({ ...p, isOpen: false }));

		const showModal = (
			content: ReactElement,
			title?: string | ReactElement
		) => {
			return new Promise<unknown | void>(resolve => {
				const closeModal = (result?: unknown) => {
					closer();
					resolve(result);
				};
				setState({
					isOpen: true,
					title,
					content: cloneElement(content, { close: closeModal }),
					close: closeModal,
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

export const ModalController: React.VFC = () => {
	const { isOpen, title, content, close } = useContext(ModalContentContext);
	return (
		<Modal isOpen={isOpen} title={title} onCancel={close}>
			{content}
		</Modal>
	);
};

export function useModal<T = void>() {
	return useContext(
		ModalContentDispatchContext
	) as ModalContentDispatchContext<T>;
}
