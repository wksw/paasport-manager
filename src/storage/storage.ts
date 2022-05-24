export function Set(key: string, value: any, expires_at: number) {
  localStorage.setItem(
    key,
    JSON.stringify({
      data: value,
      expires_at: expires_at != -1 ? Date.now() + expires_at * 1000 : -1,
    }),
  );
}

export function Get(key: string): any {
  const item = localStorage.getItem(key);
  console.log('get ', key, 'from localstorage is ', item);
  if (item == null) {
    return null;
  }
  const itemObject = JSON.parse(item);
  console.log('item ', key, 'expires at', itemObject.expires_at, 'now is', Date.now());
  if (itemObject.expires_at == -1) {
    return itemObject.data;
  }
  if (itemObject.expires_at < Date.now()) {
    return null;
  }
  return itemObject.data;
}
