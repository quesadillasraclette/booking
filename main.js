function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function setupDynamicValues() {
  var dataFeed = dynamicContent.Feed_template_creative[0];
  var locale =
    dataFeed.language.toLowerCase() + "-" + dataFeed.country.toUpperCase();

  // var priceFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number)
  // var priceFormatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
  var priceFormatter = new Intl.NumberFormat(locale);

  var data;

  for (let i = 0; i < 3; i++) {
    data = dynamicContent.Feed_template__Supersonic_Yours_Routes_Feed[i];

    var priceLocal =
      dataFeed.price_prefix +
      priceFormatter.format(data.Price) +
      dataFeed.price_suffix;
    var priceUSD =
      dataFeed.usd_price_prefix + priceFormatter.format(data.Price_USD);
    var price = priceLocal;
    if (data.both_prices == true) price = priceUSD + " o " + priceLocal;

    $("#tour" + i + " .cityFrom").text(data.Origin_Name);
    $("#tour" + i + " .cityTo").text(data.Destination_Name);
    $("#tour" + i + " .cityPrice").text("Desde " + price);
  }

  $(".toursHint").text(dynamicContent.Feed_template_creative[0].obs1);
  $("#btnGo").text(dynamicContent.Feed_template_creative[0].CTA);

  $("#slogan img").attr(
    "src",
    dynamicContent.Feed_template_creative[0].Promo_logo_url.Url
  );
}

var EVENT_TOUR_CLICKED = "Tour clicked";
var EVENT_BACK_CLICKED = "Back button clicked";
var EVENT_BUYNOW_CLICKED = "'Buy now' button clicked";
var EVENT_EXIT = "Exit performed";
var EVENT_FROM_CAL_CLICKED = "From calendar clicked";
var EVENT_TO_CAL_CLICKED = "To calendar clicked";

var FEED = {
  datesFrom: ["2019-1-02", "2019-2-03"],
  datesTo: ["2019-1-6", "2019-2-4"]
};

var DATE_SEPARATOR = "/";
var DATE_SEPARATOR_FEED = "-";
var tourIndex;
var dateFrom, dateTo;

function normalizeDate(dateStr) {
  var date = dateStr.split(DATE_SEPARATOR_FEED);
  var dd = parseInt(date[2], 10);
  var mm = parseInt(date[1], 10);
  var yyyy = parseInt(date[0], 10);

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return dd + DATE_SEPARATOR + mm + DATE_SEPARATOR + yyyy;
}

function processFeedDates() {
  FEED.datesFrom = $(FEED.datesFrom)
    .map(function(i, date) {
      return normalizeDate(date);
    })
    .toArray();
  FEED.datesTo = $(FEED.datesTo)
    .map(function(i, date) {
      return normalizeDate(date);
    })
    .toArray();
}

function onRenderCellFrom(date, cellType) {
  var props = {};
  var now = new Date();
  var dates = FEED.datesFrom;
  var dateStr = normalizeDate(
    date.getFullYear() +
      DATE_SEPARATOR_FEED +
      (date.getMonth() + 1) +
      DATE_SEPARATOR_FEED +
      date.getDate()
  );
  if (cellType == "day" && dates.indexOf(dateStr) >= 0) {
    props.classes = "highlight-date";
  }
  if (cellType == "day" && date.getTime() < now.getTime()) {
    props.disabled = true;
  }

  return props;
}

function onRenderCellTo(date, cellType) {
  var props = {};
  var now = new Date();
  var dates = FEED.datesTo;
  var dateStr = normalizeDate(
    date.getFullYear() +
      DATE_SEPARATOR_FEED +
      (date.getMonth() + 1) +
      DATE_SEPARATOR_FEED +
      date.getDate()
  );
  if (cellType == "day" && dates.indexOf(dateStr) >= 0) {
    props.classes = "highlight-date";
  }
  if (cellType == "day" && date.getTime() < now.getTime()) {
    props.disabled = true;
  }
  if (cellType == "day" && dateFrom) {
    var dateLeft = new Date(dateFrom.getTime());
    dateLeft.setDate(dateLeft.getDate() + 1);
    if (date.getTime() < dateLeft.getTime()) {
      props.disabled = true;
    }
  }

  return props;
}

function sortAsc(a, b) {
  sA = a.split(DATE_SEPARATOR);
  sB = b.split(DATE_SEPARATOR);
  var dA = new Date(sA[2], parseInt(sA[1], 10) - 1, sA[0]);
  var dB = new Date(sB[2], parseInt(sB[1], 10) - 1, sB[0]);

  return dA.getTime() > dB.getTime() ? 1 : -1;
}

var __dateFixFrom = false;
var __dateFixTo = false;

function onShowFrom(dp, animationCompleted) {
  if (!animationCompleted) {
    $("#calHint1").css("opacity", "1");

    if (FEED.datesFrom.length > 0 && !dateFrom && !__dateFixFrom) {
      var date = FEED.datesFrom.sort(sortAsc)[0];
      var month = date.split(DATE_SEPARATOR)[1];
      var curDate = dateFrom || new Date();
      var curMonth = curDate.getMonth() + 1;
      var diff = parseInt(month, 10) - curMonth;

      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          dpFrom.next();
        }
      }
      __dateFixFrom = true;
    }
  }
}

