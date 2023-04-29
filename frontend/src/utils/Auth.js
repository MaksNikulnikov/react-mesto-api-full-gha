const _baseUrl = "https://api.vmesto.nomoredomains.monster/";

const _handleResponce = function (res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
};

const register = function ({ email, password }) {
  return fetch(`${_baseUrl}signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
      email,
    }),
  }).then((res) => _handleResponce(res));
};

const login = function ({ email, password }) {
  return fetch(`${_baseUrl}signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
      email,
    }),
  }).then((res) => _handleResponce(res));
};

const checkToken = function (jwt) {
  return fetch(`${_baseUrl}users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  }).then((res) => _handleResponce(res));
};

export { register, checkToken, login };
