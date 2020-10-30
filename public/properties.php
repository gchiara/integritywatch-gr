<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>IW GR</title>
    <!-- Add twitter and og meta here -->
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_c.css">
</head>
<body>
    <div id="app" class="tabC">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Title</h1>
                  <p>Lorem ipsum</p>
                  <p><a href="/about.php">Δείτε περισσότερα</a></p>
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW-->
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_1">
              <chart-header :title="charts.party.title" :info="charts.party.info" ></chart-header>
              <div class="chart-inner" id="party_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_2">
              <chart-header :title="charts.properties.title" :info="charts.properties.info" ></chart-header>
              <div class="chart-inner" id="properties_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_2">
              <chart-header :title="charts.businesses.title" :info="charts.businesses.info" ></chart-header>
              <div class="chart-inner" id="businesses_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_3">
              <chart-header :title="charts.topProperties.title" :info="charts.topProperties.info" ></chart-header>
              <div class="chart-inner" id="topProperties_chart"></div>
            </div>
          </div>

          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.mainTable.title" :info="charts.mainTable.info" ></chart-header>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">Αρ.</th> 
                      <th class="header">Όνομα</th>
                      <th class="header">Πολιτικό κόμμα</th>
                      <th class="header">Αριθμός επενδυτικών προϊόντων</th>
                      <th class="header">Αριθμός τραπεζικής κατάθεσης</th>
                      <th class="header">Ημερομηνία της δήλωσης</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- DETAILS MODAL -->
      <div class="modal" id="detailsModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title">
                <div>{{ selectedElement.First_name }} {{ selectedElement.Last_name }}</div>
                <div>{{ selectedElement.Party_GR }} </div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line"><span class="details-line-title">Σύνδεσμος Δήλωσης</span> </div>
                    <div class="details-line"><span class="details-line-title">Προφίλ:</span> <a :href="selectedElement.Link_DOI" target="_blank">{{ selectedElement.Link_DOI }}</a></div>
                    <div class="details-line" v-if="selectedElement.declaration && selectedElement.declaration.property1"><span class="details-line-title">Property1</span></div>
                    <table class="modal-table" v-if="selectedElement.declaration && selectedElement.declaration.property1">
                      <thead>
                        <tr>
                          <th>Επενδυτης</th>
                          <th>Κάτοχος</th>
                          <th>Γεωγραφική κατάσταση</th>
                          <th>τύπος</th>
                          <th>επιφάνεια</th>
                          <th>Νομισμα</th>
                          <th>Χειριστης Μεριδας Επενδυτη</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="e in selectedElement.declaration.property1">
                          <td>{{ e.aa }}</td>
                          <td>{{ e.holder }}</td>
                          <td>{{ e.country }} {{ e.region }} {{ e.municipality }}</td>
                          <td>{{ e.type }}</td>
                          <td>{{ e.surface_major }}</td>
                          <td>{{ e.year_build }}</td>
                          <td>{{ e.year_buy }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="details-line" v-if="selectedElement.declaration && selectedElement.declaration.property2"><span class="details-line-title">Property2</span></div>
                    <table class="modal-table" v-if="selectedElement.declaration && selectedElement.declaration.property2">
                      <thead>
                        <tr>
                          <th>Επενδυτης</th>
                          <th>Κάτοχος</th>
                          <th>χωρητικότητα</th>
                          <th>δικαιώματα και απόκτηση</th>
                          <th>Αξια Πωλησης/ Μεταβιβασης</th>
                          <th>Νομισμα</th>
                          <th>Παρατηρησεις</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="e in selectedElement.declaration.property2">
                          <td>{{ e.aa }}</td>
                          <td>{{ e.holder }}</td>
                          <td>{{ e.capacity }}</td>
                          <td>{{ e.rights }} {{ e.acquisition }}</td>
                          <td>{{ e.value_contract }}</td>
                          <td>{{ e.currency }}</td>
                          <td>{{ e.comments }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="details-line" v-if="selectedElement.declaration && selectedElement.declaration.business"><span class="details-line-title">Business</span></div>
                    <table class="modal-table" v-if="selectedElement.declaration && selectedElement.declaration.business">
                      <thead>
                        <tr>
                          <th>Είδος επιχείρησης</th>
                          <th>Ονομα</th>
                          <th>Χώρα</th>
                          <th>Πληκτρολογήστε συμμετοχή</th>
                          <th>% συμμετοχή</th>
                          <th>Κεφάλαιο</th>
                          <th>Νόμισμα</th>
                          <th>Έναρξη</th>
                          <th>Παρατηρησεις</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="e in selectedElement.declaration.business">
                          <td>{{ e.type_business }}</td>
                          <td>{{ e.names }}</td>
                          <td>{{ e.country }}</td>
                          <td>{{ e.type_participation }}</td>
                          <td>{{ e.percent_participation }}</td>
                          <td>{{ e.capital }}</td>
                          <td>{{ e.currency }}</td>
                          <td>{{ e.year_start }}</td>
                          <td>{{ e.comment }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom bar -->
      <div class="container-fluid footer-bar">
        <div class="row">
          <div class="footer-col col-12 col-sm-12 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>από τους <strong class="total-count">0</strong> βουλευτές
            </div>
            <div class="dc-data-count count-box count-box-properties">
              <div class="filter-count">0</div>από τους <strong class="total-count">0</strong> ιδιότητες
            </div>
            <div class="dc-data-count count-box count-box-businesses">
              <div class="filter-count">0</div>από τους <strong class="total-count">0</strong> επιχειρήσεις
            </div>
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Αναζήτηση">
              <i class="material-icons">search</i>
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">επαναφορά</span></button>
        <div class="footer-buttons-right">
          <button @click="downloadDataset"><i class="material-icons">cloud_download</i></button>
          <button class="btn-twitter" @click="share('twitter')"><img src="./images/twitter.png" /></button>
          <button class="btn-fb" @click="share('facebook')"><img src="./images/facebook.png" /></button>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="'Loading ...'" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>
    <script src="static/tab_c.js"></script>

 
</body>
</html>