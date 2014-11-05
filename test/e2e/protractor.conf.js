exports.config = {
  seleniumAddress: "http://localhost:4444/wd/hub",
  capabilities: {
    browserName: "chrome"
  },
  specs: ["main_spec.js"],
  baseUrl: 'http://localhost:8000/',
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true
  }
};
