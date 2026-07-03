// The full A2→B1 map. Built units have content JSON; the rest are the roadmap
// (see CURRICULUM.md). Shown on the home page as the trajectory spine.

export interface ArcMeta {
	n: number;
	title: string;
	titleAr: string;
	mission: string;
}

export interface UnitMeta {
	id: string;
	n: number;
	arc: number;
	title: string;
	titleAr: string;
	focus: string;
	status: 'ready' | 'upcoming';
}

export const arcs: ArcMeta[] = [
	{
		n: 1,
		title: 'The Street',
		titleAr: 'الشارع',
		mission: 'Consolidate A2 into real-time comprehension. The speed is the curriculum.'
	},
	{
		n: 2,
		title: 'The News',
		titleAr: 'الأخبار',
		mission: 'Enter the news register: events, the West Bank, Jerusalem, demonstrations.'
	},
	{
		n: 3,
		title: 'Gaza',
		titleAr: 'غزة',
		mission: 'War, displacement, hunger, ceasefire — testimony and reportage, heard directly.'
	},
	{
		n: 4,
		title: 'Politics',
		titleAr: 'السياسة',
		mission: 'Actors, institutions, argument: how Palestinians debate their own politics.'
	},
	{
		n: 5,
		title: 'Voices',
		titleAr: 'أصوات',
		mission: 'Scaffolds off. Podcasts, long interviews, and the exit exam.'
	}
];

export const units: UnitMeta[] = [
	{ id: 'unit-01', n: 1, arc: 1, title: 'What happened?', titleAr: 'شو صار؟', focus: 'The "news of the day" frame in everyday talk; reacting to events.', status: 'ready' },
	{ id: 'unit-02', n: 2, arc: 1, title: 'Family & work at speed', titleAr: 'أهل وشغل', focus: 'Known ground pushed to listening fluency; numbers and times by ear.', status: 'ready' },
	{ id: 'unit-03', n: 3, arc: 1, title: 'On the road', titleAr: 'عالطريق', focus: 'Serveece, directions, the checkpoint as daily procedure.', status: 'ready' },
	{ id: 'unit-04', n: 4, arc: 1, title: 'Market & coffee', titleAr: 'السوق والقهوة', focus: 'Buying, haggling, hospitality scripts.', status: 'ready' },
	{ id: 'unit-05', n: 5, arc: 2, title: 'Breaking news', titleAr: 'خبر عاجل', focus: 'News meta-language; the anchor-vs-street register split.', status: 'ready' },
	{ id: 'unit-06', n: 6, arc: 2, title: 'The West Bank', titleAr: 'الضفة', focus: 'The occupation’s daily lexicon; geography as people reference it.', status: 'upcoming' },
	{ id: 'unit-07', n: 7, arc: 2, title: 'Jerusalem', titleAr: 'القدس', focus: 'The city’s vocabulary: Al-Aqsa, Sheikh Jarrah, demolitions, IDs.', status: 'upcoming' },
	{ id: 'unit-08', n: 8, arc: 2, title: 'Demonstration', titleAr: 'مظاهرة', focus: 'Protest language; understanding chanted speech.', status: 'upcoming' },
	{ id: 'unit-09', n: 9, arc: 2, title: 'Numbers & dates', titleAr: 'أرقام وتواريخ', focus: 'Casualties, percentages, ٤٨ and ٦٧ — fast numbers by ear.', status: 'upcoming' },
	{ id: 'unit-10', n: 10, arc: 3, title: 'The war', titleAr: 'الحرب', focus: 'Core war lexicon; testimony vs reportage.', status: 'upcoming' },
	{ id: 'unit-11', n: 11, arc: 3, title: 'Displacement', titleAr: 'النزوح', focus: 'Tents, evacuation orders, the vocabulary of waiting.', status: 'upcoming' },
	{ id: 'unit-12', n: 12, arc: 3, title: 'Hunger & aid', titleAr: 'الجوع والمساعدات', focus: 'Famine, flour, crossings, aid queues — as spoken.', status: 'upcoming' },
	{ id: 'unit-13', n: 13, arc: 3, title: 'Ceasefire', titleAr: 'وقف إطلاق النار', focus: 'Truce and deal discourse; hope and skepticism markers.', status: 'upcoming' },
	{ id: 'unit-14', n: 14, arc: 4, title: 'Who rules?', titleAr: 'مين بيحكم؟', focus: 'The PA, factions, elections, the split.', status: 'upcoming' },
	{ id: 'unit-15', n: 15, arc: 4, title: 'Prisoners', titleAr: 'الأسرى', focus: 'Detention, hunger strikes, prisoner families’ register.', status: 'upcoming' },
	{ id: 'unit-16', n: 16, arc: 4, title: 'Nakba & memory', titleAr: 'النكبة والذاكرة', focus: 'Refugee, camp, return — memory inside current politics.', status: 'upcoming' },
	{ id: 'unit-17', n: 17, arc: 4, title: 'The world watches', titleAr: 'العالم بيتفرّج', focus: 'UN, vetoes, normalization, boycott — and bitter irony.', status: 'upcoming' },
	{ id: 'unit-18', n: 18, arc: 5, title: 'Podcast', titleAr: 'بودكاست', focus: 'Full episodes; gist strategies for unknown words.', status: 'upcoming' },
	{ id: 'unit-19', n: 19, arc: 5, title: 'The long interview', titleAr: 'مقابلة طويلة', focus: 'Speaker-switching, interruptions, mixed dialects.', status: 'upcoming' },
	{ id: 'unit-20', n: 20, arc: 5, title: 'Exit', titleAr: 'الامتحان', focus: 'Three unscaffolded pieces, cold. Graduation report.', status: 'upcoming' }
];
