export const PutData = async (url = "", data = {} , token) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      console.log("not okay response!, response :", response);
      return response;
    }
    return await response.json();
  } catch (error) {
    console.log("not okay!(catch error)");
    return null;
  }
};

export const FetchData = async (url = "",token) => {
  try {
    const response = await fetch(url, {
      // mode: "no-cors",
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      console.log("not okay response!, response :", response);
      return response;
    }
    return await response.json();
  } catch (error) {
    console.log("not okay!(catch error)");
    return null;
  }
};

export const PatchData = async (url = "", data = [], token) => {
  try {
    const response = await fetch(url, {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      console.log("not okay response!, response :", response);
      return response;
    }
    return await response.json();
  } catch (error) {
    console.log("not okay!(catch error)");
    return null;
  }
};

export const SendDataAndFile = async (url = "", data = {}, token , method) => {
  try {
    let formData = new FormData();
    for (let key in data) {
      // console.log(key, data[key]);
      formData.append(key, data[key]);
    }
    const response = await fetch(url, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: formData,
    });
    if (!response.ok) {
      console.log("not okay response!, response :", response);
      return response;
    }
    return await response.json();
  } catch (error) {
    console.log("not okay!(catch error)");
    return null;
  }
};
