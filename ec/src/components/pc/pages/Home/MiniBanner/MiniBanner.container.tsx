import { MiniBanner as Presenter } from './MiniBanner';
import { MiniBanners } from '@/components/pc/pages/Home';
import { useSelector } from '@/store/hooks';
import {
	selectAuthIsReady,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';

type Props = {
	miniBanners: MiniBanners;
};

export const MiniBanner: React.VFC<Props> = props => {
	const authIsReady = useSelector(selectAuthIsReady);
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);

	return (
		<Presenter
			miniBannerHtml={
				authIsReady && isPurchaseLinkUser
					? props.miniBanners.purchaseLinkHtml
					: props.miniBanners.html
			}
		/>
	);
};
