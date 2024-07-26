const fs = require("fs");
const Accessibility = (on, config) => {

    on('task', {
        lambdatest_log(message) {
          console.log(message)
          return null
        },
        initializeFile(filePath) {
          if (!fs.existsSync(filePath)) {
              fs.writeFileSync(filePath, '[]');
          }
          return filePath;
        }
  })

    let browser_validation = true;

    on('before:browser:launch', (browser = {}, launchOptions) => {
        try {
          if (process.env.ACCESSIBILITY_EXTENSION_PATH !== undefined) {
            if (browser.name !== 'chrome') {
              console.log(`Accessibility Automation will run only on Chrome browsers.`);
              browser_validation = false;
            }
            if (browser.name === 'chrome' && browser.majorVersion <= 94) {
              console.log(`Accessibility Automation will run only on Chrome browser version greater than 94.`);
              browser_validation = false;
            }
            if (browser.isHeadless === true) {
              console.log(`Accessibility Automation will not run on legacy headless mode. Switch to new headless mode or avoid using headless mode.`);
              browser_validation = false;
            }
            if (browser_validation) {
                
            const accessibility_ext_path = process.env.ACCESSIBILITY_EXTENSION_PATH
        
            launchOptions.args.push(`--load-extension=` + accessibility_ext_path)
              return launchOptions
            }
          }
        } catch(err) {
          console.log(`Error in loading Accessibility Automation extension: ${err.message}`);
        }
        
      })
      config.env.WCAG_CRITERIA= process.env.WCAG_CRITERIA;
      config.env.BEST_PRACTICE= process.env.BEST_PRACTICE;
      config.env.NEEDS_REVIEW= process.env.NEEDS_REVIEW;
      config.env.ACCESSIBILITY_REPORT_PATH = process.env.ACCESSIBILITY_REPORT_PATH;
      console.log(`parameter for accessibility report WCAG_CRITERIA - ` + config.env.WCAG_CRITERIA)
      console.log(`parameter for accessibility report BEST_PRACTICE -` + config.env.BEST_PRACTICE)
      console.log(`parameter for accessibility report NEEDS_REVIEW -` + config.env.NEEDS_REVIEW)

      return config;
}

module.exports = Accessibility;