function onHideFrom(dp, animationCompleted) {
  if (!animationCompleted) {
    $("#calHint1").css("opacity", "0");
  }
}

function onShowTo(dp, animationCompleted) {
  if (!animationCompleted) {
    $("#calHint2").css("opacity", "1");

    if (FEED.datesTo.length > 0 && !dateTo && !__dateFixTo) {
      var date = FEED.datesTo.sort(sortAsc)[0];
      var month = date.split(DATE_SEPARATOR)[1];
      var curDate = dateTo || new Date();
      var curMonth = curDate.getMonth() + 1;
      var diff = parseInt(month, 10) - curMonth;

      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          dpTo.next();
        }
      }
      __dateFixTo = true;
    }
  }
}

function onHideTo(dp, animationCompleted) {
  if (!animationCompleted) {
    $("#calHint2").css("opacity", "0");
  }
}

function onSelectFrom(fd, date) {
  if (date) {
    dateFrom = date;
    dpTo.update();
    trySubmit();
  }
}

function onSelectTo(fd, date) {
  if (date) {
    dateTo = date;
    trySubmit();
  }
}

function trySubmit() {
  if (!dateFrom || !dateTo) {
    console.log("You have to pick 2 dates");
    return;
  }

  var dataFeed = dynamicContent.Feed_template_creative[0];
  var locale =
    dataFeed.language.toLowerCase() + "_" + dataFeed.country.toLowerCase();
  var tourData =
    dynamicContent.Feed_template__Supersonic_Yours_Routes_Feed[tourIndex];

  var exitURL =
    "https://www.Yours.com/" +
    locale +
    "/apps/personas/booking?" +
    "fecha1_dia=" +
    pad(dateFrom.getDate(), 2) +
    "&fecha1_anomes=" +
    dateFrom.getFullYear() +
    "-" +
    pad(dateFrom.getMonth() + 1, 2) +
    "&fecha2_dia=" +
    pad(dateTo.getDate(), 2) +
    "&fecha2_anomes=" +
    dateTo.getFullYear() +
    "-" +
    pad(dateTo.getMonth() + 1, 2) +
    "&from_city1=" +
    tourData.Origin_IATA +
    "&to_city1=" +
    tourData.Destination_IATA +
    "&from_city2=" +
    tourData.Destination_IATA +
    "&to_city2=" +
    tourData.Origin_IATA +
    "&auAvailability=1" +
    "&ida_vuelta=ida_vuelta" +
    "&vuelos_origen=" +
    encodeURI(tourData.Origin_Name) +
    "&vuelos_destino=" +
    encodeURI(tourData.Destination_Name) +
    "&flex=1" +
    "&vuelos_fecha_salida_ddmmaaaa=" +
    pad(dateFrom.getDate(), 2) +
    "/" +
    pad(dateFrom.getMonth() + 1, 2) +
    "/" +
    dateFrom.getFullYear() +
    "&vuelos_fecha_regreso_ddmmaaaa=" +
    pad(dateTo.getDate(), 2) +
    "/" +
    pad(dateTo.getMonth() + 1, 2) +
    "/" +
    dateTo.getFullYear() +
    "&cabina=Y&nadults=1&nchildren=0&ninfants=0&cod_promo=" +
    "&utm_source=DV360&utm_medium=display_perf&utm_campaign=CL-performance-supersonic-estructural&utm_content=CL_cadreon_performance_DV360_banner_" +
    tourData.Origin_IATA +
    "_" +
    tourData.Destination_IATA +
    "-DOM";

  Enabler.counter(EVENT_EXIT, true);
  Enabler.reportCustomVariableCount1(
    tourData.Origin_IATA + "-" + tourData.Destination_IATA
  );
  Enabler.reportCustomVariableCount2(dateFrom + "-" + dateTo);
  console.log("Event fired: " + EVENT_EXIT);
  Enabler.exitOverride("customExit", exitURL);
}

var dpFrom, dpTo;

function initDatePicker() {
  var options = {
    dateFormat: "dd/mm/yyyy",
    language: "es",
    offset: 0,
    autoClose: true
  };

  options.onRenderCell = onRenderCellFrom;
  options.onShow = onShowFrom;
  options.onHide = onHideFrom;
  options.onSelect = onSelectFrom;
  dpFrom = $("#inputFrom")
    .datepicker(options)
    .data("datepicker");
  options.onRenderCell = onRenderCellTo;
  options.onShow = onShowTo;
  options.onHide = onHideTo;
  options.onSelect = onSelectTo;
  dpTo = $("#inputTo")
    .datepicker(options)
    .data("datepicker");
}

