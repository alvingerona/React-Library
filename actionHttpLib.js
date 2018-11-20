import serviceHttpLib from "../services/serviceHttpLib";
import statusMessage from "./status";
import { objToQueryParam, alertMsg } from "../helpers";

/**
 * By defaut for store(), update() and destory()
 * a prompt message will show on success.
 */
const actionHttpLib = class {
  constructor(dispatch, basePath) {
    this.basePath = basePath;
    this.dispatch = dispatch;
    this.service = new serviceHttpLib(this.basePath);
    this.successMessage = "Transaction complete.";
    this.messageFunction = "localstorage";
    this.showSuccess = true;
  }

  /**
   * Disable message disable for error and succcess.
   */
  dontShowSuccess() {
    this.showSuccess = false;
  }

  setSuccessMessage(msg) {
    this.successMessage = msg;

    return this;
  }

  useLocalStorageMessage() {
    this.messageFunction = "localstorage";
  }

  useStatusMessage() {
    this.messageFunction = "statusmessage";
  }

  useMessageFunction(func) {
    this.messageFunction = func;
  }

  triggerSuccessMessage() {
    if (this.messageFunction == "localstorage") {
      localStorage.setItem("flash.success", this.successMessage);
    } else {
      statusMessage(this.dispatch, "success", this.successMessage);
    }
  }

  filter(filter, callback) {
    let query = objToQueryParam(filter);

    return this.service
      .filter(query)
      .then(response => {
        if (response.errors) {
          statusMessage(
            this.dispatch,
            "error",
            this.handleErrors(response.errors)
          );
        }

        if (callback) {
          callback(response);
        }

        return response;
      })
      .catch(e => {
        statusMessage(this.dispatch, "error", e.toString());

        return null;
      });
  }

  show(id) {
    return this.service
      .show(id)
      .then(response => {
        return response;
      })
      .catch(e => {
        statusMessage(this.dispatch, "error", e.toString());

        return null;
      });
  }

  store(fields) {
    return this.service
      .store(fields)
      .then(response => {
        if (response.errors) {
          let error = this.handleErrors(response.errors);

          if (error != "") {
            console.log(error);
            statusMessage(this.dispatch, "error", error);
          }
        } else {
          if (this.showSuccess) {
            this.triggerSuccessMessage();
          }
        }

        return response;
      })
      .catch(e => {
        statusMessage(this.dispatch, "error", e.toString());

        return null;
      });
  }

  destory(id) {
    return this.service
      .destroy(id)
      .then(response => {
        if (response.errors) {
          statusMessage(
            this.dispatch,
            "error",
            this.handleErrors(response.errors)
          );
        } else {
          if (this.showSuccess) {
            this.triggerSuccessMessage();
          }
        }

        return response;
      })
      .catch(e => {
        statusMessage(this.dispatch, "error", e.toString());

        return null;
      });
  }

  update(id, fields) {
    return this.service
      .update(id, fields)
      .then(response => {
        if (response.errors) {
          statusMessage(
            this.dispatch,
            "error",
            this.handleErrors(response.errors)
          );
        } else {
          if (this.showSuccess) {
            this.triggerSuccessMessage();
          }
        }

        return response;
      })
      .catch(e => {
        statusMessage(this.dispatch, "error", e.toString());

        return null;
      });
  }

  handleErrors(errors) {
    if (errors.messages) {
      return Object.values(errors.messages)
        .map(error => error.join("<br/>"))
        .join("<br/>");
    } else if (errors.message) {
      return errors.message;
    }

    return "";
  }
};

export default actionHttpLib;
