const formatDate = (d: Date) => {
  const currDate = d.getDate();
  const currMonth = d.getMonth() + 1; // Months are zero based
  const currYear = d.getFullYear();

  const twoDigitDate =
    String(currDate).length === 1 ? "0" + String(currDate) : currDate;
  const twoDigitMonth =
    String(currMonth).length === 1 ? "0" + String(currMonth) : currMonth;

  const formatted = currYear + "-" + twoDigitMonth + "-" + twoDigitDate;
  return formatted;
};

export default formatDate;
