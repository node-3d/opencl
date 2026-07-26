import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import * as cl from './index.ts';

describe('Program - buildProgram null', () => {
	it('throws if program is nullptr', () => {
		assert.throws(
			() => cl.buildProgram(null as unknown as cl.TClProgram),
			new Error('Argument 0 must be of type `Object`'),
		);
	});
});
