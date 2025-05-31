export const formatAddress = (
  address?: string,
  startChars = 6,
  endChars = 4
) => {
  if (!address) return undefined;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};
