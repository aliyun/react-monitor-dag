const originToString = Object.prototype.toString;
const getType = (data) => {
  let type = originToString.call(data);
  return type.match(/\[object (.*?)\]/)[1].toLowerCase();
};

export default getType;
