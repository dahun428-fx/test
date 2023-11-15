import React, { createContext, useContext, useState } from 'react';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { useTimer } from '@/utils/timer';

type CategoryNavigationContext = {
	hoveredCategory: Category | null;
	setHoveredCategory: (category: Category | null) => void;
};

const Context = createContext<CategoryNavigationContext>({
	hoveredCategory: null,
	setHoveredCategory: () => {
		// noop
	},
});

/**
 * Category navigation provider
 *
 * @see Category component
 * @example
 * <CategoryNavigationProvider>
 * 	<CategoryNavigation />
 * </CategoryNavigationProvider>
 */
export const CategoryNavigationProvider: React.FC = ({ children }) => {
	const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
	const timer = useTimer();

	const handleSetHoveredCategory = async (category: Category | null) => {
		if (category) {
			timer.cancel();
			setHoveredCategory(category);
		} else {
			try {
				await timer.sleep(500);
				setHoveredCategory(null);
			} catch {
				// noop
			}
		}
	};

	return (
		<Context.Provider
			value={{ hoveredCategory, setHoveredCategory: handleSetHoveredCategory }}
		>
			{children}
		</Context.Provider>
	);
};

export const useCategoryNavigationContext = () => useContext(Context);
