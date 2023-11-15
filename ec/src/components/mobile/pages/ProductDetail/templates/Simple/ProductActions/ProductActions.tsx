import { AddToMyComponentsButton } from './AddToMyComponentsButton';

type Props = {
	partNumberCount?: number;
};

/** Product actions component */
export const ProductActions: React.VFC<Props> = ({ partNumberCount }) => {
	return <>{partNumberCount === 1 && <AddToMyComponentsButton />}</>;
};
ProductActions.displayName = 'ProductActions';
