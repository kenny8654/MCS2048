"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const stream_1 = require("stream");
const exceptions_1 = require("./exceptions");
const fileType = require("file-type");
const pkg = require("../package.json");
class HTTPClient {
    constructor(baseURL, defaultHeaders) {
        this.instance = axios_1.default.create({
            baseURL,
            headers: Object.assign({}, defaultHeaders, {
                "User-Agent": `${pkg.name}/${pkg.version}`,
            }),
        });
        this.instance.interceptors.response.use(res => res, err => Promise.reject(this.wrapError(err)));
    }
    get(url, params) {
        return this.instance.get(url, { params }).then(res => res.data);
    }
    getStream(url, params) {
        return this.instance
            .get(url, { params, responseType: "stream" })
            .then(res => res.data);
    }
    post(url, data) {
        return this.instance
            .post(url, data, { headers: { "Content-Type": "application/json" } })
            .then(res => res.data);
    }
    postBinary(url, data, contentType) {
        let getBuffer;
        if (Buffer.isBuffer(data)) {
            getBuffer = Promise.resolve(data);
        }
        else {
            getBuffer = new Promise((resolve, reject) => {
                if (data instanceof stream_1.Readable) {
                    const buffers = [];
                    let size = 0;
                    data.on("data", (chunk) => {
                        buffers.push(chunk);
                        size += chunk.length;
                    });
                    data.on("end", () => resolve(Buffer.concat(buffers, size)));
                    data.on("error", reject);
                }
                else {
                    reject(new Error("invalid data type for postBinary"));
                }
            });
        }
        return getBuffer.then(data => {
            return this.instance
                .post(url, data, {
                headers: {
                    "Content-Type": contentType || fileType(data).mime,
                    "Content-Length": data.length,
                },
            })
                .then(res => res.data);
        });
    }
    delete(url, params) {
        return this.instance.delete(url, { params }).then(res => res.data);
    }
    wrapError(err) {
        if (err.response) {
            return new exceptions_1.HTTPError(err.message, err.response.status, err.response.statusText, err);
        }
        else if (err.code) {
            return new exceptions_1.RequestError(err.message, err.code, err);
        }
        else if (err.config) {
            // unknown, but from axios
            return new exceptions_1.ReadError(err);
        }
        // otherwise, just rethrow
        return err;
    }
}
exports.default = HTTPClient;
