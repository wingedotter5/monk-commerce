export function mergeArrayWithoutDuplicates(arr1, arr2) {
  const newArr = [...arr1];
  const lookUp = new Set(newArr.map((i) => i.id));
  arr2.forEach((item) => {
    if (!lookUp.has(item.id)) {
      newArr.push(item);
    }
  });

  return newArr;
}
