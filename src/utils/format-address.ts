export function fAddress(string: string, startSubStringLength = 5, endSubStringLength = 4) {
  if (startSubStringLength >= string.length) {
    return string;
  }

  if (!endSubStringLength) {
    return `${string.substring(0, startSubStringLength)}...`;
  }

  if (endSubStringLength >= string.length) {
    return string;
  }

  const endIndex = string.length;
  const startIndex = Math.max(endIndex - endSubStringLength, startSubStringLength);

  return `${string.substring(0, startSubStringLength)}...${string.substring(startIndex, endIndex)}`;
}

export function formatAddressToUsername(address: string, prefixLength = 5) {
  // Ensure the address is a string and has sufficient length
  if (typeof address !== 'string' || address.length < prefixLength) {
    return address; // Return the original if it can't be formatted
  }

  // Extract the prefix
  const prefix = address.slice(0, prefixLength);

  // Prepend "user" to the prefix
  return `user${prefix}`;
}
