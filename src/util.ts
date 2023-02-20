import { max, min, randomInt, scaleLinear } from 'd3';

export function randomNums(n: number, min = 0, max = 100) {
	return Array.from({ length: n }, () => randomInt(min, max)());
}

export function randomNumsMatrix(rows: number, cols: number, min = 0, max = 100) {
	return Array.from({ length: rows }, () => randomNums(cols, min, max));
}

export function radius(area: number) {
	return Math.sqrt(area) / Math.PI; // radius equation
}
