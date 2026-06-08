// -------------------------------------------------
//  EVENT HORIZON — JavaScript
//  CS 224 Web Technologies | Assignment 01
// -------------------------------------------------

// <---- Initial events data ------------------>
const initialEvents = [
  {
    id: Date.now() + 1,
    name: "TechFest UET Peshawar",
    date: "2025-08-15",
    description: "Annual technology festival featuring project exhibitions, coding competitions, and guest lectures from industry professionals."
  },
  {
    id: Date.now() + 2,
    name: "AI & Machine Learning Workshop",
    date: "2025-07-10",
    description: "A hands-on workshop introducing students to core ML concepts, model training, and real-world AI applications."
  },
  {
    id: Date.now() + 3,
    name: "Web Dev Bootcamp 2024",
    date: "2024-11-20",
    description: "Intensive 3-day bootcamp covering HTML, CSS, JavaScript, and modern frameworks. Past event — fully completed."
  },
  {
    id: Date.now() + 4,
    name: "Flutter & Mobile Dev Summit",
    date: "2025-09-05",
    description: "A summit for mobile developers to learn about Flutter, Dart, Firebase integration, and cross-platform best practices."
  },
  {
    id: Date.now() + 5,
    name: "Open Source Hackathon",
    date: "2024-06-01",
    description: "24-hour hackathon where teams collaborated to build open source tools. Past event — archived."
  }
];

// <------- State -------------------------------------->
let events = [...initialEvents];

// <------ DOM References ------------------------------>
const eventList    = document.getElementById('eventList');
const noEvents     = document.getElementById('noEvents');
const eventCount   = document.getElementById('eventCount');
const formWarning  = document.getElementById('formWarning');
const searchInput  = document.getElementById('searchInput');
const addEventBtn  = document.getElementById('addEventBtn');
const footerYear   = document.getElementById('footerYear');

// <---- Set footer year ------------------------------->
footerYear.textContent = new Date().getFullYear();

// ------ Utilities ------------------------------->
function isPast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function sortEvents(arr) {
  return [...arr].sort((a, b) => new Date(a.date) - new Date(b.date));
}

// ----- Render Events ------------------------------->
function renderEvents(list) {
  eventList.innerHTML = '';

  if (list.length === 0) {
    noEvents.classList.remove('hidden');
    eventCount.textContent = '0';
    return;
  }

  noEvents.classList.add('hidden');
  eventCount.textContent = list.length;

  list.forEach(event => {
    const past = isPast(event.date);
    const card = document.createElement('div');
    card.className = `event-card${past ? ' past' : ''}`;
    card.dataset.id = event.id;

    card.innerHTML = `
      <div class="event-header">
        <span class="event-name">${escapeHTML(event.name)}</span>
        <span class="${past ? 'past-label' : 'upcoming-label'}">${past ? 'Past' : 'Upcoming'}</span>
      </div>
      <div class="event-date">📅 ${formatDate(event.date)}</div>
      <div class="event-desc">${escapeHTML(event.description)}</div>
      <button class="btn-delete" onclick="deleteEvent(${event.id})">✕ Delete</button>
    `;

    eventList.appendChild(card);
  });
}

// ----- Escape HTML (XSS protection) ------------------------------->
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ----- Add Event ------------------------------->
addEventBtn.addEventListener('click', () => {
  const name = document.getElementById("eventName").value.trim();
  const date = document.getElementById("eventDate").value;
  const desc = document.getElementById("eventDesc").value.trim();

  // ---- Validation ------------------------------->
  if (!name || !date || !desc) {
    formWarning.classList.remove("hidden");
    return;
  }

  formWarning.classList.add("hidden");

  const newEvent = {
    id: Date.now(),
    name,
    date,
    description: desc,
  };

  events.push(newEvent);
  events = sortEvents(events);

  // ----- Clear form ------------------------------->
  document.getElementById("eventName").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventDesc").value = "";

  // Re-render (respecting active search)
  applySearch();
});

// ----- Delete Event ------------------------------->
function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  applySearch();
}

// ---- Search / Filter ------------------------------->
searchInput.addEventListener('input', applySearch);

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    renderEvents(events);
    return;
  }

  const filtered = events.filter(e =>
    e.name.toLowerCase().includes(query) ||
    formatDate(e.date).toLowerCase().includes(query) ||
    e.date.includes(query)
  );

  renderEvents(filtered);
}

// ----- Initial Render ------------------------------->
events = sortEvents(events);
renderEvents(events);
