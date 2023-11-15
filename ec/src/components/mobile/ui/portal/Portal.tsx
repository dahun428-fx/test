import { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { assertNotNull } from '@/utils/assertions';

type Props = {
	id: string;
	children: ReactNode;
};

export const Portal: React.FC<Props> = ({ id, children }) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		if (typeof window !== undefined) {
			setIsClient(true);
		}
	}, [isClient]);

	if (!isClient) {
		return null;
	}

	const container = document.getElementById(id);
	assertNotNull(container, `[Portal] Not found target: [id:${id}]`);

	return ReactDOM.createPortal(children, container);
};
Portal.displayName = 'Portal';
