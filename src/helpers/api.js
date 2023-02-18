const apiMethod = (method, body='') => {

    let methods = {
      'GET' : {
        method: method,
      },
      'DELETE' : {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      },
      'POST' : {
        method: method,
        body:  JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      },
      'PUT' : {
        method: method,
        body:  JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      },
      'PATCH' : {
        method: method,
        body:  JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      },
    }
  
    return methods[method]

  
  };
  
  export { apiMethod }