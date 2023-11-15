import { ReactNode } from 'react';

export function join(nodes: ReactNode[], separator: string) {
	if (!nodes.length) {
		return null;
	}

	return nodes.reduce((p, c) => (
		<>
			{p}
			{separator}
			{c}
		</>
	));
}
