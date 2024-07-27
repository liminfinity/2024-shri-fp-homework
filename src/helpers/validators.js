/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */


import {all, complement, compose, equals, omit, prop, values, anyPass, allPass, head, not, isEmpty, filter, count, toPairs, countBy, identity, partialRight, gte } from "ramda";

const getStar = prop('star');

const getSquare = prop('square');

const getTriangle = prop('triangle');

const getCircle = prop('circle');

const isWhite = equals('white');

const isRed = equals('red');

const isOrange = equals('orange');

const isGreen = equals('green');

const isBlue = equals('blue');

const isNotWhite = complement(isWhite);

const isNotRed = complement(isRed);

const isNotOrange = complement(isOrange);

const isNotGreen = complement(isGreen);

const isNotBlue = complement(isBlue);

const omitTriangle = omit(['triangle']);

const omitStar = omit(['star']);

const omitSquare = omit(['square']);

const omitCircle = omit(['circle']);

const isAllWhite = all(isWhite);

const isAllNotWhite = all(isNotWhite);

const isAllRed = all(isRed);

const isAllOrange = all(isOrange);

const isAllGreen = all(isGreen);

const isAllBlue = all(isBlue);

const isAllColorsWhite = compose(isAllWhite, values);

const isAllColorsRed = compose(isAllRed, values);

const isAllColorsOrange = compose(isAllOrange, values);

const isAllColorsGreen = compose(isAllGreen, values);

const isAllColorsBlue = compose(isAllBlue, values);

const isAllColorsNotWhite = compose(isAllNotWhite, values)

const isHeadEqual = compose(equals, head);

const isAllEqual = arr => all(isHeadEqual(arr), arr);

const countByValue = arr => countBy(identity, arr);

const isNotEmpty = compose(not, isEmpty);

const hasNonWhiteKeyWithValue3 = compose(isNotEmpty, filter(([key, value]) => key !== 'white' && value === 3), toPairs) 

const greenShapeCount = compose(count(isGreen), values);

const redShapeCount = compose(count(isRed), values);

const orangeShapeCount = compose(count(isOrange), values);

const blueShapeCount = compose(count(isBlue), values);

const whiteShapeCount = compose(count(isWhite), values);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (shapes) => {
    const isWhiteOthers = compose(isAllColorsWhite, omitStar, omitSquare);
    const isStarRed = compose(isRed, getStar);
    const isSquareGreen = compose(isGreen, getSquare);

    return allPass([
        isWhiteOthers,
        isStarRed,
        isSquareGreen
    ])(shapes);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => {
    const gte2 = partialRight(gte, [2])
    return compose(gte2, greenShapeCount)(shapes);
}

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
    return equals(blueShapeCount(shapes), redShapeCount(shapes));
}

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (shapes) => {
    const isCircleBlue = compose(isBlue, getCircle);
    const isRedStar = compose(isRed, getStar);
    const isOrangeSquare = compose(isOrange, getSquare);
    return allPass([
        isCircleBlue,
        isRedStar,
        isOrangeSquare,
    ])(shapes);
}

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (shapes) => {
    const countByColor = compose(countByValue, values);
    const isThreeNonWhiteColorsAreEqual = compose(hasNonWhiteKeyWithValue3, countByColor);
    const isAllColorsEqual = compose(isAllEqual, values);
    return anyPass([
        isThreeNonWhiteColorsAreEqual,
        isAllColorsEqual,
    ])(shapes);
}

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (shapes) => {
    const isGreenTriangle = compose(isGreen, getTriangle);
    const countGreenEqualsTwo = compose(equals(2), greenShapeCount);
    const countRedEqualsOne = compose(equals(1), redShapeCount);

    return allPass([
        isGreenTriangle,
        countGreenEqualsTwo,
        countRedEqualsOne
    ])(shapes);

}

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (shapes) => isAllColorsOrange(shapes);
// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({star}) => {
    return allPass([
        isNotRed,
        isNotWhite,
    ])(star);
}

// 9. Все фигуры зеленые.
export const validateFieldN9 = (shapes) => isAllColorsGreen(shapes);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (shapes) => {
    const omitCircleAndStar = compose(omitCircle, omitStar);
    const isTriangleAndSquareColorsNotWhite = compose(isAllColorsNotWhite, omitCircleAndStar);
    const isTriangleAndSquareEquals = compose(isAllEqual, values, omitCircleAndStar);

    return allPass([
        isTriangleAndSquareColorsNotWhite,
        isTriangleAndSquareEquals
    ])(shapes);
}
