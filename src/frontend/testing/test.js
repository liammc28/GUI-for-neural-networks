import assert from "assert"
import webdriver from "selenium-webdriver"
import "geckodriver"

const serverUri = "http://localhost:3000/";
const appTitle = "GUI for NN";

let browser = new webdriver.Builder()
    .usingServer()
    .withCapabilities({ browserName: "chrome" })
    .build();


/**
 * Function to get the title and resolve it it promise.
 * @return {[type]} [description]
 */
function logTitle() {
    return new Promise((resolve, reject) => {
        browser.getTitle().then(function(title) {
            resolve(title);
        });
    });
}

describe("Home Page", function() {
    /**
     * Test case to load our application and check the title.
     */
    it("Should load the home page and get title", function() {
        return new Promise((resolve, reject) => {
            browser
                .get(serverUri)
                .then(logTitle)
                .then(title => {
                    assert.strictEqual(title, appTitle);
                    resolve();
                })
                .catch(err => reject(err));
        });
    });
    /**
     * End of test cases use.
     * Closing the browser and exit.
     */
    after(function() {
        // End of test use this.
        browser.quit();
    });
});
