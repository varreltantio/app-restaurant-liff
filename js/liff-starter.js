window.onload = function () {
  const useNodeJS = false; // if you are not using a node server, set this value to false
  const defaultLiffId = "1655317138-oY7qKB40"; // change the default LIFF value if you are not using a node server

  // DO NOT CHANGE THIS
  let myLiffId = "";

  // if node is used, fetch the environment variable and pass it to the LIFF method
  // otherwise, pass defaultLiffId
  if (useNodeJS) {
    fetch("/send-id")
      .then(function (reqResponse) {
        return reqResponse.json();
      })
      .then(function (jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiffOrDie(myLiffId);
      })
      .catch(function (error) {
        document.getElementById("liffAppContent").classList.add("hidden");
        document
          .getElementById("nodeLiffIdErrorMessage")
          .classList.remove("hidden");
      });
  } else {
    myLiffId = defaultLiffId;
    initializeLiffOrDie(myLiffId);
  }
};

/**
 * Check if myLiffId is null. If null do not initiate liff.
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiffOrDie(myLiffId) {
  if (!myLiffId) {
    document.getElementById("liffAppContent").classList.add("hidden");
    document.getElementById("liffIdErrorMessage").classList.remove("hidden");
  } else {
    initializeLiff(myLiffId);
  }
}

/**
 * Initialize LIFF
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiff(myLiffId) {
  liff
    .init({
      liffId: myLiffId,
    })
    .then(() => {
      // start to use LIFF's api
      initializeApp();
    })
    .catch((err) => {
      document.getElementById("liffAppContent").classList.add("hidden");
      document
        .getElementById("liffInitErrorMessage")
        .classList.remove("hidden");
    });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
  // check if the user is logged in/out, and disable inappropriate button
  if (liff.isLoggedIn()) {
    document.getElementById("liffLoginButton").disabled = true;
    document.getElementById("login").classList.toggle("hidden");
    document.getElementById("content").classList.remove("hidden");
  } else {
    document.getElementById("liffLogoutButton").disabled = true;
  }
  
  displayIsInClientInfo();
  registerButtonHandlers();
  displayClientProfile();
}

/**
 * Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
 */
function displayIsInClientInfo() {
  if (liff.isInClient()) {
    document.getElementById("liffLoginButton").classList.toggle("hidden");
    document.getElementById("liffLogoutButton").classList.toggle("hidden");
  } else {
    document.getElementById("openWindowButton").classList.toggle("hidden");
  }
}

// display alert that LIFF not supported external browser
function sendAlertIfNotInClient() {
  alert(
    "This button is unavailable as LIFF is currently being opened in an external browser."
  );
}

/**
 * Toggle specified element
 * @param {string} elementId The ID of the selected element
 */
function toggleElement(elementId) {
  const elem = document.getElementById(elementId);
  if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
    elem.style.display = "none";
  } else {
    elem.style.display = "block";
  }
}

function registerButtonHandlers() {
  // open window
  document
    .getElementById("openWindowButton")
    .addEventListener("click", function () {
      liff.openWindow({
        url: "https://nito-resto.herokuapp.com/", // Isi dengan Endpoint URL aplikasi web Anda
        external: true,
      });
    });

  // login
  document
    .getElementById("liffLoginButton")
    .addEventListener("click", function () {
      // cek jika belum login
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    });

  // logout
  document
    .getElementById("liffLogoutButton")
    .addEventListener("click", function () {
      // cek jika sudah login
      if (liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
      }
    });
}

function displayClientProfile() {
  if (!liff.isInClient()) {
    sendAlertIfNotInClient();
  } else {
    liff.getProfile()
    .then(profile => {
      document.getElementById("clientNameNav").textContent = profile.displayName;
      document.getElementById("clientNameHeader").textContent = profile.displayName;
      $("#clientProfile").attr("src", profile.pictureUrl);
    })
    .catch((err) => {
      console.log('error', err);
    });
  }
}
