export type Album = {
	id: string;
	title: string;
	artist: string;
	year: number;
	genre: string;
	note: string;
};

export const albums: Album[] = [
	{
		id: 'night-ferry',
		title: 'Night Ferry',
		artist: 'Mira Sol',
		year: 2019,
		genre: 'Jazz',
		note: 'A late quartet set recorded on a boat between two harbors.',
	},
	{
		id: 'paper-lanterns',
		title: 'Paper Lanterns',
		artist: 'Juniper Hale',
		year: 2016,
		genre: 'Folk',
		note: 'Voice and nylon guitar, taped in a kitchen after midnight.',
	},
	{
		id: 'glass-orchard',
		title: 'Glass Orchard',
		artist: 'Lumen Park',
		year: 2021,
		genre: 'Electronic',
		note: 'Bright arpeggios over a soft drum machine, like rain on glass.',
	},
	{
		id: 'low-tide-radio',
		title: 'Low Tide Radio',
		artist: 'Mira Sol',
		year: 2022,
		genre: 'Soul',
		note: 'Horns, a patient bass, and a chorus that waits for the last bus.',
	},
	{
		id: 'cedar-interval',
		title: 'Cedar Interval',
		artist: 'Ada Voss',
		year: 2014,
		genre: 'Classical',
		note: 'Solo piano studies named after trails above the city.',
	},
	{
		id: 'static-picnic',
		title: 'Static Picnic',
		artist: 'Lumen Park',
		year: 2018,
		genre: 'Ambient',
		note: 'Field recordings from a windy overlook, stitched into drones.',
	},
	{
		id: 'harbor-keys',
		title: 'Harbor Keys',
		artist: 'The North Window',
		year: 2017,
		genre: 'Jazz',
		note: 'Piano trio sketches written between soundchecks.',
	},
	{
		id: 'second-postcard',
		title: 'Second Postcard',
		artist: 'Juniper Hale',
		year: 2020,
		genre: 'Folk',
		note: 'Songs addressed to towns the singer passed through once.',
	},
	{
		id: 'violet-circuit',
		title: 'Violet Circuit',
		artist: 'Nia Okonkwo',
		year: 2023,
		genre: 'Electronic',
		note: 'Club patterns slowed until the kick feels like a heartbeat.',
	},
	{
		id: 'sunday-batch',
		title: 'Sunday Batch',
		artist: 'The North Window',
		year: 2015,
		genre: 'Soul',
		note: 'A nine-piece band tracking live, one take after coffee.',
	},
	{
		id: 'marble-stairs',
		title: 'Marble Stairs',
		artist: 'Ada Voss',
		year: 2011,
		genre: 'Classical',
		note: 'Left-hand figures that climb and never quite settle.',
	},
	{
		id: 'room-tone',
		title: 'Room Tone',
		artist: 'Nia Okonkwo',
		year: 2019,
		genre: 'Ambient',
		note: 'Nearly silent pieces built from vents and far-off traffic.',
	},
	{
		id: 'blue-annex',
		title: 'Blue Annex',
		artist: 'Mira Sol',
		year: 2013,
		genre: 'Jazz',
		note: 'Standards bent just enough to feel like new rooms.',
	},
	{
		id: 'wool-coat-weather',
		title: 'Wool Coat Weather',
		artist: 'Juniper Hale',
		year: 2024,
		genre: 'Folk',
		note: 'Choruses about platforms, missed trains, and borrowed gloves.',
	},
	{
		id: 'neon-orchard',
		title: 'Neon Orchard',
		artist: 'Lumen Park',
		year: 2020,
		genre: 'Electronic',
		note: 'Sequencers tuned to the flicker of a corner-store sign.',
	},
	{
		id: 'copper-hymn',
		title: 'Copper Hymn',
		artist: 'The North Window',
		year: 2021,
		genre: 'Soul',
		note: 'Organ, tambourine, and a lead vocal close to the mic.',
	},
	{
		id: 'open-score',
		title: 'Open Score',
		artist: 'Ada Voss',
		year: 2024,
		genre: 'Classical',
		note: 'A short suite for piano in the quiet of an empty hall.',
	},
	{
		id: 'afterimage',
		title: 'Afterimage',
		artist: 'Nia Okonkwo',
		year: 2016,
		genre: 'Ambient',
		note: 'Loops that fade the way a bright sign does when you look away.',
	},
];

const seenGenres = new Set<string>();

export const genres: { name: string; count: number }[] = [];

for (const album of albums) {
	if (seenGenres.has(album.genre)) continue;
	seenGenres.add(album.genre);
	genres.push({
		name: album.genre,
		count: albums.filter((item) => item.genre === album.genre).length,
	});
}

export function queryTokens(query: string): string[] {
	return query.trim().split(/\s+/).filter(Boolean);
}

function haystack(album: Album): string {
	return [
		album.title,
		album.artist,
		String(album.year),
		album.genre,
		album.note,
	]
		.join(' ')
		.toLowerCase();
}

export function matchesQuery(album: Album, query: string): boolean {
	const tokens = queryTokens(query).map((token) => token.toLowerCase());
	if (tokens.length === 0) return true;
	const text = haystack(album);
	return tokens.every((token) => text.includes(token));
}

const fields = ['title', 'artist', 'year', 'genre', 'note'] as const;

export type AlbumField = (typeof fields)[number];

function fieldValue(album: Album, field: AlbumField): string {
	switch (field) {
		case 'title':
			return album.title;
		case 'artist':
			return album.artist;
		case 'year':
			return String(album.year);
		case 'genre':
			return album.genre;
		case 'note':
			return album.note;
	}
}

export function fieldHasToken(value: string, query: string): boolean {
	const tokens = queryTokens(query).map((token) => token.toLowerCase());
	if (tokens.length === 0) return false;
	const lower = value.toLowerCase();
	return tokens.some((token) => lower.includes(token));
}

export function matchedFields(album: Album, query: string): AlbumField[] {
	return fields.filter((field) =>
		fieldHasToken(fieldValue(album, field), query),
	);
}

export function formatMatchedFields(matched: readonly string[]): string {
	if (matched.length === 0) return '';
	if (matched.length === 1) return `Matched ${matched[0]}`;
	if (matched.length === 2) return `Matched ${matched[0]} and ${matched[1]}`;
	const last = matched[matched.length - 1];
	return `Matched ${matched.slice(0, -1).join(', ')}, and ${last}`;
}

export function noteOnlyMatch(album: Album, query: string): boolean {
	if (!fieldHasToken(album.note, query)) return false;
	const header = `${album.title} ${album.artist} ${album.year} ${album.genre}`;
	return !fieldHasToken(header, query);
}
