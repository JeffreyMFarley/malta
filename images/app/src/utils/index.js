/**
 * Function to set the limit of the range of a set of numbers
 * @param {int} x value we are checking
 * @param {int} min smallest number it can me
 * @param {int} max biggest number it can be
 * @returns {*}the limited value
 */
export function clamp( x, min, max ) {
  if ( x < min ) {
    x = min;
  } else if ( x > max ) {
    x = max;
  }
  return x;
}

/**
 * Replacement for the common pattern:
 * if( o.field )
 *    x = o.field
 * else
 *    x = alternateValue
 *
 * Avoids some of the complexity lint warnings
 *
 * @param {Object} o the object being tested
 * @param {string} field the field to check
 * @param {string|Object} alternateValue the value to use in absence
 * @returns {string} the value to use
 */
export const coalesce = ( o, field, alternateValue ) => {
  if ( typeof o !== 'object' ) {
    return alternateValue;
  }

  return field in o && o[field] ? o[field] : alternateValue;
};

// ----------------------------------------------------------------------------
// attribution: lodash.js (Creative Commons License)

/**
* Binds methods of an object to the object itself, overwriting the existing
* method
*
* @param {Object} obj The object to bind and assign the bound methods to.
* @param {...(string|string[])} methodNames The object method names to bind,
*  specified individually or in arrays.
* @returns {Object} the updated object
*/
export function bindAll( obj, methodNames ) {
  const length = methodNames.length
  for ( let i = 0; i < length; i++ ) {
    const key = methodNames[i]
    obj[key] = obj[key].bind( obj )
  }
  return obj;
}
