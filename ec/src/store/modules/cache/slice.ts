import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CacheState } from './type';
import { authActions } from '@/store/modules/auth';

const initialState: CacheState = {
	topCategories: null,
	cartCount: null,
};

const slice = createSlice({
	name: 'cache',
	initialState,
	reducers: {
		update(state, action: PayloadAction<Partial<CacheState>>) {
			return { ...state, ...action.payload };
		},
	},
	// WARN: experimental implementation
	extraReducers(builder) {
		return builder
			.addCase(authActions.logout, state => {
				return { ...state, cartCount: null };
			})
			.addMatcher(isAuthLoadAction, (state, action) => {
				return { ...state, cartCount: action.payload.user.cartCount };
			});
	},
});

export const { reducer: cacheReducer, actions } = slice;

/** Auth load action creator */
type AuthLoadAction = ReturnType<
	typeof authActions.login | typeof authActions.restore
>;

/** Auth load action type guard */
function isAuthLoadAction(action: AnyAction): action is AuthLoadAction {
	return authActions.login.match(action) || authActions.restore.match(action);
}
