import { error } from '@sveltejs/kit';
import { getUnit, lessonVocabIds } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const unit = getUnit(params.id);
	if (!unit) error(404, 'Unit not found');
	const lesson = unit.lessons.find((l) => l.n === Number(params.n));
	if (!lesson || lesson.status !== 'ready') error(404, 'Lesson not available yet');
	return { unit, lesson, vocabIds: lessonVocabIds(unit, lesson.n) };
};
