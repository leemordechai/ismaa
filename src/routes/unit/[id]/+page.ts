import { error } from '@sveltejs/kit';
import { getUnit } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const unit = getUnit(params.id);
	if (!unit) error(404, 'Unit not found');
	return { unit };
};
