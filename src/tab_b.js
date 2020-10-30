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
  page: 'tabB',
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
      info: ''
    },
    investments: {
      title: 'Αριθμός επενδυτικών προϊόντων',
      info: ''
    },
    deposits: {
      title: 'Αριθμός τραπεζικών καταθέσεων',
      info: ''
    },
    topInvestments: {
      title: 'υψηλότερο εισόδημα - top 10',
      info: ''
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
  colors: {
    default1: "#2b90b8",
    investments: {
      ">20": "#0d506b",
      "10-20": "#0e6386",
      "5-10": "#55aacb",
      "1-5": "#a9d4e6",
      "Δεν έχουν δηλωθεί επενδύσεις": "#ccc",
    },
    deposits: {
      ">20": "#0d506b",
      "10-20": "#0e6386",
      "5-10": "#55aacb",
      "1-5": "#a9d4e6",
      "Δεν υπάρχουν τραπεζικές καταθέσεις": "#ccc",
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
      window.open('./data/tab_b/parliament.csv');
    },
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Share text here ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        var toShareUrl = 'https://integritywatch.si';
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
  investments: {
    chart: dc.pieChart("#investments_chart"),
    type: 'pie',
    divId: 'investments_chart'
  },
  deposits: {
    chart: dc.pieChart("#deposits_chart"),
    type: 'pie',
    divId: 'deposits_chart'
  },
  topInvestments: {
    chart: dc.rowChart("#topInvestments_chart"),
    type: 'row',
    divId: 'topInvestments_chart'
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
    var iniTotCompanies = 0;
    var iniTotDeposits = 0;
    _.each(mps, function (d) {
      d.declaration = {};
      var thisDec = _.find(declarations, function (dec) { return dec.id == d.ID });
      if(thisDec) {
        d.declaration = thisDec;
      }
      //Party name edit
      if(d.Party_GR == "Κομμουνιστικό Κόμμα Ελλάδας") {
        d.Party_GR = "ΚΟΜΜΟΥΝΙΣΤΙΚΟ ΚΟΜΜΑ ΕΛΛΑΔΑΣ";
      }
      //Loop through declarations data to apply fixes and calculations
      if(d.declaration.id) {
        //Get investments
        d.declaration.investmentsCategory = "Δεν έχουν δηλωθεί επενδύσεις";
        if(d.declaration.companies) {
          var investmentsAmt = d.declaration.companies.length;
          iniTotCompanies += investmentsAmt;
          if(investmentsAmt == 0) {
            d.declaration.investmentsCategory = "Δεν έχουν δηλωθεί επενδύσεις";
          } else if(investmentsAmt <= 5) {
            d.declaration.investmentsCategory = "1-5";
          } else if(investmentsAmt <= 10) {
            d.declaration.investmentsCategory = "5-10";
          } else if(investmentsAmt <= 20) {
            d.declaration.investmentsCategory = "10-20";
          } else {
            d.declaration.investmentsCategory = ">20";
          }
        }
        //Get bank deposits
        d.declaration.depositsCategory = "Δεν υπάρχουν τραπεζικές καταθέσεις";
        if(d.declaration.bankdeposits) {
          var depositsAmt = d.declaration.bankdeposits.length;
          iniTotDeposits += depositsAmt;
          if(depositsAmt == 0) {
            d.declaration.depositsCategory = "Δεν υπάρχουν τραπεζικές καταθέσεις";
          } else if(depositsAmt <= 5) {
            d.declaration.depositsCategory = "1-5";
          } else if(depositsAmt <= 10) {
            d.declaration.depositsCategory = "5-10";
          } else if(depositsAmt <= 20) {
            d.declaration.depositsCategory = "10-20";
          } else {
            d.declaration.depositsCategory = ">20";
          }
        }
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
    var createInvestmentsChart = function() {
      var chart = charts.investments.chart;
      var dimension = ndx.dimension(function (d) {
        if(d.declaration && d.declaration.investmentsCategory) {
          return d.declaration.investmentsCategory;
        }
        return "Δεν έχουν δηλωθεί επενδύσεις";
      });
      var group = dimension.group().reduceSum(function (d) { return 1; });
      var sizes = calcPieSize(charts.investments.divId);
      var order = ["Δεν έχουν δηλωθεί επενδύσεις", "1-5", "5-10", "10-20", ">20"]
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
          return vuedata.colors.investments[d.key];
        })
        .group(group);

      chart.render();
    }

    //CHART 3
    var createDepositsChart = function() {
      var chart = charts.deposits.chart;
      var dimension = ndx.dimension(function (d) {
        if(d.declaration && d.declaration.depositsCategory) {
          return d.declaration.depositsCategory;
        }
        return "Δεν υπάρχουν τραπεζικές καταθέσεις";
      });
      var group = dimension.group().reduceSum(function (d) { return 1; });
      var sizes = calcPieSize(charts.deposits.divId);
      var order = ["Δεν υπάρχουν τραπεζικές καταθέσεις", "1-5", "5-10", "10-20", ">20"]
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
          return vuedata.colors.deposits[d.key];
        })
        .group(group);

      chart.render();
    }

    //CHART 4
    var createTopInvestmentsChart = function() {
      var chart = charts.topInvestments.chart;
      var dimension = ndx.dimension(function (d) {
        return d.First_name + ' ' + d.Last_name;
      });
      var group = dimension.group().reduceSum(function (d) {
        if(d.declaration.bankdeposits) {
          return d.declaration.bankdeposits.length;
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
      var width = recalcWidth(charts.topInvestments.divId);
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
              if(d.declaration.companies) {
              return d.declaration.companies.length;
              }
              return "/";
            }
          },
          {
            "searchable": false,
            "orderable": true,
            "targets": 4,
            "defaultContent":"N/A",
            "data": function(d) {
              if(d.declaration.bankdeposits) {
                return d.declaration.bankdeposits.length;
                }
                return "/";
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
    createInvestmentsChart();
    createDepositsChart();
    createTopInvestmentsChart();
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

    function drawCustomCounters() {
      var dim = ndx.dimension (function(d) {
        return d.Last_name;
      });
      var group = dim.group().reduce(
        function(p,d) {  
          p.nb +=1;
          if (!d.Last_name || !d.declaration) {
            return p;
          }
          if(d.declaration.companies) { p.companies += +d.declaration.companies.length; }
          if(d.declaration.bankdeposits) { p.deposits += +d.declaration.bankdeposits.length; }
          return p;
        },
        function(p,d) {  
          p.nb -=1;
          if (!d.Last_name || !d.declaration) {
            return p;
          }
          if(d.declaration.companies) { p.companies -= d.declaration.companies.length; }
          if(d.declaration.bankdeposits) { p.deposits -= d.declaration.bankdeposits.length; }
          return p;
        },
        function(p,d) {  
          return {nb: 0, companies:0, deposits:0}; 
        }
      );
      group.order(function(p){ return p.nb });
      var companies = 0;
      var deposits = 0;

      var counter = dc.dataCount(".count-box-companies")
      .dimension(group)
      .group({value: function() {
        companies = 0;
        deposits = 0;
        return group.all().filter(function(kv) {
          if (kv.value.nb >0) {
            companies += +kv.value.companies;
            deposits += +kv.value.deposits;
          }
          return kv.value.nb > 0; 
        }).length;
      }})
      .renderlet(function (chart) {
        $(".count-box-companies .filter-count").text(companies);
        $(".count-box-companies .total-count").text(iniTotCompanies);
        $(".count-box-deposits .filter-count").text(deposits);
        $(".count-box-deposits .total-count").text(iniTotDeposits);
        companies = 0;
        deposits = 0;
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