const Connector = require("../src/connector");
const Controller = require("../src/controller");
const { v4: getUUID } = require("uuidv4");

let connector, controller, createdWebsite;

const dummyMetricData = {
  FCP: 1403.1000000238419,
  TTFB: 15,
  domLoad: 1117,
  windowLoad: 2403,
  url: "https://mustafaculban.com/portfolio/covid19/",
  siteID: "bf310c3d-d229-4785-a40a-9598d3e734df",
};

beforeAll(() => {
  require("dotenv").config();
  connector = new Connector();
  return connector
    .connect()
    .then(() => {
      controller = new Controller();
      return controller;
    })
    .catch((e) => console.log(e));
});

afterAll(() => {
  return connector.disconnect();
});

describe("PerfAnalytics Backend Tests", () => {
  test("get web sites needs to return more than zero element", () =>
    controller
      .getWebsites()
      .then((websites) => expect(websites.length).toBeGreaterThan(0)));

  test("adding a website with an already existing url should give an error", () => {
    const alreadyExistedURL = "https://mustafaculban.com";
    return controller
      .addWebsite(alreadyExistedURL)
      .catch(
        (error) => console.log(error) && expect(error.status).not.toEqual(200)
      );
  });

  test("adding a website with non existing url should create a website successfully", () => {
    const newWebsiteUrl = `https://mustafaculban-${new Date().getTime()}.com`;
    return controller.addWebsite(newWebsiteUrl).then(({ status, data }) => {
      createdWebsite = data;
      expect(data.siteId).toBeTruthy();
    });
  });

  test("deleting a website should be successfull", () =>
    controller
      .deleteWebsite(createdWebsite.siteId)
      .then(({ status, data }) =>
        expect(data.siteId).toBe(createdWebsite.siteId)
      ));

  test("getting specific site data should return more than zero analytics data", () => {
    return controller
      .getWebsiteWithId(
        "bf310c3d-d229-4785-a40a-9598d3e734df",
        "Fri Jul 23 2021 23:15:00 GMT 0300 (GMT 03:00)",
        "Sat Jul 24 2021 23:15:00 GMT 0300 (GMT 03:00)"
      )
      .then((data) => {
        return (
          expect(data.analytics).toBeTruthy() &&
          expect(data.analytics.length).toBeGreaterThan(0)
        );
      });
  });

  test("giving non existing website id should return null", () => {
    return controller
      .getWebsiteWithId(
        "bf310c3d-d229-4785-a40a-9598d3e734df1111",
        "Fri Jul 23 2021 23:15:00 GMT 0300 (GMT 03:00)",
        "Sat Jul 24 2021 23:15:00 GMT 0300 (GMT 03:00)"
      )
      .then((data) => expect(data).toBeFalsy());
  });
  test("giving start date ahead of end date should return status of 400", () => {
    return controller
      .getWebsiteWithId(
        "bf310c3d-d229-4785-a40a-9598d3e734df",
        "Fri Jul 23 2022 23:15:00 GMT 0300 (GMT 03:00)",
        "Sat Jul 24 2021 23:15:00 GMT 0300 (GMT 03:00)"
      )
      .catch(({ status, message }) => expect(status).toBe(400));
  });
  test("adding a new metric data to a website should be truthy", () =>
    controller.websiteExist(dummyMetricData.siteID).then((exists) => {
      expect(exists).toBeTruthy();
      return controller
        .collect(dummyMetricData, exists)
        .then(({ status, data }) => {
          console.log(status, data);
          const metricId = data._id;
          expect(metricId).toBeTruthy();
        });
    }));
});
