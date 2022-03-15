export function sum(x: number, y: number) {
  return x + y;
}

export async function retrieveRates() {
  const options = {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  };
  return await fetchURL('https://api.belo.app/public/price', options);
}

export async function fetchURL(url = '', options = {}) {
  const response = await fetch(url, options);
  return response.json();
}
