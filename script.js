// -------------------------------------------------
//  EVENT HORIZON — JavaScript
//  CS 224 Web Technologies | Assignment 01
// -------------------------------------------------

const initialEvents = [
  {
    id: Date.now() + 1,
    name: "TechFest UET Peshawar",
    date: "2025-08-15",
    description:
      "Annual technology festival featuring project exhibitions, coding competitions, and guest lectures from industry professionals.",
  },
  {
    id: Date.now() + 2,
    name: "AI & Machine Learning Workshop",
    date: "2025-07-10",
    description:
      "A hands-on workshop introducing students to core ML concepts, model training, and real-world AI applications.",
  },
  {
    id: Date.now() + 3,
    name: "Web Dev Bootcamp 2024",
    date: "2024-11-20",
    description:
      "Intensive 3-day bootcamp covering HTML, CSS, JavaScript, and modern frameworks. Past event — fully completed.",
  },
  {
    id: Date.now() + 4,
    name: "Flutter & Mobile Dev Summit",
    date: "2025-09-05",
    description:
      "A summit for mobile developers to learn about Flutter, Dart, Firebase integration, and cross-platform best practices.",
  },
  {
    id: Date.now() + 5,
    name: "Open Source Hackathon",
    date: "2024-06-01",
    description:
      "24-hour hackathon where teams collaborated to build open source tools. Past event — archived.",
  },
];

// ── State ──
let events = [...initialEvents];
let activeFilter = "all";

// ── DOM References ──
const eventList = document.getElementById("eventList");
const noEvents = document.getElementById("noEvents");
const eventCount = document.getElementById("eventCount");
const headerCount = document.getElementById("headerCount");
const formWarning = document.getElementById("formWarning");
const searchInput = document.getElementById("searchInput");
const addEventBtn = document.getElementById("addEventBtn");
const footerYear = document.getElementById("footerYear");

footerYear.textContent = new Date().getFullYear();

// ── Utilities ──
function isPast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function sortEvents(arr) {
  return [...arr].sort((a, b) => new Date(a.date) - new Date(b.date));
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function updateCounts(total) {
  eventCount.textContent = total;
  headerCount.textContent = events.length; // header always shows total, not filtered
}

// ── Render ──
function renderEvents(list) {
  eventList.innerHTML = "";

  // Apply filter pills on top of whatever list is passed in
  const filtered = list.filter((e) => {
    if (activeFilter === "upcoming") return !isPast(e.date);
    if (activeFilter === "past") return isPast(e.date);
    return true;
  });

  if (filtered.length === 0) {
    noEvents.classList.remove("hidden");
    updateCounts(0);
    return;
  }

  noEvents.classList.add("hidden");
  updateCounts(filtered.length);

  filtered.forEach((event) => {
    const past = isPast(event.date);
    const card = document.createElement("article");
    card.className = `event-card${past ? " past" : ""}`;
    card.dataset.id = event.id;

    card.innerHTML = `
      <div class="card-top-bar"></div>
      <div class="card-body">
        <div class="event-header">
          <span class="event-name">${escapeHTML(event.name)}</span>
          <button class="btn-delete" onclick="deleteEvent(${event.id})" title="Delete event">✕</button>
        </div>
        <div class="event-meta">
          <span class="event-date">📅 ${formatDate(event.date)}</span>
          <span class="${past ? "past-label" : "upcoming-label"}">${past ? "Past" : "Upcoming"}</span>
        </div>
        <p class="event-desc">${escapeHTML(event.description)}</p>
      </div>
    `;

    eventList.appendChild(card);
  });
}

// ── Add Event ──
addEventBtn.addEventListener("click", () => {
  const name = document.getElementById("eventName").value.trim();
  const date = document.getElementById("eventDate").value;
  const desc = document.getElementById("eventDesc").value.trim();

  if (!name || !date || !desc) {
    formWarning.classList.remove("hidden");
    return;
  }

  formWarning.classList.add("hidden");

  events.push({ id: Date.now(), name, date, description: desc });
  events = sortEvents(events);

  document.getElementById("eventName").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventDesc").value = "";

  applySearch();
});

// ── Delete Event ──
function deleteEvent(id) {
  events = events.filter((e) => e.id !== id);
  applySearch();
}

// ── Search ──
searchInput.addEventListener("input", applySearch);

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();
  const list = !query
    ? events
    : events.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          formatDate(e.date).toLowerCase().includes(query) ||
          e.date.includes(query),
      );
  renderEvents(list);
}

// ── Filter Pills ──
document.querySelectorAll(".pill").forEach((pill) => {
  pill.addEventListener("click", function () {
    document
      .querySelectorAll(".pill")
      .forEach((p) => p.classList.remove("active"));
    this.classList.add("active");
    activeFilter = this.dataset.filter;
    applySearch();
  });
});

// ── Init ──
events = sortEvents(events);
renderEvents(events);
