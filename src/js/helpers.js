import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";

// function that manages when making a request fails (handles very bad internet)
const timeout = function (second) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(
                    `Request took too long! Timeout after ${second} second`
                )
            );
        }, second * 1000);
    });
};

export async function AJAX(url, uploadData = undefined) {
    try {
        const fetchPromise = uploadData
            ? fetch(url, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(uploadData),
              })
            : fetch(url);
        const response = await Promise.race([
            fetchPromise,
            timeout(TIMEOUT_SEC),
        ]);
        const dataJson = await response.json();

        if (!response.ok)
            throw new Error(`${dataJson.message} (${response.status})`);

        return dataJson;
    } catch (err) {
        throw err;
    }
}

/*
// get data from API
export async function getJSON(url) {
    try {
        // Promise fulfilled or rejected, that's what will be executed
        const fetchPromise = fetch(url);
        const response = await Promise.race([
            fetchPromise,
            timeout(TIMEOUT_SEC),
        ]);
        const dataJson = await response.json();

        if (!response.ok)
            throw new Error(`${dataJson.message} (${response.status})`);

        return dataJson;
    } catch (err) {
        // if the result of getJSON error, the promise will return a reject, the error handling will be passed to the catch
        throw err;
    }
}

// send the new recipe to API
export async function sendJSON(url, uploadData) {
    try {
        const fetchPromise = fetch(url, {
            method: "POST",
            // headers is a snippet of text that contains information about the request itself
            headers: {
                "Content-Type": "application/json", // tells the API, that the data sent will be in JSON format, then the API will create a new recipe in the database
            },
            body: JSON.stringify(uploadData),
        });
        const response = await Promise.race([
            fetchPromise,
            timeout(TIMEOUT_SEC),
        ]);
        const dataJson = await response.json();

        if (!response.ok)
            throw new Error(`${dataJson.message} (${response.status})`);

        return dataJson;
    } catch (err) {
        // if the result of getJSON error, the promise will return a reject, the error handling will be passed to the catch
        throw err;
    }
}
*/
