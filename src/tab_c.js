import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
require( 'datatables.net' )( window, $ )
require( 'datatables.net-dt' )( window, $ )

import underscore from 'underscore';
window.underscore = underscore;
window._ = underscore;

import '../public/vendor/js/popper.min.js'
import '../public/vendor/js/bootstrap.min.js'
import { csv } from 'd3-request'
import { json } from 'd3-request'

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';


// Data object - is also used by Vue

var vuedata = {
  page: 'tabC',
  loader: true,
  readMore: false,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  chartMargin: 40,
  instFilter: 'all',
  charts: {
    party: {
      title: 'Πολιτικό κόμμα',
      info: 'Το γράφημα εμφανίζει τα ακίνητα από τις δηλώσεις περιουσιακής κατάστασης των βουλευτών βάσει του κόμματος στο οποίο ανήκουν. Eπιλέγοντας ένα ή περισσότερα κόμματα μπορείτε να συγκρίνετε τα αντίστοιχα δεδομένα στα διπλανά γραφήματα'
    },
    properties: {
      title: 'Αριθμός ακινήτων',
      info: 'Το γράφημα εμφανίζει τον αριθμό των δηλωμένων ακινήτων των Βουλευτών σε 6 κατηγορίες. Επιλέξτε μια ή περισσότερες κατηγορίες και τα διπλανά γραφήματα θα προσαρμοστούν αυτόματα.'
    },
    businesses: {
      title: 'Αριθμός δηλωθείσας ιδιοκτησίας επιχείρησης',
      info: ''
    },
    topProperties: {
      title: 'δηλωμένα ακίνητα',
      info: 'Το γράφημα εμφανίζει τους 10 Βουλευτές που έχουν δηλώσει τα περισσότερα ακίνητα. Επιλέξτε έναν ή περισσότερους Βουλευτές και τα διπλανά γραφήματα θα προσαρμοστούν αυτόματα.'
    },
    types: {
      title: 'Είδη ακινήτων',
      info: 'Το γράφημα εμφανίζει τα διαφορετικά είδη ακινήτων που δήλωσαν οι Βουλευτές. Επιλέξτε ένα ή περισσότερα είδη και τα διπλανά γραφήματα θα προσαρμοστούν αυτόματα.'
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Μέλη του Κοινοβουλίου',
      info: ''
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  typeStreamlined: {
    "ΔΙΑΜΕΡΙΣΜΑ":"ΔΙΑΜΕΡΙΣΜΑ",
    "ΟΙΚΟΠΕΔΟ":"ΟΙΚΟΠΕΔΟ",
    "ΑΠΟΘΗΚΗ":"ΑΠΟΘΗΚΗ",
    "ΕΠΑΓΓΕΛΜΑΤΙΚ Η ΣΤΕΓΗ /  ΚΑΤΑΣΤΗΜΑ":"ΕΠΑΓΓΕΛΜΑΤΙΚ Η ΣΤΕΓΗ /  ΚΑΤΑΣΤΗΜΑ",
    "ΜΟΝΟΚΑΤΟΙΚΙ Α":"ΜΟΝΟΚΑΤΟΙΚΙ Α",
    "ΔΕΝΔΡΟΚΑΛΛΙ ΕΡΓΕΙΑ":"ΔΕΝΔΡΟΚΑΛΛΙ ΕΡΓΕΙΑ",
    "ΚΑΛΛΙΕΡΓΕΙΑ":"ΚΑΛΛΙΕΡΓΕΙΑ",
    "ΒΟΣΚΟΤΟΠΟΣ /  ΧΕΡΣΕΕΣ ΜΗ  ΚΑΛΛΙΕΡΓΗΣΙΜ ΕΣ ΕΚΤΑΣΕΙΣ":"ΒΟΣΚΟΤΟΠΟΣ /  ΧΕΡΣΕΕΣ ΜΗ  ΚΑΛΛΙΕΡΓΗΣΙΜ",
    "ΔΙΚΑΙΩΜΑ  ΥΨΟΥΝ":"ΔΙΚΑΙΩΜΑ  ΥΨΟΥΝ",
    "ΒΟΣΚΟΤΟΠΟΣ /  ΧΕΡΣΕΕΣ ΜΗ  ΚΑΛΛΙΕΡΓΗΣΙΜ":"ΒΟΣΚΟΤΟΠΟΣ /  ΧΕΡΣΕΕΣ ΜΗ  ΚΑΛΛΙΕΡΓΗΣΙΜ",
    "ΕΣ ΕΚΤΑΣΕΙΣ":"ΕΣ ΕΚΤΑΣΕΙΣ",
    "ΒΟΣΚΟΤΟΠΟΣ /  ΧΕΡΣΕΕΣ ΜΗ":"ΒΟΣΚΟΤΟΠΟΣ /  ΧΕΡΣΕΕΣ ΜΗ",
    "ΚΑΛΛΙΕΡΓΗΣΙΜ ΕΣ ΕΚΤΑΣΕΙΣ":"ΚΑΛΛΙΕΡΓΕΙΑ",
    "ΔΑΣΙΚΗ  ΕΚΤΑΣΗ":"ΔΑΣΙΚΗ  ΕΚΤΑΣΗ",
    "ΘΕΣΗ  ΣΤΑΘΜΕΥΣΗΣ":"ΘΕΣΗ  ΣΤΑΘΜΕΥΣΗΣ",
    "ΒΙΟΤΕΧΝΙΚΟ/BI OMHXANIKO  ΚΤΙΡΙΟ":"ΒΙΟΤΕΧΝΙΚΟ/BI OMHXANIKO  ΚΤΙΡΙΟ",
    "ΑΛΛΗ  ΠΕΡΙΠΤΩΣΗ":"ΑΛΛΗ  ΠΕΡΙΠΤΩΣΗ",
    "ΕΠΑΓΓΕΛΜΑΤΙΚ Η ΣΤΕΓΗ /":"ΕΠΑΓΓΕΛΜΑΤΙΚ Η ΣΤΕΓΗ /",
    "ΚΑΤΑΣΤΗΜΑ":"ΕΠΑΓΓΕΛΜΑΤΙΚ Η ΣΤΕΓΗ /  ΚΑΤΑΣΤΗΜΑ",
    "ΕΠΑΓΓΕΛΜΑΤΙΚ":"ΕΠΑΓΓΕΛΜΑΤΙΚ Η ΣΤΕΓΗ /  ΚΑΤΑΣΤΗΜΑ",
    "Η ΣΤΕΓΗ /  ΚΑΤΑΣΤΗΜΑ":"ΕΠΑΓΓΕΛΜΑΤΙΚ Η ΣΤΕΓΗ /  ΚΑΤΑΣΤΗΜΑ",
    "ΔΕΝΔΡΟΚΑΛΛΙ":"ΔΕΝΔΡΟΚΑΛΛΙ ΕΡΓΕΙΑ",
    "ΕΡΓΕΙΑ":"ΕΡΓΕΙΑ",
    "ΑΛΛΟΣ  ΒΟΗΘΗΤΙΚΟΣ  ΧΩΡΟΣ": "ΑΛΛΟΣ  ΒΟΗΘΗΤΙΚΟΣ  ΧΩΡΟΣ",
    "ΑΛΛΗ ΠΕΡΙΠΤΩΣΗ": "ΑΛΛΗ ΠΕΡΙΠΤΩΣΗ",
    "":"Δεν αναφέρεται"
  },
  colors: {
    default1: "#2b90b8",
    properties: {
      ">30": "#07425a",
      "20-30": "#0d506b",
      "10-20": "#0e6386",
      "5-10": "#55aacb",
      "1-5": "#a9d4e6",
      "Δεν έχουν δηλωθεί ακίνητα": "#ccc",
    },
    businesses: {
      ">10": "#0d506b",
      "6-10": "#0e6386",
      "3-5": "#55aacb",
      "1-2": "#a9d4e6",
      "Δεν έχουν δηλωθεί επιχειρήσεις": "#ccc",
    },
  }
}



//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    //Share
    downloadDataset: function () {
      window.open('./data/declarations.json');
    },
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = '' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        var toShareUrl = 'https://integritywatch.gr';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})

