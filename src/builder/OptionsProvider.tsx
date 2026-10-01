import React from 'react';

type Options = {
	isEditing: boolean;
	outlet?: React.ReactNode;
	footer?: React.ReactNode;
	header?: React.ReactNode;
};

const OptionsContext = React.createContext<Options>({ isEditing: false });

export function OptionsProvider({
	isEditing,
	outlet,
	footer,
	header,
	children,
}: Options & {
	children: React.ReactNode;
}) {
	const value = React.useMemo(
		() => ({ isEditing, outlet, footer, header }),
		[isEditing, outlet, footer, header],
	);
	return (
		<OptionsContext.Provider value={value}>{children}</OptionsContext.Provider>
	);
}

export function useOptions() {
	return React.useContext(OptionsContext);
}

/**
 * Use safe to modify to prevent hydration errors if the web component will change the DOM before React hydrates.
 */
export function useSafeToModify() {
	const { isEditing } = useOptions();
	const [safeToModify, setSafeToModify] = React.useState(!isEditing);
	React.useEffect(() => {
		setSafeToModify(true);
	}, [isEditing]);
	return safeToModify;
}
