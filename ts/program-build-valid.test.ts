import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import * as cl from './index.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;
let device = null as unknown as cl.TClDevice;

before(() => {
	({ context, device } = cl.quickStart());
});

describe('Program - buildProgram valid', () => {
	it('builds using a valid program and a given device', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		const ret = cl.buildProgram(prg, [device]);
		assert.strictEqual(ret, undefined);
		cl.releaseProgram(prg);
	});

	it('builds using a valid program', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		const ret = cl.buildProgram(prg);
		assert.strictEqual(ret, undefined);
		cl.releaseProgram(prg);
	});

	it('builds using a valid program and options', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		const ret = cl.buildProgram(prg, null, '-D NOCL_TEST=5');
		assert.strictEqual(ret, undefined);
		cl.releaseProgram(prg);
	});
});
