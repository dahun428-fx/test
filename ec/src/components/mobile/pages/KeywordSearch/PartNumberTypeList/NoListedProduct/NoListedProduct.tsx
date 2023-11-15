import React from 'react';
import { List } from './List';
import { Photo } from './Photo';
import { Option as DisplayTypeOption } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { OverlayLoader } from '@/components/mobile/ui/loaders';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';

type Props = {
	loading: boolean;
	series: Series;
	displayType: DisplayTypeOption;
	addToCart: (payload: {
		brandCode: string;
		brandName: string;
		partNumber: string;
		quantity: number | null;
	}) => void;
	onClickOrderNow: (payload: {
		brandCode: string;
		brandName: string;
		partNumber: string;
		quantity: number | null;
	}) => void;
};

/** No Listed Product */
export const NoListedProduct: React.VFC<Props> = ({
	loading,
	series,
	onClickOrderNow,
	addToCart,
	displayType,
}) => {
	const props = { series, onClickOrderNow, addToCart };
	return (
		<>
			{DisplayTypeOption.LIST === displayType ? (
				<List {...props} />
			) : (
				<Photo {...props} />
			)}
			{loading && <OverlayLoader />}
		</>
	);
};
NoListedProduct.displayName = 'NoListedProduct';
