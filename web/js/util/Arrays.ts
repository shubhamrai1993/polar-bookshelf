import {Preconditions} from '../Preconditions';
import {Optional} from './ts/Optional';

export class Arrays {

    /**
     * Convert an array to a dictionary.
     */
    static toDict(val: {} | any[]): {[key: string]: any} {

        let isObject = typeof val === "object";
        let isArray = val instanceof Array;

        if(! isObject && ! isArray) {
            // only needed if we're called from JS.  Otherwise the compiler
            // will check the type.
            throw new Error("Neither an object or an array.");
        }

        if(isObject && ! isArray) {
            // already done as this is a dictionary though we might consider
            // making this a
            return val;
        }

        if (! isArray) {
            throw new Error("Not an array");
        }

        let result: {[key: string]: any} = {};

        let arrayVal: any[] = <any[]>val;

        for(let idx = 0; idx < arrayVal.length; ++idx) {
            result[idx] = arrayVal[idx];
        }

        return result;

    }

    /**
     * Go over the array-like object and return tuples with prev, curr, and next
     * properties so that we can peek at siblings easily.  If the prev and / or
     * next are not present these values are null.
     *
     * This can be used for algorithms that need to peek ahead or behind
     * inside an iterative algorithm
     */
    static createSiblings<T>(arrayLikeObject: T[]) {

        Preconditions.assertNotNull(arrayLikeObject, "arrayLikeObject");

        /**
         * {Array<ArrayPosition>}
         * @type {Array}
         */
        let result = [];

        for(let idx = 0; idx < arrayLikeObject.length; ++idx) {

            result.push(new ArrayPosition<T>(
                Optional.of(arrayLikeObject[idx-1]).getOrUndefined(),
                arrayLikeObject[idx],
                Optional.of(arrayLikeObject[idx+1]).getOrUndefined()
            ));

        }

        return result;

    };

}

/**
 * Represents a 'position' object for createSiblings() that has a curr (current),
 * prev (previous), and next references for working with lists of objects.  The
 * position allow sus to know where we currently are but also the previous and
 * future states.
 */
class ArrayPosition<T> {

    public readonly prev?: T;

    public readonly curr: T;

    public readonly next?: T;

    constructor(prev: T | undefined, curr: T, next: T | undefined) {
        this.prev = prev;
        this.curr = curr;
        this.next = next;
    }

}