//Charts
var charts = {
  party: {
    chart: dc.rowChart("#party_chart"),
    type: 'row',
    divId: 'party_chart'
  },
  properties: {
    chart: dc.pieChart("#properties_chart"),
    type: 'pie',
    divId: 'properties_chart'
  },
  /*
  businesses: {
    chart: dc.pieChart("#businesses_chart"),
    type: 'pie',
    divId: 'businesses_chart'
  },
  */
  topProperties: {
    chart: dc.rowChart("#topProperties_chart"),
    type: 'row',
    divId: 'topProperties_chart'
  },
  types: {
    chart: dc.rowChart("#types_chart"),
    type: 'row',
    divId: 'types_chart'
  },
  mainTable: {
    chart: null,
    type: 'table',
    divId: 'dc-data-table'
  }
}

//Functions for responsivness
var recalcWidth = function(divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function() {
  //Replace element if with wordcloud column id
  var width = document.getElementById("party_chart").offsetWidth - vuedata.chartMargin*2;
  return [width, 550];
};
var recalcCharsLength = function(width) {
  return parseInt(width / 8);
};
var calcPieSize = function(divId) {
  var newWidth = recalcWidth(divId);
  if(newWidth > 400) {
    newWidth = 400;
  }
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth < 300) { 
    sizes.height = newWidth + 170;
    sizes.radius = (newWidth)/2;
    sizes.innerRadius = (newWidth)/4;
    sizes.cy = (newWidth)/2;
    sizes.legendY = (newWidth) + 30;
  } else {
    sizes.height = newWidth*0.75 + 170;
    sizes.radius = (newWidth*0.75)/2;
    sizes.innerRadius = (newWidth*0.75)/4;
    sizes.cy = (newWidth*0.75)/2;
    sizes.legendY = (newWidth*0.75) + 30;
  }
  return sizes;
};
var resizeGraphs = function() {
  for (var c in charts) {
    var sizes = calcPieSize(charts[c].divId);
    var newWidth = recalcWidth(charts[c].divId);
    var charsLength = recalcCharsLength(newWidth);
    if(charts[c].type == 'row'){
      charts[c].chart.width(newWidth);
      charts[c].chart.label(function (d) {
        var thisKey = d.key;
        if(thisKey.indexOf('###') > -1){
          thisKey = thisKey.split('###')[0];
        }
        if(thisKey.length > charsLength){
          return thisKey.substring(0,charsLength) + '...';
        }
        return thisKey;
      })
      charts[c].chart.redraw();
    } else if(charts[c].type == 'bar') {
      charts[c].chart.width(newWidth);
      charts[c].chart.rescale();
      charts[c].chart.redraw();
    } else if(charts[c].type == 'pie') {
      charts[c].chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(dc.legend().x(0).y(sizes.legendY).gap(10).legendText(function(d) { 
          var thisKey = d.name;
          if(thisKey.length > charsLength){
            return thisKey.substring(0, charsLength) + '...';
          }
          return thisKey;
        }));
      charts[c].chart.redraw();
    } else if(charts[c].type == 'cloud') {
      charts[c].chart.size(recalcWidthWordcloud());
      charts[c].chart.redraw();
    }
  }
};

