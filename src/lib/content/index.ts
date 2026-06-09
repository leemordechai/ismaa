import type { Unit, VocabItem } from '../types';
import unit01raw from './unit-01.json';

const unit01 = unit01raw as unknown as Unit;

export const contentUnits: Record<string, Unit> = {
	'unit-01': unit01
};

export function getUnit(id: string): Unit | undefined {
	return contentUnits[id];
}

// Flat vocab registry for the SRS review queue.
export const allVocab: Record<string, VocabItem> = {};
for (const unit of Object.values(contentUnits)) {
	for (const lesson of unit.lessons) {
		for (const block of lesson.blocks) {
			if (block.type === 'vocab') {
				for (const item of block.items) allVocab[item.id] = item;
			}
		}
	}
}

export function lessonVocabIds(unit: Unit, n: number): string[] {
	const lesson = unit.lessons.find((l) => l.n === n);
	if (!lesson) return [];
	const ids: string[] = [];
	for (const block of lesson.blocks) {
		if (block.type === 'vocab') for (const item of block.items) ids.push(item.id);
	}
	return ids;
}
