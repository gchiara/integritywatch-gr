<nav class="navbar navbar-expand-lg navbar-light" id="iw-nav">
  <a class="navbar-brand" href="https://www.transparency.gr/" target="_blank"><img src="./images/ti_gr_logo.png" alt="" /> </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a href="./" class="nav-link" :class="{active: page == 'tabA'}">Έσοδα</a>
      </li>
      <li class="nav-item">
        <a href="./financial.php" class="nav-link" :class="{active: page == 'tabB'}">Επενδύσεις & Καταθέσεις</a>
      </li>
      <li class="nav-item">
        <a href="./properties.php" class="nav-link" :class="{active: page == 'tabC'}">Ακίνητα</a>
      </li>
      <li class="nav-item">
        <a href="./loans.php" class="nav-link" :class="{active: page == 'tabD'}">Δάνεια</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Άλλες χώρες 
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
			<a class="dropdown-item" href="https://www.integritywatch.eu/" target="_blank">Ευρωπαϊκή Ένωση</a>
			<a class="dropdown-item" href="https://www.integritywatch.fr/" target="_blank">Γαλλία</a>
			<a class="dropdown-item" href="http://www.soldiepolitica.it/" target="_blank">Ιταλία</a>
			<a class="dropdown-item" href="https://deputatiuzdelnas.lv/" target="_blank">Λετονία</a>
			<a class="dropdown-item" href="https://manoseimas.lt/" target="_blank">Λιθουανία</a>
			<a class="dropdown-item" href="https://www.integritywatch.nl/" target="_blank">Ολλανδία</a>
			<a class="dropdown-item" href="http://varuhintegritete.transparency.si/" target="_blank">Σλοβενία</a>
			<a class="dropdown-item" href="https://integritywatch.es/" target="_blank">Ισπανία</a>
			<a class="dropdown-item" href="https://openaccess.transparency.org.uk/" target="_blank">Ηνωμένο Βασίλειο</a>
			<a class="dropdown-item" href="https://integritywatch.cl/" target="_blank">Χιλή</a>
        </div>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a href="./about.php" class="nav-link">Σχετικά</a>
      </li>
      <li class="nav-item">
        <i class="material-icons nav-link icon-btn info-btn" @click="showInfo = !showInfo">info</i>
      </li>
    </ul>
  </div>
</nav>