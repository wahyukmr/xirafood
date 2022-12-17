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
