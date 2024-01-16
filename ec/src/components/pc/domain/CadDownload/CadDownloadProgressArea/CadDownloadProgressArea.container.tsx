import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { CadDownloadProgressArea as Presenter } from './CadDownloadProgressArea';
import { useTranslation } from 'react-i18next';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';

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
	const { showMessage } = useMessageModal();

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

	const isDisableButton = useRef<boolean>(false);

	const [t] = useTranslation();

	/**
	 * 선택한 cad id 설정 ex) 2D | DWF | V5.5, ASCII
	 * @param item SelectedCadDataFormat : cad format
	 */
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

	/**
	 * 선택 형번 CAD 다운로드 모달 창에서 cad 선택
	 */
	const handleClickItem = (item: SelectedCadDataFormat) => {
		const isSelected = selectedItems.has(item);
		if (isSelected) {
			selectedItems.delete(item);
		} else {
			selectedItems.add(item);
		}
		setSelectedItems(new Set(selectedItems));
	};

	/**
	 * 선택 형번 CAD 다운로드 모달 창에서 '전체선택' 버튼 클릭
	 */
	const handleClickAllItem = () => {
		if (cadDownloadProgressList && cadDownloadProgressList.size > 0) {
			if (selectedItems.size === cadDownloadProgressList?.size) {
				setSelectedItems(new Set());
			} else {
				setSelectedItems(new Set(cadDownloadProgressList));
			}
		}
	};

	/**
	 * 선택 형번 CAD 다운로드 모달 창에서 '삭제' 버튼 클릭
	 */
	const handleClickDelete = useCallback(() => {
		if (!cadDownloadProgressList || selectedItems.size === 0) {
			showMessage(
				t(
					'components.domain.cadDownload.cadDownloadProgressArea.message.noDelete'
				)
			);
			return false;
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

	/**
	 * 담기 버튼 클릭
	 */
	const handleAddStackPutsth = useCallback(() => {
		if (isDisableButton.current) return false;
		if (!!!selectedItems.size) {
			showMessage(
				t(
					'components.domain.cadDownload.cadDownloadProgressArea.message.noData'
				)
			);
			return false;
		}
		onClickPutsth(Array.from(selectedItems));
		isDisableButton.current = true;
		setTimeout(() => {
			isDisableButton.current = false;
			onClose();
		}, 500);
	}, [selectedItems]);

	/**
	 * 즉시다운로드 버튼 클릭
	 */
	const handleDirectDownload = useCallback(() => {
		if (isDisableButton.current) return false;
		if (!!!selectedItems.size) {
			showMessage(
				t(
					'components.domain.cadDownload.cadDownloadProgressArea.message.noData'
				)
			);
			return false;
		}
		isDisableButton.current = true;
		onClickDirect(Array.from(selectedItems));
		setTimeout(() => {
			isDisableButton.current = false;
			onClose();
		}, 500);
	}, [selectedItems]);

	useEffect(() => {
		if (!!selectedCad) {
			//selectedCad: SelectedOption ----> id : string
			let selectedCadId = getSelectedCadId(selectedCad);
			if (!cadDownloadProgressIdsList.has(selectedCadId)) {
				//중복 방지를 위해 이미 선택 형번 CAD 다운로드 모달창에 출력된 cad는 추가하지 않음
				//id 값으로 비교
				cadDownloadProgressIdsList.add(selectedCadId);
				setCadDownloadProgressIdsList(new Set(cadDownloadProgressIdsList));
				//선택 형번 CAD 다운로드 모달 창에 select option 에서 선택한 cad 추가
				cadDownloadProgressList.add(selectedCad);
				setCadDownloadProgressList(new Set(cadDownloadProgressList));
				//모달 창에 출력된 cadDownloadProgressList 중 사용자가 선택한 cad
				//처음 출력시에는 선택 한 상태로 출력
				selectedItems.add(selectedCad);
				setSelectedItems(new Set(selectedItems));
				//유효한 건 수
				setSelectedTotalCount(selectedItems.size);
			}
		}
	}, [selectedCad]);

	/**
	 * 선택 건수 표시
	 */
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