function init() {
  $(".tour").on("click", function() {
    Enabler.counter(EVENT_TOUR_CLICKED, true);
    console.log("Event fired: " + EVENT_TOUR_CLICKED);

    var id = $(this).attr("id");
    var index = parseInt(id.substr(4), 10);

    tourIndex = index;
    var photo = $("#photo > .img");
    photo.css("background", "none");
    photo.fadeOut(0);

    var bgUrl =
      dynamicContent.Feed_template__Supersonic_Yours_Routes_Feed[tourIndex]
        .Image_URL.Url;
    $("<img/>")
      .attr("src", bgUrl)
      .on("load", function() {
        $(this).remove();
        photo.css("background", "url(" + bgUrl + ") no-repeat 50% 50%");
        photo.css("background-size", "cover");
        photo.fadeIn(1000);
      });

    $("#row1 div:nth-child(1)").text(
      dynamicContent.Feed_template__Supersonic_Yours_Routes_Feed[tourIndex]
        .Origin_Name
    );
    $("#row1 div:nth-child(2)").text(
      dynamicContent.Feed_template__Supersonic_Yours_Routes_Feed[tourIndex]
        .Destination_Name
    );

    // setup dates and datepicker
    FEED.datesFrom = dynamicContent.Feed_template__Supersonic_Yours_Routes_Feed[
      tourIndex
    ].High_disponibility_dates_1.split(";");
    FEED.datesTo = dynamicContent.Feed_template__Supersonic_Yours_Routes_Feed[
      tourIndex
    ].High_disponibility_dates_2.split(";");
    processFeedDates();
    initDatePicker();

    $("#tourSelect").addClass("hide");
    $("#slogan").fadeOut(500);
  });

  $("#btnBack").on("click", function() {
    Enabler.counter(EVENT_BACK_CLICKED, true);
    console.log("Event fired: " + EVENT_BACK_CLICKED);

    $("#tourSelect").removeClass("hide");
    $("#slogan").fadeIn(500);
  });

  $("#btnGo").on("click", function() {
    var dataFeed = dynamicContent.Feed_template_creative[0];
    var locale =
      dataFeed.language.toLowerCase() + "_" + dataFeed.country.toLowerCase();

    console.log(dataFeed);

    var tourData =
      dynamicContent.Feed_template__Supersonic_Yours_Routes_Feed[tourIndex];
    var dateFrom = new Date(tourData.Price_Date);
    // Compensating for any timezone offset and setting the date to 00:00 for the user's timezone
    dateFrom.setTime(
      dateFrom.getTime() + dateFrom.getTimezoneOffset() * 60 * 1000
    );
    var exitURL =
      "https://www.Yours.com/" +
      locale +
      "/apps/personas/booking?" +
      "fecha1_dia=" +
      pad(dateFrom.getDate(), 2) +
      "&fecha1_anomes=" +
      dateFrom.getFullYear() +
      "-" +
      pad(dateFrom.getMonth() + 1, 2) +
      "&from_city1=" +
      tourData.Origin_IATA +
      "&to_city1=" +
      tourData.Destination_IATA +
      "&auAvailability=1" +
      "&ida_vuelta=ida" +
      "&vuelos_origen=" +
      encodeURI(tourData.Origin_Name) +
      "&vuelos_destino=" +
      encodeURI(tourData.Destination_Name) +
      "&flex=1" +
      "&vuelos_fecha_salida_ddmmaaaa=" +
      pad(dateFrom.getDate(), 2) +
      "/" +
      pad(dateFrom.getMonth() + 1, 2) +
      "/" +
      dateFrom.getFullYear() +
      "&cabina=Y&nadults=1&nchildren=0&ninfants=0&cod_promo=" +
      "&utm_source=DV360&utm_medium=display_perf&utm_campaign=CL-performance-supersonic-estructural&utm_content=CL_cadreon_performance_DV360_banner_" +
      tourData.Origin_IATA +
      "_" +
      tourData.Destination_IATA +
      "-DOM";

    Enabler.counter(EVENT_BUYNOW_CLICKED, true);
    console.log("Event fired: " + EVENT_BUYNOW_CLICKED);
    Enabler.exitOverride("Buy now button", exitURL);
  });

  $("#calFrom").click(function() {
    Enabler.counter(EVENT_FROM_CAL_CLICKED, true);
    console.log("Event fired: " + EVENT_FROM_CAL_CLICKED);
    dpFrom.show();
  });

  $("#calTo").click(function() {
    Enabler.counter(EVENT_TO_CAL_CLICKED, true);
    console.log("Event fired: " + EVENT_TO_CAL_CLICKED);
    dpTo.show();
  });

  if (Enabler.isInitialized()) {
    enablerInitHandler();
  } else {
    Enabler.addEventListener(
      studio.events.StudioEvent.INIT,
      enablerInitHandler
    );
  }
  function enablerInitHandler(evt) {
    if (Enabler.isPageLoaded()) {
      pageLoadedHandler();
    } else {
      Enabler.addEventListener(
        studio.events.StudioEvent.PAGE_LOADED,
        pageLoadedHandler
      );
    }
  }
  function pageLoadedHandler(evt) {
    if (Enabler.isVisible()) {
      adVisibilityHandler();
    } else {
      Enabler.addEventListener(
        studio.events.StudioEvent.VISIBLE,
        adVisibilityHandler
      );
    }
    setupDynamicValues();
  }
  function adVisibilityHandler() {
    $("#loading").remove();
  }
}

$(function() {
  init();
});
