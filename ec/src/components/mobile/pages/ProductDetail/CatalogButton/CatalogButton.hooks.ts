import { useSelector } from '@/store/hooks';
import { selectDigitalCatalog } from '@/store/modules/pages/productDetail';

export const useDigitalBook = () => useSelector(selectDigitalCatalog);
