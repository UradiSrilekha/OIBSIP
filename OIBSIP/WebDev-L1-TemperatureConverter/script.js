(function () {
  var input = document.getElementById("tempInput");
  var errorMsg = document.getElementById("errorMsg");
  var zeroWarning = document.getElementById("zeroWarning");
  var convertBtn = document.getElementById("convertBtn");

  var results = {
    C: document.getElementById("valC"),
    F: document.getElementById("valF"),
    K: document.getElementById("valK")
  };

  var tiles = {
    C: document.getElementById("tileC"),
    F: document.getElementById("tileF"),
    K: document.getElementById("tileK")
  };

  var thermFill = document.getElementById("thermFill");
  var thermBulb = document.getElementById("thermBulb");
  var thermReadout = document.getElementById("thermReadout");

  var ABS_ZERO_C = -273.15;
  var NUM_RE = /^-?\d*\.?\d+$/;

  function getUnit() {
    var checked = document.querySelector('input[name="unit"]:checked');
    return checked ? checked.value : "C";
  }

  function clearResults() {
    results.C.innerHTML = '<span class="empty">—</span>';
    results.F.innerHTML = '<span class="empty">—</span>';
    results.K.innerHTML = '<span class="empty">—</span>';

    tiles.C.classList.remove("source");
    tiles.F.classList.remove("source");
    tiles.K.classList.remove("source");
  }

  function setThermometer(celsius) {
    if (celsius === null || isNaN(celsius)) {
      thermFill.style.height = "38%";
      thermReadout.textContent = "—";
      return;
    }

    var clamped = Math.max(-50, Math.min(50, celsius));
    var percent = ((clamped + 50) / 100) * 100;

    thermFill.style.height = percent.toFixed(1) + "%";
    thermReadout.textContent = celsius.toFixed(1) + "°C";

    var mixValue = (clamped + 50) / 100;
    var cold = [47, 111, 237];
    var hot = [224, 57, 42];

    var mixed = cold.map(function (color, index) {
      return Math.round(color + (hot[index] - color) * mixValue);
    });

    var rgb = "rgb(" + mixed.join(",") + ")";
    thermBulb.style.background = rgb;
  }

  function validate(showError) {
    var raw = input.value.trim();

    if (raw === "") {
      if (showError) {
        errorMsg.textContent = "";
        input.setAttribute("aria-invalid", "false");
      }

      return {
        valid: false,
        value: null
      };
    }

    if (!NUM_RE.test(raw)) {
      if (showError) {
        errorMsg.textContent = "Enter a valid number (e.g. 36.6, -12, 98.6).";
        input.setAttribute("aria-invalid", "true");
      }

      return {
        valid: false,
        value: null
      };
    }

    errorMsg.textContent = "";
    input.setAttribute("aria-invalid", "false");

    return {
      valid: true,
      value: parseFloat(raw)
    };
  }

  function convert() {
    var check = validate(true);

    zeroWarning.classList.remove("show");

    if (!check.valid) {
      clearResults();
      setThermometer(null);

      if (input.value.trim() === "") {
        errorMsg.textContent = "Enter a temperature value first.";
        input.setAttribute("aria-invalid", "true");
      }

      return;
    }

    var unit = getUnit();
    var value = check.value;
    var celsius;

    if (unit === "C") {
      celsius = value;
    } else if (unit === "F") {
      celsius = (value - 32) * 5 / 9;
    } else {
      celsius = value - 273.15;
    }

    if (celsius < ABS_ZERO_C - 0.0005) {
      clearResults();
      setThermometer(null);
      zeroWarning.classList.add("show");
      return;
    }

    var fahrenheit = celsius * 9 / 5 + 32;
    var kelvin = celsius + 273.15;

    results.C.textContent = celsius.toFixed(2) + " °C";
    results.F.textContent = fahrenheit.toFixed(2) + " °F";
    results.K.textContent = kelvin.toFixed(2) + " K";

    tiles.C.classList.toggle("source", unit === "C");
    tiles.F.classList.toggle("source", unit === "F");
    tiles.K.classList.toggle("source", unit === "K");

    setThermometer(celsius);
  }

  input.addEventListener("input", function () {
    validate(true);
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      convert();
    }
  });

  convertBtn.addEventListener("click", convert);

  document.querySelectorAll('input[name="unit"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      if (input.value.trim() !== "" && validate(false).valid) {
        convert();
      }
    });
  });
})();
