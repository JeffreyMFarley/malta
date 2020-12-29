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
