<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Integrity Watch Greece - Έσοδα</title>
    <!-- Add twitter and og meta here -->
    <meta property="og:url" content="https://www.integritywatch.gr" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Integrity Watch Greece - Έσοδα" />
    <meta property="og:description" content="Τα έσοδα των Βουλευτών - Διαδραστικά γραφήματα ανοιχτών δεδομένων για τα έσοδα που δήλωσαν οι Έλληνες Βουλευτές στα Πόθεν Έσχες του 2019." />
    <meta property="og:image" content="https://www.integritywatch.gr/images/thumbnail.png" />
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_a.css?v=2">
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
                  <h1>Πολιτική ακεραιότητα και ανοιχτά δεδομένα</h1>
                  <p>Το Integrity Watch είναι μια διαδραστική πλατφόρμα ανοιχτών διαδραστικών δεδομένων παρουσιάζοντας τα <a href="./index.php">έσοδα</a>, τα <a href="./financial.php">επενδυτικά προϊόντα & τις καταθέσεις</a> καθώς και τα <a href="./properties.php">ακίνητα</a> τα οποία οι Βουλευτές δήλωσαν στις δηλώσεις περιουσιακής τους κατάστασης το 2022 (χρήση 2021) με σκοπό να  λειτουργεί ως παρατηρητήριο Πολιτικής Ακεραιότητας. Απευθύνεται σε πολίτες, σε δημόσιες αρχές, σε δημοσιογράφους και οργανώσεις της κοινωνίας των πολιτών που επιθυμούν να παρακολουθούν τις πηγές χρηματοδότησης της πολιτικής στην Ελλάδα.</a>
                  <p><a href="/about.php">Δείτε περισσότερα</a></p>
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW-->
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_a_1">
              <chart-header :title="charts.party.title" :info="charts.party.info" ></chart-header>
              <div class="chart-inner" id="party_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_a_2">
              <chart-header :title="charts.income.title" :info="charts.income.info" ></chart-header>
              <div class="chart-inner" id="income_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_a_3">
              <chart-header :title="charts.topRevenue.title" :info="charts.topRevenue.info" ></chart-header>
              <div class="chart-inner" id="topRevenue_chart"></div>
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
                      <th class="header">Συνολικά έσοδα</th>
                      <th class="header">Αριθμός πηγών εσόδων</th>
                      <th class="header">Ημερομηνία της δήλωσης</th>
                      <th class="header">Πηγή μεγαλύτερων εσόδων</th> 
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
                <div>{{ selectedElement.Fullname_GR }}</div>
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
                    <div class="details-line" v-if="selectedElement.Link_DOI && selectedElement.Link_DOI !== ''"><span class="details-line-title">Προφίλ:</span><a :href="selectedElement.Link_DOI" target="_blank"> {{ selectedElement.Link_DOI.split('/').pop() }}</a></div>
                    <div class="details-line" v-if="selectedElement.declaration"><span class="details-line-title">Σύνολο δηλωθέντων εσόδων</span> {{ selectedElement.declaration.totRevenue }}</div>
                    <div class="details-line" v-if="selectedElement.declaration"><span class="details-line-title">Έσοδα που δηλώθηκαν από σύζυγο</span> {{ selectedElement.declaration.totRevenueSpouse }}</div>
                    <div class="modal-table-container">
                      <table class="modal-table" v-if="selectedElement.declaration">
                        <thead>
                          <tr>
                            <th>Ο ΑΠΟΚΤΩΝ ΤΟ ΕΙΣΟΔΗΜΑ</th>
                            <th>ΕΙΔΟΣ ΕΙΣΟΔΟΥ</th>
                            <th>ΠΟΣΟ</th>
                            <th>ΝΟΜΙΣΜΑ</th>
                            <th>ΠΑΡΑΤΗΡΗΣΕΙΣ</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="rev in selectedElement.declaration.ownRevenues">
                            <td>{{ rev.receipt }}</td>
                            <td>{{ rev.type }}</td>
                            <td>{{ rev.amount }}</td>
                            <td>{{ rev.currency }}</td>
                            <td>{{ rev.comments }}</td>
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
      </div>
      <!-- Bottom bar -->
      <div class="container-fluid footer-bar">
        <div class="row">
          <div class="footer-col col-12 col-sm-12 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>από τους <strong class="total-count">0</strong> βουλευτές
            </div>
            <div class="dc-data-count count-box count-box-revenue">
              <div class="filter-count">0</div>από τα <strong class="total-count">0</strong> δηλωμένα έσοδα
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
      <loader v-if="loader" :text="''" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>
    <script src="static/tab_a.js?v=2"></script>

 
</body>
</html>