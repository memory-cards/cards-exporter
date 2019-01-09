export const getUniqueId = (prefix = "xxx") =>
  Buffer.from(`${prefix}-${Date.now()}-${Math.random()}`)
    .toString("base64")
    .replace(/[^a-zA-Z]/g, "");
