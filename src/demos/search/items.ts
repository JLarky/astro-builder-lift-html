export type CatalogItem = {
	id: string;
	title: string;
	category: string;
	blurb: string;
};

export const catalog: CatalogItem[] = [
	{
		id: 'dialog',
		title: 'Dialog',
		category: 'Overlay',
		blurb: 'A modal surface that traps focus and closes from the keyboard.',
	},
	{
		id: 'popover',
		title: 'Popover',
		category: 'Overlay',
		blurb: 'Anchored content that dismisses on outside click or Escape.',
	},
	{
		id: 'combobox',
		title: 'Combobox',
		category: 'Input',
		blurb: 'A text field with a filtered listbox and highlighted matches.',
	},
	{
		id: 'command',
		title: 'Command menu',
		category: 'Input',
		blurb: 'Search across actions, opened from a keyboard shortcut.',
	},
	{
		id: 'slider',
		title: 'Slider',
		category: 'Input',
		blurb: 'A range control with keyboard steps and a live value.',
	},
	{
		id: 'tabs',
		title: 'Tabs',
		category: 'Navigation',
		blurb: 'A tablist that moves selection with the arrow keys.',
	},
	{
		id: 'tree',
		title: 'Tree view',
		category: 'Navigation',
		blurb: 'Nested items you can expand, collapse, and type ahead through.',
	},
	{
		id: 'breadcrumb',
		title: 'Breadcrumb',
		category: 'Navigation',
		blurb: 'A trail of links that leads back through parent pages.',
	},
	{
		id: 'accordion',
		title: 'Accordion',
		category: 'Disclosure',
		blurb: 'Stacked sections that expand one panel at a time.',
	},
	{
		id: 'toast',
		title: 'Toast',
		category: 'Feedback',
		blurb: 'A transient status message that does not steal focus.',
	},
	{
		id: 'skeleton',
		title: 'Skeleton',
		category: 'Feedback',
		blurb: 'Placeholder shapes shown while the real content is loading.',
	},
	{
		id: 'empty',
		title: 'Empty state',
		category: 'Feedback',
		blurb: 'The panel a list shows when a filter matches nothing.',
	},
];
