export class Utils {
  StringToArray(string: string, delimiter: string) {
    console.log('On prcerssing string to array...');
    string.replaceAll(' ,', ',');
    string.replaceAll(', ', ',');
    const convertedArray = string.split(delimiter);
    console.log('Your converted array is: ', convertedArray);
    return convertedArray;
  }

  countTimesAppearedOfAnItemInAnArray(item: any, array: any) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
      if (array[i] === item) {
        count++;
      }
    }
    return count;
  }
}