//Add commas to thousands
function addcommas(x){
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}
//Parse amount floats with dot as decimal separator and comma as thousands separator
function parseAmount(amount) {
  var parseAmt = amount.replace(/\./g, '');
  parseAmt = parseFloat(parseAmt.replace(/,/g, '.'));
  return parseAmt;
}
//Custom date order for dataTables
var dmy = d3.timeParse("%d/%m/%Y");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    if(date.indexOf("Cancelled") > -1){
      date = date.split(" ")[0];
    }
      return dmy(date);
  },
  "date-eu-asc": function ( a, b ) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Generate random parameter for dynamic dataset loading (to avoid caching)
var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}
//Load data and generate charts
var lobbyist_typeList = {}
csv('./data/mp-list.csv?' + randomPar, (err, mps) => {
  json('./data/declarations.json?' + randomPar, (err, declarations) => {
    //Loop through list to get declaration
    var iniTotProperties = 0;
    var iniTotBusinesses = 0;
    var propertyTypes = [];
    _.each(mps, function (d) {
      //Prepare the needed parameters that we had in the old list
      d.ID = '';
      if(d.Link_DOI !== '') {
        d.ID = d.Link_DOI.split('/').slice(-1)[0].replace('.pdf','');
      }
      /*
      d.Party_EN = '';
      d.Party_GR = '';
      if(d.Τitle.split('-').length > 1) {
        var partyString = d.Τitle.split('-')[1];
        d.Party_EN = partyString.split('(')[0].trim();
        if(partyString.indexOf('(') > -1) {
          d.Party_GR = partyString.split('(')[1].replace(')','').trim();
        }
      }
      */
      if(d.Party_GR == 'ΜΕΡΑ25' || d.Party_GR == 'Μέρα25' || d.Party_GR == 'ΜΕΡΑ 25') {
        d.Party_GR = 'ΜΕΡΑ25';
      }
      if(d.Party_GR == 'Δημοκρατική Συμπαράταξη' || d.Party_GR == 'Δημκρατική Συμπαράταξη' || d.Party_GR == 'Δημοκρατκή Συμπαράταξη') {
        d.Party_GR = 'Δημοκρατική Συμπαράταξη';
      }
      if(d.Party_GR == 'Νέα Δημοκαρτία') {
        d.Party_GR = 'Νέα Δημοκρατία';
      }
      //Find declarations
      d.declaration = {};
      var thisDec = _.find(declarations, function (dec) { return dec.urlString == d.ID });
      if(thisDec) {
        d.declaration = thisDec;
      }
      d.propertyTypes = [];
      //Loop through declarations data to apply fixes and calculations
      if(d.declaration.id) {
        d.propertiesAmt = 0;
        //Get properties
        d.declaration.propertiesCategory = "Δεν έχουν δηλωθεί ακίνητα";
        if(d.declaration.property1) {
          var propertiesToKeep = [];
          d.declaration.ownProperty1 = [];
          d.declaration.ownProperty2 = [];
          //In some cases it might have happened that the same row got split between 2 pdf pages, let's see if we can merge them
          var fixedPropertyEntries = [];
          var indexesToSkip = [];
          _.each(d.declaration.property1, function (x, i) {
            if((x.type == "ΜΟΝΟΚΑΤΟΙΚΙ" && d.declaration.property1[i+1].type == "Α") || (x.type == "ΑΛΛΗ" && d.declaration.property1[i+1].type == "ΠΕΡΙΠΤΩΣΗ")) {
              var rowToMerge = d.declaration.property1[i+1];
              _.each(rowToMerge, function (xVal, xKey) {
                x[xKey] = x[xKey] + ' ' + rowToMerge[xKey];
              });
              indexesToSkip.push(i+1);
            }
            if(indexesToSkip.indexOf(i) == -1) {
              fixedPropertyEntries.push(x);
            }
          });
          d.declaration.property1 = fixedPropertyEntries;
          //End of row merging fix
          _.each(d.declaration.property1, function (x, i) {
            x.streamlinedType = vuedata.typeStreamlined[x.type];
            d.propertyTypes.push(x.streamlinedType);
            if(!x.streamlinedType) {
              console.log(x.type);
              console.log(x);
              console.log(d.declaration.property1[i+1]);
              console.log(d);
            }
            if(x.holder !== "ΣΥΖΥΓΟΣ") {
              propertiesToKeep.push(x.aa.replace("  "," "));
              d.declaration.ownProperty1.push(x);
            }
          });
          _.each(d.declaration.property2, function (x, i) {
            if(propertiesToKeep.indexOf(x.aa.replace("  "," ")) > -1) {
              d.declaration.ownProperty2.push(x);
            }
          });
          d.propertiesAmt += d.declaration.ownProperty1.length;
          iniTotProperties += d.propertiesAmt;
          if(d.propertiesAmt == 0) {
            d.declaration.propertiesCategory = "Δεν έχουν δηλωθεί ακίνητα";
          } else if(d.propertiesAmt <= 5) {
            d.declaration.propertiesCategory = "1-5";
          } else if(d.propertiesAmt <= 10) {
            d.declaration.propertiesCategory = "5-10";
          } else if(d.propertiesAmt <= 20) {
            d.declaration.propertiesCategory = "10-20";
          } else if(d.propertiesAmt <= 30) {
            d.declaration.propertiesCategory = "20-30";
          } else {
            d.declaration.propertiesCategory = ">30";
          }
        }
        //Get businesses
        d.declaration.businessesCategory = "Δεν έχουν δηλωθεί επιχειρήσεις";
        if(d.declaration.business) {
          var businessesAmt = d.declaration.business.length;
          iniTotBusinesses += businessesAmt;
          if(businessesAmt == 0) {
            d.declaration.businessesCategory = "Δεν έχουν δηλωθεί επιχειρήσεις";
          } else if(businessesAmt <= 2) {
            d.declaration.businessesCategory = "1-2";
          } else if(businessesAmt <= 5) {
            d.declaration.businessesCategory = "3-5";
          } else if(businessesAmt <= 10) {
            d.declaration.businessesCategory = "6-10";
          } else {
            d.declaration.businessesCategory = ">10";
          }
        }
      }
    });

    console.log(propertyTypes);
    //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
    var ndx = crossfilter(mps);
    var searchDimension = ndx.dimension(function (d) {
        var entryString = ' ' + d.Fullname_GR;
        return entryString.toLowerCase();
    });

    //CHART 1
    var createPartyChart = function() {
      var chart = charts.party.chart;
      var dimension = ndx.dimension(function (d) {
        return d.Party_GR;
      });
      var group = dimension.group().reduceSum(function (d) {
          return 1;
      });
      var width = recalcWidth(charts.party.divId);
      var charsLength = recalcCharsLength(width);
      chart
        .width(width)
        .height(510)
        .margins({top: 0, left: 0, right: 0, bottom: 20})
        .group(group)
        .dimension(dimension)
        .colorCalculator(function(d, i) {
          return vuedata.colors.default1;
        })
        .label(function (d) {
          if(d.key && d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
        })
        .title(function (d) {
            return d.key + ': ' + d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);
        //chart.xAxis().tickFormat(numberFormat);
        chart.render();
    }

    //CHART 2
    var createPropertiesChart = function() {
      var chart = charts.properties.chart;
      var dimension = ndx.dimension(function (d) {
        if(d.declaration && d.declaration.propertiesCategory) {
          return d.declaration.propertiesCategory;
        }
        return "Δεν έχουν δηλωθεί ακίνητα";
      });
      var group = dimension.group().reduceSum(function (d) { return 1; });
      var sizes = calcPieSize(charts.properties.divId);
      var order = ["Δεν έχουν δηλωθεί ακίνητα", "1-5", "5-10", "10-20", "20-30", ">30"]
      chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(dc.legend().x(0).y(sizes.legendY).gap(10).legendText(function(d) { 
          var thisKey = d.name;
          if(thisKey.length > 40){
            return thisKey.substring(0,40) + '...';
          }
          return thisKey;
        }))
        .title(function(d){
          var thisKey = d.key;
          return thisKey + ': ' + d.value;
        })
        .dimension(dimension)
        .ordering(function(d) { return order.indexOf(d.key)})
        .colorCalculator(function(d, i) {
          return vuedata.colors.properties[d.key];
        })
        .group(group);

      chart.render();
    }

    //CHART 3
    var createBusinessesChart = function() {
      var chart = charts.businesses.chart;
      var dimension = ndx.dimension(function (d) {
        if(d.declaration && d.declaration.businessesCategory) {
          return d.declaration.businessesCategory;
        }
        return "Δεν έχουν δηλωθεί επιχειρήσεις";
      });
      var group = dimension.group().reduceSum(function (d) { return 1; });
      var sizes = calcPieSize(charts.businesses.divId);
      var order = ["Δεν έχουν δηλωθεί επιχειρήσεις", "1-2", "3-5", "6-10", ">10"]
      chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(dc.legend().x(0).y(sizes.legendY).gap(10).legendText(function(d) { 
          var thisKey = d.name;
          if(thisKey.length > 40){
            return thisKey.substring(0,40) + '...';
          }
          return thisKey;
        }))
        .title(function(d){
          var thisKey = d.key;
          return thisKey + ': ' + d.value;
        })
        .dimension(dimension)
        .ordering(function(d) { return order.indexOf(d.key)})
        .colorCalculator(function(d, i) {
          return vuedata.colors.businesses[d.key];
        })
        .group(group);

      chart.render();
    }

    //CHART 4
    var createTopPropertiesChart = function() {
      var chart = charts.topProperties.chart;
      var dimension = ndx.dimension(function (d) {
        return d.Fullname_GR;
      });
      var group = dimension.group().reduceSum(function (d) {
        if(d.propertiesAmt) {
          return d.propertiesAmt;
        } else {
          return 0;
        }
      });
      var filteredGroup = (function(source_group) {
        return {
          all: function() {
            return source_group.top(10).filter(function(d) {
              return (d.value != 0);
            });
          }
        };
      })(group);
      var width = recalcWidth(charts.topProperties.divId);
      var charsLength = recalcCharsLength(width);
      chart
        .width(width)
        .height(510)
        .margins({top: 0, left: 0, right: 0, bottom: 20})
        .group(filteredGroup)
        .dimension(dimension)
        .colorCalculator(function(d, i) {
          return vuedata.colors.default1;
        })
        .label(function (d) {
          if(d.key && d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
        })
        .title(function (d) {
            return d.key + ': ' + d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);
        //chart.xAxis().tickFormat(numberFormat);
        chart.render();
    }

    //CHART 5
    var createTypesChart = function() {
      var chart = charts.types.chart;
      var dimension = ndx.dimension(function (d) {
        return d.propertyTypes;
      }, true);
      var group = dimension.group().reduceSum(function (d) {
          return 1;
      });
      var width = recalcWidth(charts.types.divId);
      var charsLength = recalcCharsLength(width);
      chart
        .width(width)
        .height(510)
        .margins({top: 0, left: 0, right: 0, bottom: 20})
        .group(group)
        .dimension(dimension)
        .colorCalculator(function(d, i) {
          return vuedata.colors.default1;
        })
        .label(function (d) {
          if(d.key && d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
        })
        .title(function (d) {
            return d.key + ': ' + d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);
        //chart.xAxis().tickFormat(numberFormat);
        chart.render();
    }
    
    //TABLE
    var createTable = function() {
      var count=0;
      charts.mainTable.chart = $("#dc-data-table").dataTable({
        "columnDefs": [
          {
            "searchable": false,
            "orderable": false,
            "targets": 0,   
            data: function ( row, type, val, meta ) {
              return count;
            }
          },
          {
            "searchable": false,
            "orderable": true,
            "targets": 1,
            "defaultContent":"N/A",
            "data": function(d) {
              //id,function,party,institution,date,contact_type,org_name,lobbyist_type,purpose,purpose_details
              return d.Fullname_GR;
            }
          },
          {
            "searchable": false,
            "orderable": true,
            "targets": 2,
            "defaultContent":"N/A",
            "data": function(d) {
              return d.Party_GR;
            }
          },
          {
            "searchable": false,
            "orderable": true,
            "targets": 3,
            "defaultContent":"N/A",
            "data": function(d) {
              return d.propertiesAmt;
            }
          },
          /*
          {
            "searchable": false,
            "orderable": true,
            "targets": 4,
            "defaultContent":"N/A",
            "data": function(d) {
              if(d.declaration.business) {
                return d.declaration.business.length;
                }
                return "/";
            }
          },
          */
          {
            "searchable": false,
            "orderable": true,
            "targets": 4,
            "defaultContent":"N/A",
            "data": function(d) {
              if(d.declaration) {
                return d.declaration.year;
              }
              return '/';
            }
          },
        ],
        "iDisplayLength" : 25,
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": false,
        "order": [[ 1, "asc" ]],
        "bSort": true,
        "bInfo": true,
        "bAutoWidth": false,
        "bDeferRender": true,
        "aaData": searchDimension.top(Infinity),
        "bDestroy": true,
      });
      var datatable = charts.mainTable.chart;
      datatable.on( 'draw.dt', function () {
        var PageInfo = $('#dc-data-table').DataTable().page.info();
          datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
              cell.innerHTML = i + 1 + PageInfo.start;
          });
        });
        datatable.DataTable().draw();
        
      $('#dc-data-table tbody').on('click', 'tr', function () {
        var data = datatable.DataTable().row( this ).data();
        vuedata.selectedElement = data;
        $('#detailsModal').modal();
      });
    }
    //REFRESH TABLE
    function RefreshTable() {
      dc.events.trigger(function () {
        var alldata = searchDimension.top(Infinity);
        charts.mainTable.chart.fnClearTable();
        charts.mainTable.chart.fnAddData(alldata);
        charts.mainTable.chart.fnDraw();
      });
    }

    //SEARCH INPUT FUNCTIONALITY
    var typingTimer;
    var doneTypingInterval = 1000;
    var $input = $("#search-input");
    $input.on('keyup', function () {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });
    $input.on('keydown', function () {
      clearTimeout(typingTimer);
    });
    function doneTyping () {
      var s = $input.val().toLowerCase();
      searchDimension.filter(function(d) { 
        return d.indexOf(s) !== -1;
      });
      throttle();
      var throttleTimer;
      function throttle() {
        window.clearTimeout(throttleTimer);
        throttleTimer = window.setTimeout(function() {
            dc.redrawAll();
        }, 250);
      }
    }

    //Reset charts
    var resetGraphs = function() {
      for (var c in charts) {
        if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
          charts[c].chart.filterAll();
        }
      }
      searchDimension.filter(null);
      $('#search-input').val('');
      dc.redrawAll();
    }
    $('.reset-btn').click(function(){
      resetGraphs();
    })
    
    //Render charts
    createPartyChart();
    createPropertiesChart();
    createTopPropertiesChart();
    createTypesChart();
    createTable();

    //createBusinessesChart();

    $('.dataTables_wrapper').append($('.dataTables_length'));

    //Hide loader
    vuedata.loader = false;

    //COUNTERS
    //Main counter
    var all = ndx.groupAll();
    var counter = dc.dataCount('.dc-data-count')
      .dimension(ndx)
      .group(all);
    counter.render();
    //Update datatables
    counter.on("renderlet.resetall", function(c) {
      RefreshTable();
    });

    function drawCustomCounters() {
      var dim = ndx.dimension (function(d) {
        return d.Fullname_GR;
      });
      var group = dim.group().reduce(
        function(p,d) {  
          p.nb +=1;
          if (!d.Fullname_GR || !d.declaration) {
            return p;
          }
          if(d.propertiesAmt) { p.properties += +d.propertiesAmt; }
          if(d.declaration.business) { p.businesses += +d.declaration.business.length; }
          return p;
        },
        function(p,d) {  
          p.nb -=1;
          if (!d.Fullname_GR || !d.declaration) {
            return p;
          }
          if(d.propertiesAmt) { p.properties -= d.propertiesAmt;}
          if(d.declaration.business) { p.businesses -= d.declaration.business.length; }
          return p;
        },
        function(p,d) {  
          return {nb: 0, properties:0, businesses:0}; 
        }
      );
      group.order(function(p){ return p.nb });
      var properties = 0;
      var businesses = 0;

      var counter = dc.dataCount(".count-box-properties")
      .dimension(group)
      .group({value: function() {
        properties = 0;
        businesses = 0;
        return group.all().filter(function(kv) {
          if (kv.value.nb >0) {
            properties += +kv.value.properties;
            businesses += +kv.value.businesses;
          }
          return kv.value.nb > 0; 
        }).length;
      }})
      .renderlet(function (chart) {
        $(".count-box-properties .filter-count").text(properties);
        $(".count-box-properties .total-count").text(iniTotProperties);
        $(".count-box-businesses .filter-count").text(businesses);
        $(".count-box-businesses .total-count").text(iniTotBusinesses);
        properties = 0;
        businesses = 0;
      });
      counter.render();
    }
    drawCustomCounters();

    //Window resize function
    window.onresize = function(event) {
      resizeGraphs();
    };
  })
})
