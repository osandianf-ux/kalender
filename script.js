const calendarBody = document.getElementById("calendar-body");
const monthYear = document.getElementById("month-year");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");

let currentDate = new Date();
let events = JSON.parse(localStorage.getItem("events")) || {};

function renderCalendar(date) {
  calendarBody.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  monthYear.textContent = date.toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  let startDay = firstDay.getDay(); // Minggu=0
  let totalDays = lastDay.getDate();
  let row = document.createElement("tr");

  // kosongkan hari sebelum tanggal 1
  for (let i = 0; i < startDay; i++) {
    row.appendChild(document.createElement("td"));
  }

  for (let day = 1; day <= totalDays; day++) {
    if (row.children.length === 7) {
      calendarBody.appendChild(row);
      row = document.createElement("tr");
    }
    const cell = document.createElement("td");
    cell.textContent = day;
    const fullDate = `${year}-${month + 1}-${day}`;

    if (events[fullDate]) {
      const eventDiv = document.createElement("div");
      eventDiv.textContent = events[fullDate];
      eventDiv.classList.add("event");
      cell.appendChild(eventDiv);
    }

    cell.addEventListener("click", () => openModal(fullDate));
    row.appendChild(cell);
  }
  calendarBody.appendChild(row);
}

prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};

// Modal Event
const modal = document.getElementById("event-modal");
const eventDate = document.getElementById("event-date");
const eventText = document.getElementById("event-text");
const saveEvent = document.getElementById("save-event");
const closeModal = document.getElementById("close-modal");

function openModal(date) {
  modal.style.display = "block";
  eventDate.textContent = `Acara tanggal ${date}`;
  eventText.value = events[date] || "";
  saveEvent.onclick = () => {
    const text = eventText.value.trim();
    if (text) events[date] = text;
    else delete events[date];
    localStorage.setItem("events", JSON.stringify(events));
    modal.style.display = "none";
    renderCalendar(currentDate);
  };
}

closeModal.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

renderCalendar(currentDate);
