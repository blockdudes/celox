export function convertTimestampToTime(timestamp) {
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();

  const formattedTime =
    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
  return formattedTime;
}

export const getStatus = (status) => {
  if (Number(status) == 0) {
    return "Pending";
  }
  if (Number(status) == 1) {
    return "Active";
  }
  if (Number(status) == 2) {
    return "PartiallyMatched";
  }
  if (Number(status) == 3) {
    return "Matched";
  }
  if (Number(status) == 4) {
    return "Expired";
  }
  if (Number(status) == 5) {
    return "Cancelled";
  }
};

export function getColorForStatus(status) {
  switch (Number(status)) {
    case 0:
      return "yellow";
    case 1:
      return "green";
    case 2:
      return "orange";
    case 3:
      return "blue";
    case 4:
      return "red";
    case 5:
      return "gray";
    default:
      return "black"; // Default color if status doesn't match any of the cases
  }
}

export const getType = (isBuyOrder) => {
  if (isBuyOrder == true) {
    return "Buy";
  }
  if (isBuyOrder == false) {
    return "Sell";
  }
};

export const getTypeColor = (isBuyOrder) => {
  if (isBuyOrder == true) {
    return "green";
  }
  if (isBuyOrder == false) {
    return "red";
  }
};

export const convertToOrder = (data: readonly {}[]) => {
  var orders: Array<Object> = [];
  for (let i = 0; i < data.length; i++) {
    orders.push({
      token: data[i][0],
      user: data[i][1],
      quantity: data[i][2],
      price: data[i][3],
      isBuyOrder: data[i][4],
      status: data[i][5],
      createdAt: data[i][6],
      expiresAt: data[i][7],
      fulfilledAmount: data[i][8],
    });
  }
  return orders;
};
