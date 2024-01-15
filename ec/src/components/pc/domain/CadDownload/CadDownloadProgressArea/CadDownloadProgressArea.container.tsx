import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';
import { FC, useCallback, useEffect, useState } from 'react';
import { CadDownloadProgressArea as Presenter } from './CadDownloadProgressArea';
import { useTranslation } from 'react-i18next';

type Props = {
	selectedCad: SelectedCadDataFormat | null;
	onClickPutsth: (list: SelectedCadDataFormat[]) => void;
	onClickDirect: (list: SelectedCadDataFormat[]) => void;
	onClose: () => void;
};
export const CadDownloadProgressArea: FC<Props> = ({
	selectedCad,
	onClickPutsth,
	onClickDirect,
	onClose,
}) => {
	const [selectedItems, setSelectedItems] = useState<
		Set<SelectedCadDataFormat>
	>(new Set());

	const [cadDownloadProgressList, setCadDownloadProgressList] = useState<
		Set<SelectedCadDataFormat>
	>(new Set());

	const [cadDownloadProgressIdsList, setCadDownloadProgressIdsList] = useState<
		Set<string>
	>(new Set());

	const [selectedTotalCount, setSelectedTotalCount] = useState(0);

	const [t] = useTranslation();

	const getSelectedCadId = (item: SelectedCadDataFormat) => {
		let versionText = !!item.versionText ? ` | ${item.versionText}` : '';
		if (item.format === 'others') {
			return t(
				'components.domain.cadDownload.cadDownloadProgressArea.cadIdOthers',
				{
					grp: item.grp,
					formatOthersText: item.formatOthersText,
					versionText: versionText,
				}
			);
		}
		return t(
			'components.domain.cadDownload.cadDownloadProgressArea.cadIdNormal',
			{
				grp: item.grp,
				formatText: item.formatText,
				versionText: versionText,
			}
		);
	};

	const handleClickItem = (item: SelectedCadDataFormat) => {
		const isSelected = selectedItems.has(item);
		if (isSelected) {
			selectedItems.delete(item);
		} else {
			selectedItems.add(item);
		}
		setSelectedItems(new Set(selectedItems));
	};

	const handleClickAllItem = () => {
		if (cadDownloadProgressList && cadDownloadProgressList.size > 0) {
			if (selectedItems.size === cadDownloadProgressList?.size) {
				setSelectedItems(new Set());
			} else {
				setSelectedItems(new Set(cadDownloadProgressList));
			}
		}
	};

	const handleClickDelete = useCallback(() => {
		if (!cadDownloadProgressList || selectedItems.size === 0) {
			return;
		}

		const data = Array.from(cadDownloadProgressList).filter(item => {
			if (!selectedItems.has(item)) {
				return item;
			}
		});

		setCadDownloadProgressIdsList(
			new Set(data.map(item => getSelectedCadId(item)))
		);
		setCadDownloadProgressList(new Set(data));
		setSelectedItems(new Set());
	}, [
		cadDownloadProgressList,
		selectedItems,
		setSelectedItems,
		setCadDownloadProgressList,
	]);

	const handleAddStackPutsth = useCallback(() => {
		if (!!!selectedItems.size) {
			return;
		}
		onClickPutsth(Array.from(selectedItems));
		setTimeout(() => {
			onClose();
		}, 500);
	}, [selectedItems]);

	const handleDirectDownload = useCallback(() => {
		if (!!!selectedItems.size) {
			return;
		}
		onClickDirect(Array.from(selectedItems));
		setTimeout(() => {
			onClose();
		}, 500);
	}, [selectedItems]);

	useEffect(() => {
		console.log('selectedCad', selectedCad);
		if (!!selectedCad) {
			let selectedCadId = getSelectedCadId(selectedCad);
			if (!cadDownloadProgressIdsList.has(selectedCadId)) {
				cadDownloadProgressIdsList.add(selectedCadId);
				setCadDownloadProgressIdsList(new Set(cadDownloadProgressIdsList));
				cadDownloadProgressList.add(selectedCad);
				setCadDownloadProgressList(new Set(cadDownloadProgressList));
				selectedItems.add(selectedCad);
				setSelectedItems(new Set(selectedItems));
				setSelectedTotalCount(selectedItems.size);
			}
		}
	}, [selectedCad]);

	useEffect(() => {
		if (selectedItems.size > 0) {
			setSelectedTotalCount(selectedItems.size);
		} else {
			setSelectedTotalCount(0);
		}
	}, [selectedItems]);

	return (
		<>
			<Presenter
				handleAddStackPutsth={handleAddStackPutsth}
				handleDirectDownload={handleDirectDownload}
				getSelectedCadId={getSelectedCadId}
				handleClickDelete={handleClickDelete}
				handleClickAllItem={handleClickAllItem}
				handleClickItem={handleClickItem}
				selectedItems={selectedItems}
				selectedTotalCount={selectedTotalCount}
				cadDownloadProgressList={cadDownloadProgressList}
				handleOnClose={() => onClose()}
			/>
		</>
	);
};

CadDownloadProgressArea.displayName = 'CadDownloadProgressArea';
