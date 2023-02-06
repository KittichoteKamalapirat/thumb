export const suggestNumTestDays = (subjectsNum: number) => {
  // if 1 subject + 1 ori => test for 2 * 7 = 14 days (7 each) => suggest 14, 28, 42, 56
  // if 2 subjects + 1 ori => test for 3* 7 = 31 days  (7 each)
  return [1, 2, 3, 4].map((multiply) => (subjectsNum + 1) * multiply * 7);
};
