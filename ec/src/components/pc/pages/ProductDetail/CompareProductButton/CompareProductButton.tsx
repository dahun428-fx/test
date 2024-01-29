import { Button } from '@/components/pc/ui/buttons';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	handleClick: () => void;
};

export const CompareProductButton: FC<Props> = ({ handleClick }) => {
	const [t] = useTranslation();

	return (
		<>
			<Button
				type="button"
				theme="default-sub"
				size="m"
				icon="compare"
				onClick={handleClick}
			>
				{t('pages.productDetail.compareProductButton.title')}
			</Button>
		</>
	);
};
CompareProductButton.displayName = 'CompareProductButton';
