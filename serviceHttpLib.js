import config from "config";
import { authHeader } from "../helpers";

const serviceHttpLib = class {
  constructor(basePath) {
    this.basePath = `${config.apiUrl}/api/${basePath}`;
  }

  filter(queryStr, path) {
    let header = authHeader();
    header["Content-Type"] = "application/json";
    header["Access-Control-Allow-Origin"] = "*";

    let options = {
      method: "GET",
      headers: header
    };

    if (queryStr) {
      queryStr = "?" + queryStr;
    }

    return fetch(this.getUrl(path) + queryStr, options).then(
      this.handleResponse
    );
  }

  show(id, path) {
    let header = authHeader();
    header["Content-Type"] = "application/json";
    header["Access-Control-Allow-Origin"] = "*";

    let options = {
      method: "GET",
      headers: header
    };

    return fetch(this.getUrl(path) + "/" + id, options).then(
      this.handleResponse
    );
  }

  getUrl(path) {
    let basePath = this.basePath;
    if (path) {
      basePath = `${config.apiUrl}/api/${path}`;
    }
    return basePath;
  }

  store(fields, path) {
    let header = authHeader();
    header["Content-Type"] = "application/json; charset=utf-8";
    header["Access-Control-Allow-Origin"] = "*";
    header["Accept"] = "application/json";
    header["mode"] = "cors";

    let options = {
      method: "POST",
      headers: header,
      body: JSON.stringify(fields)
    };

    return fetch(this.getUrl(path), options).then(this.handleResponse);
  }

  update(id, fields, path) {
    let header = authHeader();
    header["Content-Type"] = "application/json; charset=utf-8";
    header["Access-Control-Allow-Origin"] = "*";
    header["Accept"] = "application/json";
    header["mode"] = "cors";

    let options = {
      method: "PUT",
      headers: header,
      body: JSON.stringify(fields)
    };

    return fetch(this.getUrl(path) + `/${id}`, options).then(
      this.handleResponse
    );
  }

  destroy(id, path) {
    let header = authHeader();
    header["Content-Type"] = "application/json; charset=utf-8";
    header["Access-Control-Allow-Origin"] = "*";
    header["Accept"] = "application/json";
    header["mode"] = "cors";

    let options = {
      method: "DELETE",
      headers: header
    };

    return fetch(this.getUrl(path) + `/${id}`, options).then(
      this.handleResponse
    );
  }

  handleResponse(response) {
    return response.json();
  }
};

export default serviceHttpLib;
