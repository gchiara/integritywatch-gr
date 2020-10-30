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
    <link rel="stylesheet" href="static/tab_b.css">
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
                  <h1>οικονομικά συμφέροντα και περιουσιακά στοιχεί</h1>
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
              <chart-header :title="charts.investments.title" :info="charts.investments.info" ></chart-header>
              <div class="chart-inner" id="investments_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_2">
              <chart-header :title="charts.deposits.title" :info="charts.deposits.info" ></chart-header>
              <div class="chart-inner" id="deposits_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_3">
              <chart-header :title="charts.topInvestments.title" :info="charts.topInvestments.info" ></chart-header>
              <div class="chart-inner" id="topInvestments_chart"></div>
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
                    <div class="details-line" v-if="selectedElement.declaration && selectedElement.declaration.companies"><span class="details-line-title">Προϊόντα επενδύσεων</span></div>
                    <table class="modal-table" v-if="selectedElement.declaration && selectedElement.declaration.companies">
                      <thead>
                        <tr>
                          <th>ΕΠΕΝΔΥΤΗΣ</th>
                          <th>Τίτλος</th>
                          <th>ΠΟΣΟΤΗΤΑ</th>
                          <th>ΑΞΙΑ ΚΤΗΣΗΣ</th>
                          <th>ΑΞΙΑ ΠΩΛΗΣΗΣ/ ΜΕΤΑΒΙΒΑΣΗΣ</th>
                          <th>ΝΟΜΙΣΜΑ</th>
                          <th>ΧΕΙΡΙΣΤΗΣ ΜΕΡΙΔΑΣ ΕΠΕΝΔΥΤΗ</th>
                          <th>ΠΑΡΑΤΗΡΗΣΕΙΣ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="e in selectedElement.declaration.companies">
                          <td>{{ e.investor }}</td>
                          <td>{{ e.title }}</td>
                          <td>{{ e.quantity }}</td>
                          <td>{{ e.purchase_valuey }}</td>
                          <td>{{ e.selling_value }}</td>
                          <td>{{ e.currency }}</td>
                          <td>{{ e.os_investor }}</td>
                          <td>{{ e.comments }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="details-line" v-if="selectedElement.declaration && selectedElement.declaration.bankdeposits"><span class="details-line-title">Τραπεζικές καταθέσεις</span></div>
                    <table class="modal-table" v-if="selectedElement.declaration && selectedElement.declaration.bankdeposits">
                      <thead>
                        <tr>
                          <th>ΔΙΚΑΙΟΥΧΟΣ</th>
                          <th>ΠΙΣΤΩΤΙΚΟ ΙΔΡΥΜΑ</th>
                          <th>ΧΩΡΑ</th>
                          <th>ΑΞΙΑ ΚΤΗΣΗΣ</th>
                          <th>ΕΙΔΟΣ ΛΟΓΑΡΙΑΣΜΟΥ / ΚΑΤΑΘΕΣΗΣ</th>
                          <th>ΠΟΣΟ</th>
                          <th>ΝΟΜΙΣΜΑ</th>
                          <th>ΠΑΡΑΤΗΡΗΣΕΙΣ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="e in selectedElement.declaration.bankdeposits">
                          <td>{{ e.beneficiary }}</td>
                          <td>{{ e.institution }}</td>
                          <td>{{ e.country }}</td>
                          <td>{{ e.account_type }}</td>
                          <td>{{ e.amount }}</td>
                          <td>{{ e.currency }}</td>
                          <td>{{ e.origin }}</td>
                          <td>{{ e.comments }}</td>
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
            <div class="dc-data-count count-box count-box-companies">
              <div class="filter-count">0</div>από τους <strong class="total-count">0</strong> Προϊόντα επενδύσεων
            </div>
            <div class="dc-data-count count-box count-box-deposits">
              <div class="filter-count">0</div>από τους <strong class="total-count">0</strong> Τραπεζικές καταθέσεις
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
    <script src="static/tab_b.js"></script>

 
</body>
</html>