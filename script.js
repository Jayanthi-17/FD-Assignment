function generateForm() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h1>Date Calculator</h1>

    <label for="start-date">Select Start Date:</label>
    <input type="date" id="start-date" required>
    <small>Format: MM/DD/YYYY (displayed below)</small>

    <label for="manual-date">Or Enter Date (MM/DD/YYYY):</label>
    <input type="text" id="manual-date" placeholder="MM/DD/YYYY">
    <small class="error-hint" id="date-error"></small>

    <label for="interval">Enter time to add/subtract:</label>
    <input type="text" id="interval" placeholder="e.g., 5" inputmode="numeric">
    <small class="error-hint" id="interval-error"></small>

    <label for="unit">Select unit:</label>
    <select id="unit">
      <option value="days">Days</option>
      <option value="weeks">Weeks</option>
      <option value="months">Months</option>
      <option value="years">Years</option>
    </select>

    <div class="button-group">
      <button id="add-btn">Add</button>
      <button id="subtract-btn">Subtract</button>
      <button id="reset-btn">Reset</button>
    </div>

    <div id="selected-date-preview" class="result"></div>
    <div id="output" class="result"></div>
    <div id="error" class="error"></div>
  `;

  // Manual date validation
  document.getElementById("manual-date").addEventListener("input", function() {
    validateManualDate();
  });

  // Strict numeric validation for interval
  document.getElementById("interval").addEventListener("input", function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    document.getElementById("interval-error").textContent = 
      this.value ? "" : "Please enter a number";
  });

  // Add event listeners
  document.getElementById("add-btn").addEventListener("click", () => calculateDate('add'));
  document.getElementById("subtract-btn").addEventListener("click", () => calculateDate('subtract'));
  document.getElementById("reset-btn").addEventListener("click", resetForm);
}

function parseInputDate() {
  const calendarDate = document.getElementById("start-date").value;
  const manualDate = document.getElementById("manual-date").value.trim();
  const errorField = document.getElementById("error");

  if (calendarDate) {
    const date = new Date(calendarDate);
    document.getElementById("selected-date-preview").textContent = 
      `Selected Date: ${date.toLocaleDateString("en-US")}`;
    return date;
  }

  if (manualDate) {
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(manualDate)) {
      errorField.textContent = "Please use MM/DD/YYYY format";
      return null;
    }

    const [mm, dd, yyyy] = manualDate.split("/").map(Number);
    const date = new Date(yyyy, mm - 1, dd);
    
    if (isNaN(date)) {
      errorField.textContent = "Invalid date";
      return null;
    }

    document.getElementById("selected-date-preview").textContent = 
      `Selected Date: ${date.toLocaleDateString("en-US")}`;
    return date;
  }

  errorField.textContent = "Please enter a valid date";
  return null;
}

function validateManualDate() {
  const input = document.getElementById("manual-date").value.trim();
  const errorField = document.getElementById("date-error");
  
  if (!input) {
    errorField.textContent = "";
    return true;
  }

  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(input)) {
    errorField.textContent = "Please use MM/DD/YYYY format";
    return false;
  }

  const [mm, dd, yyyy] = input.split("/").map(Number);
  
  if (mm < 1 || mm > 12) {
    errorField.textContent = "Month must be 1-12";
    return false;
  }

  const lastDay = new Date(yyyy, mm, 0).getDate();
  if (dd < 1 || dd > lastDay) {
    errorField.textContent = `Invalid day (max ${lastDay} for ${mm}/${yyyy})`;
    return false;
  }

  errorField.textContent = "";
  return true;
}

function addMonths(date, months) {
  const newDate = new Date(date);
  const originalDate = date.getDate();
  
  newDate.setMonth(newDate.getMonth() + months);
  
  if (newDate.getDate() !== originalDate) {
    newDate.setDate(0);
  }
  
  return newDate;
}

function calculateDate(action) {
  const errorField = document.getElementById("error");
  errorField.textContent = "";
  document.getElementById("output").textContent = "";

  const inputDate = parseInputDate();
  if (!inputDate) return;

  const interval = parseInt(document.getElementById("interval").value);
  if (isNaN(interval) || interval < 1) {
    errorField.textContent = "Please enter a valid number ≥ 1";
    return;
  }

  const unit = document.getElementById("unit").value;
  let resultDate;

  try {
    switch (unit) {
      case "days":
        resultDate = new Date(inputDate);
        resultDate.setDate(resultDate.getDate() + (action === "add" ? interval : -interval));
        break;
      case "weeks":
        resultDate = new Date(inputDate);
        resultDate.setDate(resultDate.getDate() + (action === "add" ? interval * 7 : -interval * 7));
        break;
      case "months":
        resultDate = addMonths(inputDate, action === "add" ? interval : -interval);
        break;
      case "years":
        resultDate = new Date(inputDate);
        resultDate.setFullYear(resultDate.getFullYear() + (action === "add" ? interval : -interval));
        break;
    }

    const formattedDate = resultDate.toLocaleDateString("en-US", {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });

    document.getElementById("output").innerHTML = `
      <strong>Resulting Date:</strong> ${formattedDate}
    `;
  } catch (e) {
    errorField.textContent = "Invalid calculation";
  }
}

function resetForm() {
  document.getElementById("start-date").value = "";
  document.getElementById("manual-date").value = "";
  document.getElementById("interval").value = "";
  document.getElementById("unit").value = "days";
  document.getElementById("output").textContent = "";
  document.getElementById("error").textContent = "";
  document.getElementById("date-error").textContent = "";
  document.getElementById("selected-date-preview").textContent = "";
}

// Initialize
generateForm();