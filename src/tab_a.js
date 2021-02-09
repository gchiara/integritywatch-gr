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
  page: 'tabA',
  loader: true,
  readMore: false,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  chartMargin: 40,
  instFilter: 'all',
  charts: {
    party: {
      title: 'Πολιτικά Κόμματα',
      info: 'Το γράφημα εμφανίζει τα έσοδα από τις δηλώσεις περιουσιακής κατάστασης των βουλευτών βάσει του κόμματος στο οποίο ανήκουν. Eπιλέγοντας ένα ή περισσότερα κόμματα μπορείτε να συγκρίνετε τα αντίστοιχα δεδομένα στα διπλανά γραφήματα.'
    },
    income: {
      title: 'Ετήσια δηλωμένα έσοδα',
      info: 'Το γράφημα εμφανίζει την κατανομή των συνολικών ετήσιων εσόδων των βουλευτών.'
    },
    topRevenue: {
      title: 'Υψηλότερα έσοδα- top 10',
      info: 'Το γράφημα εμφανίζει τους δέκα βουλευτές με τα υψηλότερα συνολικά έσοδα.'
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Πίνακας βουλευτών',
      info: 'Στον παρακάτω πίνακα εμφανίζονται αναλυτικά τα δεδομένα των βουλευτών ως προς το πολιτικό κόμμα στο οποίο ανήκουν, το σύνολο των δηλωθέντων εσόδων, τον αριθμό των πηγών εσόδων, την ημερομηνία δήλωσης του εσόδου και το ποια είναι η υψηλότερη πηγή εσόδων.'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  colors: {
    default1: "#2b90b8",
    revenue: {
      "> 100.000€": "#0d506b",
      "50.001€ - 100.000€": "#0e6386",
      "10.001€ - 50.000€": "#1d7598",
      "5.001—10.000€": "#2b90b8",
      "1.001—5.000€": "#55aacb",
      "1€ - 1.000€": "#81c1da",
      "Καθόλου εισόδημα": "#a9d4e6",
      "/": "#ccc",
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
  income: {
    chart: dc.pieChart("#income_chart"),
    type: 'pie',
    divId: 'income_chart'
  },
  topRevenue: {
    chart: dc.rowChart("#topRevenue_chart"),
    type: 'row',
    divId: 'topRevenue_chart'
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
//Get income category
function getIncomeCategory(totAmt) {
  if(totAmt == 0) {
    return "Καθόλου εισόδημα";
  } else if(totAmt <= 1000) {
    return "1€ - 1.000€";
  } else if(totAmt <= 5000) {
    return "1.001—5.000€";
  } else if(totAmt <= 10000) {
    return "5.001—10.000€";
  } else if(totAmt <= 50000) {
    return "10.001€ - 50.000€";
  } else if(totAmt <= 100000) {
    return "50.001€ - 100.000€";
  } else if(totAmt > 100000) {
    return "> 100.000€";
  }
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
    var iniTotReveue = 0;
    _.each(mps, function (d) {
      d.declaration = {};
      var thisDec = _.find(declarations, function (dec) { return dec.id == d.ID });
      if(thisDec) {
        d.declaration = thisDec;
      }
      //Party name edit
      /*
      if(d.Party_GR == "Κομμουνιστικό Κόμμα Ελλάδας") {
        d.Party_GR = "ΚΟΜΜΟΥΝΙΣΤΙΚΟ ΚΟΜΜΑ ΕΛΛΑΔΑΣ";
      }
      */
      //Loop through declarations data to apply fixes and calculations
      if(d.declaration.id) {
        //Get tot and top revenues
        d.declaration.totRevenue = 0;
        d.declaration.totRevenueSpouse = 0;
        d.declaration.topRevenue = {};
        d.declaration.revenueNum = 0;
        d.declaration.ownRevenues = [];
        _.each(d.declaration.revenue, function (r) {
          if(r.receipt == "ΥΠΟΧΡΕΟΣ"){
            d.declaration.revenueNum ++;
            d.declaration.ownRevenues.push(r);
            d.declaration.totRevenue += parseAmount(r.amount);
            if(!d.declaration.topRevenue.amount || parseAmount(d.declaration.topRevenue.amount) < parseAmount(r.amount)) {
              d.declaration.topRevenue = r;
            }
          } else if(r.receipt == "ΣΥΖΥΓΟΣ") {
            d.declaration.totRevenueSpouse += parseAmount(r.amount);
          }
        });
        d.declaration.totRevenue = d.declaration.totRevenue.toFixed(2);
        d.declaration.newestDecDate = "/";
        //Get income category
        d.declaration.incomeCategory = getIncomeCategory(d.declaration.totRevenue);
        //Add totRevenue to overall total to initialize footer counter
        iniTotReveue += parseFloat(d.declaration.totRevenue);
      }
    });
  

    //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
    var ndx = crossfilter(mps);
    var searchDimension = ndx.dimension(function (d) {
        var entryString = ' ' + d.Last_name.toLowerCase() + ' ' + d.First_name.toLowerCase();
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
        .height(500)
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
    var createIncomeChart = function() {
      var chart = charts.income.chart;
      var dimension = ndx.dimension(function (d) {
        if(d.declaration.incomeCategory) {
          return d.declaration.incomeCategory; 
        } else {
          return "/";
        }
      });
      var group = dimension.group().reduceSum(function (d) { return 1; });
      var sizes = calcPieSize(charts.income.divId);
      var order = ["Καθόλου εισόδημα", "1€ - 1.000€", "1.001—5.000€", "5.001—10.000€", "10.001€ - 50.000€", "50.001€ - 100.000€", "> 100.000€", "/"]
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
          return vuedata.colors.revenue[d.key];
        })
        .group(group);

      chart.render();
    }

    //CHART 3
    var createTopRevenueChart = function() {
      var chart = charts.topRevenue.chart;
      var dimension = ndx.dimension(function (d) {
        return d.First_name + ' ' + d.Last_name;
      });
      var group = dimension.group().reduceSum(function (d) {
        if(d.declaration.totRevenue) {
          return d.declaration.totRevenue;
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
      var width = recalcWidth(charts.topRevenue.divId);
      var charsLength = recalcCharsLength(width);
      chart
        .width(width)
        .height(500)
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
              return d.First_name + ' ' + d.Last_name;
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
              return d.declaration.totRevenue;
            }
          },
          {
            "searchable": false,
            "orderable": true,
            "targets": 4,
            "defaultContent":"N/A",
            "data": function(d) {
              if(d.declaration.revenue) {
                return d.declaration.ownRevenues.length;
              }
              return '0';
            }
          },
          {
            "searchable": false,
            "orderable": true,
            "targets": 5,
            "defaultContent":"N/A",
            "data": function(d) {
              if(d.declaration) {
                return d.declaration.year;
              }
              return '/';
            }
          },
          {
            "searchable": false,
            "orderable": true,
            "targets": 6,
            "defaultContent":"N/A",
            "data": function(d) {
              if(d.declaration.topRevenue && d.declaration.topRevenue.type) {
                return d.declaration.topRevenue.type;
              }
              return '/';
            }
          },
        ],
        "iDisplayLength" : 25,
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": false,
        "order": [[ 1, "desc" ]],
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
    createIncomeChart();
    createTopRevenueChart();
    //createBusinessChart();
    //createLimitationsChart();
    createTable();

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

    function drawRevenueCounter() {
      var dim = ndx.dimension (function(d) {
        return d.Last_name;
      });
      var group = dim.group().reduce(
        function(p,d) {  
          p.nb +=1;
          if (!d.Last_name || !d.declaration.totRevenue) {
            return p;
          }
          p.revenue += +d.declaration.totRevenue;
          return p;
        },
        function(p,d) {  
          p.nb -=1;
          if (!d.Last_name || !d.declaration.totRevenue) {
            return p;
          }
          p.revenue -= d.declaration.totRevenue;
          return p;
        },
        function(p,d) {  
          return {nb: 0, revenue:0}; 
        }
      );
      group.order(function(p){ return p.nb });
      var revenue = 0;

      var counter = dc.dataCount(".count-box-revenue")
      .dimension(group)
      .group({value: function() {
        revenue = 0;
        return group.all().filter(function(kv) {
          if (kv.value.nb >0) {
            revenue += +kv.value.revenue;
          }
          return kv.value.nb > 0; 
        }).length;
      }})
      .renderlet(function (chart) {
        $(".count-box-revenue .filter-count").text(addcommas(Math.round(revenue)) + ' €');
        $(".count-box-revenue .total-count").text(addcommas(Math.round(iniTotReveue)) + ' €');
        revenue = 0;
      });
      counter.render();
    }
    drawRevenueCounter();

    //Window resize function
    window.onresize = function(event) {
      resizeGraphs();
    };
  })
})
