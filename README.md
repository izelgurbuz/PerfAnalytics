# PerfAnalytics

<p float="left">
  <img src="images/dark.png?raw=true" width="49%" />
  <img src="images/light.png?raw=true" width="48%" /> 
</p>


PerfAnalytics is an ecosystem which collects and criticizes web performance data. The ecosystem consists
of 3 subsystem;

- PerfAnalytics.Js
- PerfAnalytics.API
- PerfAnalytics.Dashboard

### ToC

1. [Project Setup](#project-setup)
2. [Run](#run)
3. [Usage](#usage)
3.1. [JS Script Usage](#script-usage)
3.2. [Dashboard Usage](#dashboard-usage)
4. [API](#api)

### Project Setup
Copy `.env.example` file to `.env` by 

```bash
cp .env.example .env
```

and edit `DB_CONNECTION` variable.

- Note1: Currently `MONGO_URI` is exposed to public due to limitation on repo settings. You can manually change URI from `src/connector.js:6`

Secondly run for node dependencies.
```bash
npm install
````

- Note 2: You do not need to run npm install for dashboard manually. To run both server and dashboard please go to next section.


### Run

To run PerfAnalytics on development environment, you only need to run one tiny command
```bash
npm run dev
```

### Usage

#### JS Script Usage

To collect request data from the web sites you;
1. You need to open dashboard and enter your url into "Add URL" input field then save it.

2. Search your Website URL via Search Bar to display a "Website ID".

3. Add below code snippet to your website's Header section.

```html
<script>const perfAnalyticSiteId = 'WebsiteID';</script>
<script src="https://izelgurbuz-perfanalytics.herokuapp.com/perfAnalytics.js"></script>
```
4. You have done İnjecting script part to your website. Now let move to Dashboard Usage!


#### Dashboard Usage

Dashboard has `2` modes for fetching data.
<center>
<p>
  <img src="images/live-switch.png?raw=true" width="30%" />
  <img src="images/offline-switch.png?raw=true" width="35%" /> 
</p>
</center>

1. Live Mode
Every 10 seconds, data is fetched via API to display live performance data on dashboard.

2. Offline Mode
Displayed data is only fetched once page is loaded. You need to manually refresh the Dashboard to see the upcoming data.


To see website metrics, click on the arrow icon of the table row.
<img src="images/opened-content.png?raw=true" width="100%" />

That will open Graphs and Resource Timings Tabs. 

On the Graphs Tab, FCP, TTFB, domLoad and windowLoad graphs are located.

On the Resource Timings Tab, network timings of website resources are listed based on their waterfall time.

You can choose time interval for both of the contents of the tabs from date time filters.

By default, the graphs and list show the last half hour of data.


### API

Backend is powerd by `Node.Js` and `Express.js` with the `MongoDB`.

- `[GET] /perfAnalytics` or `[GET] /`
The dashboard app
- `[GET] /dashboard/websites`
Get all the websites
- `[GET] /dashboard/website/#websiteId` -> Returns all the metrics for last half hour
Optional Params
    > startDate: Chosen start date
    > endDate: Chosen end date


`[POST] /analytics/collect`
Records analytic data
Required Payload

```json
{
    FCP: 0,
    TTFB: 14,
    domLoad: 1716,
    origin: "URL",
    resourceLoadTimes: [{name: "URL"}],
    siteID: "WEBSITE_ID",
    url: "URL",
    windowLoad: 3418,  
}
```