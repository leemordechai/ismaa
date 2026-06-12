import type { Unit, VocabItem } from '../types';
import unit01raw from './unit-01.json';
import unit02raw from './unit-02.json';
import unit03raw from './unit-03.json';
import unit04raw from './unit-04.json';

const unit01 = unit01raw as unknown as Unit;
const unit02 = unit02raw as unknown as Unit;
const unit03 = unit03raw as unknown as Unit;
const unit04 = unit04raw as unknown as Unit;

export const contentUnits: Record<string, Unit> = {
	'unit-01': unit01,
	'unit-02': unit02,
	'unit-03': unit03,
	'unit-04': unit04
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
