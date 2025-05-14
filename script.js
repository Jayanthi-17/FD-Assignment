function generateForm() {
      const app = document.getElementById("app");
      app.innerHTML = `
        <h1>Date Calculator</h1>
        <label for="start-date">Select Start Date:</label>
        <input type="date" id="start-date" required />

        <label for="days">Or Enter Date (MM/DD/YYYY):</label>
        <input type="text" id="manual-date" placeholder="MM/DD/YYYY" />
        <label for="interval">Enter time to add/subtract:</label>
        <input type="number" id="interval" placeholder="e.g., 5" />

        <label for="unit">Select unit:</label>
        <select id="unit">
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>

        <button onclick="calculateDate('add')">Add</button>
        <button onclick="calculateDate('subtract')">Subtract</button>
        <button onclick="resetForm()">Reset</button>

        <div id="output" class="result"></div>
        <div id="error" class="error"></div>
      `;
    }

    function parseInputDate() {
      const calendarDate = document.getElementById("start-date").value;
      const manualDate = document.getElementById("manual-date").value.trim();

      if (calendarDate) return new Date(calendarDate);

      if (manualDate) {
        const [mm, dd, yyyy] = manualDate.split("/");
        const date = new Date(`${yyyy}-${mm}-${dd}`);
        return isNaN(date) ? null : date;
      }

      return null;
    }

    function calculateDate(action) {
      document.getElementById("error").innerText = "";
      document.getElementById("output").innerText = "";

      const inputDate = parseInputDate();
      const interval = parseInt(document.getElementById("interval").value);
      const unit = document.getElementById("unit").value;

      if (!inputDate || isNaN(interval)) {
        document.getElementById("error").innerText = "Please enter valid date and interval.";
        return;
      }

      const resultDate = new Date(inputDate.getTime());

      const factor = action === "add" ? 1 : -1;
      switch (unit) {
        case "days":
          resultDate.setDate(resultDate.getDate() + factor * interval);
          break;
        case "weeks":
          resultDate.setDate(resultDate.getDate() + factor * interval * 7);
          break;
        case "months":
          resultDate.setMonth(resultDate.getMonth() + factor * interval);
          break;
        case "years":
          resultDate.setFullYear(resultDate.getFullYear() + factor * interval);
          break;
      }

      const formattedDate = resultDate.toLocaleDateString("en-US", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      document.getElementById("output").innerText = `Resulting Date: ${formattedDate}`;
    }

    function resetForm() {
      document.getElementById("start-date").value = "";
      document.getElementById("manual-date").value = "";
      document.getElementById("interval").value = "";
      document.getElementById("unit").value = "days";
      document.getElementById("output").innerText = "";
      document.getElementById("error").innerText = "";
    }

    generateForm();