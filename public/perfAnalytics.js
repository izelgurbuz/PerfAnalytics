function PerfAnalytics(_siteIdentifier) {
  if (!_siteIdentifier) return;

  function onWindowLoadedHandler() {
    const performance =
      window.performance || window.webkitPerformance || window.mozPerformance;
    //   window.msPerformance;
    if (typeof performance === "undefined") {
      return;
    }
    reportPerformanceMetrics(gatherPerformanceMetrics(performance));
  }

  function gatherPerformanceMetrics(performance) {
    const paintPerformanceEntries = performance.getEntriesByType("paint");
    const fcpEntry = paintPerformanceEntries.find(
      (element) => element.name === "first-contentful-paint"
    );
    // for (const entry of entryList.getEntriesByName('first-contentful-paint')) {

    // }
    return {
      FCP: fcpEntry?.startTime || 0,
      TTFB: performance.timing.responseStart - performance.timing.requestStart,
      domLoad:
        performance.timing.domContentLoadedEventEnd -
        performance.timing.navigationStart,
      windowLoad: Date.now() - performance.timing.navigationStart,
      //   resourceLoadTimes: performance
      //     .getEntriesByType("resource")
      //     .map((element) => {
      //       return {
      //         name: element.name,
      //         duration: element.duration,
      //         transferSize: element.transferSize,
      //         initiatorType: element.initiatorType,
      //       };
      //     }),
    };
  }

  function reportPerformanceMetrics(performanceMetrics) {
    window.analyticData = {
      ...performanceMetrics,
      siteID: _siteIdentifier,
      origin: window.location.origin,
      url: window.location.href,
    };

    var http = new XMLHttpRequest();
    var url = "https://4a9ba11b9de8.ngrok.io/analytics/collect";

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(window.analyticData));
  }

  window.addEventListener("load", onWindowLoadedHandler);
}
new PerfAnalytics(perfAnalyticSiteId || false);
