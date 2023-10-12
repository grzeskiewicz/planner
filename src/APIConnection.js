export const API_URL='http://192.168.0.3:3001';
export const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});


export function request(url, method, dataset) {
    return new Request(url, {
        method: method,
        headers: headers,
        mode: 'cors',
        body: JSON.stringify(dataset)
    });
}

export async function pingCheck(ip,port){
 let status=await fetch(request(`${API_URL}/pingcheck`, "POST", {ip:ip,port:port}))
  .then((res) => res.json())
  .then((result) => {
    console.log(result);
    return result.msg;
    }
  )
  .catch((error) => Promise.reject(new Error(error)));
  return status;
}