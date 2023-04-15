const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
let options = new chrome.Options();
options.addArguments("--headless");
const automateJournal = async (username, password) => {
  let status = false;
  let result = "";
  let driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  try {
    await driver.get("http://kabinet.unec.edu.az/");
    await driver
      .findElement(By.id("LoginForm_username"))
      .sendKeys(username, Key.RETURN);
    await driver
      .findElement(By.id("LoginForm_password"))
      .sendKeys(password, Key.RETURN);
    const nameSurname = await driver
      .findElement(
        By.css(
          "body > div.main-container.container-fluid > div > div.page-content > div.right-panel > div > div:nth-child(2) > div.right-text-2"
        )
      )
      .getText();
    result += `E-Journal - ${nameSurname}:\n`;
    await driver.get(
      "http://kabinet.unec.edu.az/az/studentEvaluation?eduYear=1000042&eduSemester=1000098&lessonType=4100"
    );
    const evaluationTable = await driver.findElement(
      By.id("studentEvaluation-grid")
    );
    const lessons = await driver.findElements(
      By.css("#studentEvaluation-grid tbody tr")
    );
    for (let i = 0; i < lessons.length; i++) {
      let name = await lessons[i].findElements(By.css("td"));
      name = await name[2].getText();
      await lessons[i].click();
      await driver.sleep(1000);
      try {
        await driver
          .findElement(By.css("#myTab11 > li:nth-child(4) > a"))
          .click();
      } catch (e) {
        await driver.sleep(1000);
        newPageUnec();
      }
      let qbPercent = await driver.findElement(
        By.css("#finalEval > table > tbody > tr > td:nth-child(15)")
      );
      qbPercent = await qbPercent.getText();
      let total = await driver.findElement(
        By.css("#finalEval > table > tbody > tr > td:nth-child(10)")
      );
      total = await total.getText();
      let seminar = await driver.findElement(
        By.css("#finalEval > table > tbody > tr > td:nth-child(6)")
      );
      seminar = await seminar.getText();
      result += `\n${name}:\nCari: ${total} | Seminar: ${seminar} | Qaib: ${qbPercent}%\n`;
      const exitBtn = await driver.findElement(
        By.css(
          "#modal2 > div.modal-dialog.modal-lg.modal1 > div > div.modal-header > button"
        )
      );
      await exitBtn.click();
    }
    status = true;
  } catch (e) {
    result = "Try again";
  }
  await driver.quit();
  return { result, status };
};
module.exports = automateJournal;
