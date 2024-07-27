/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
 import { allPass, compose, partialRight, length, gt, lt, partial, andThen, tryCatch, tap, ifElse } from 'ramda';
import Api from '../tools/api';


const api = new Api();

const lt10 = partialRight(lt, [10])

const gt2 = partialRight(gt, [2]);

const gt0 = partialRight(gt, [0]);

const lengthLt10 = compose(lt10, length);

const lengthGt2 = compose(gt2, length);

const isPositive = compose(gt0, parseFloat);

const isDecimal = str => /^\d+(?:\.\d+)?$/.test(str);

const getConvertedNumber = api.get('https://api.tech/numbers/base');

const round = Math.round;

const convertToBinary = async (number) => {
    const res = await getConvertedNumber({ from: 10, to: 2, number: number.toString() })
    return res.result;
};

const getAnimal = async (animalId) => {
    const res = await api.get(`https://animals.tech/${animalId}`)(undefined);
    return res.result;
};

const square = number => number ** 2

const mod3 = number => number % 3

const isValidNumber = allPass([
    lengthLt10,
    lengthGt2,
    isPositive,
    isDecimal
])

 const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const handleValidationError = partial(handleError, ['ValidationError'])

    const process = compose(
        andThen(compose(
            andThen(handleSuccess),
            getAnimal,
            tap(writeLog),
            mod3,
            tap(writeLog),
            square,
            tap(writeLog),
            length,
            tap(writeLog),
        )),
        convertToBinary,
    );
    
    const handleValidationSuccess = compose(
        tryCatch(process, handleError),
        tap(writeLog),
        round,
        parseFloat,
        tap(writeLog),
    );
    
    ifElse(isValidNumber, handleValidationSuccess, handleValidationError)(value);


 }

export default processSequence;

    //  writeLog(value);

    //  api.get('https://api.tech/numbers/base', {from: 2, to: 10, number: '01011010101'}).then(({result}) => {
    //      writeLog(result);
    //  });

    //  wait(2500).then(() => {
    //      writeLog('SecondLog')

    //      return wait(1500);
    //  }).then(() => {
    //      writeLog('ThirdLog');

    //      return wait(400);
    //  }).then(() => {
    //      handleSuccess('Done');
    //  });