const FALLBACK_DATA = {
  program: { totalCredits: 161.5, session: "2024-2025" },
  gradingScale: [
    { letter: "A+", point: 4 }, { letter: "A", point: 3.75 }, { letter: "A-", point: 3.5 },
    { letter: "B+", point: 3.25 }, { letter: "B", point: 3 }, { letter: "B-", point: 2.75 },
    { letter: "C+", point: 2.5 }, { letter: "C", point: 2.25 }, { letter: "D", point: 2 },
    { letter: "F", point: 0 }
  ],
  semesters: [
    {
      id: 1, label: "1st Year 1st Semester", courses: [
        { code: "URP 1101", title: "Urban Land Use Planning", credits: 3 },
        { code: "HUM 1151", title: "English and Communication", credits: 3 },
        { code: "MATH 1153", title: "Mathematics for Planners", credits: 3 },
        { code: "URP 1108", title: "Viva-Voce", credits: 1.5 }
      ]
    },
    {
      id: 5, label: "3rd Year 1st Semester", courses: [
        { code: "URP 3105", title: "Geographic Information System", credits: 3 },
        { code: "URP 3106", title: "GIS Sessional", credits: 2 }
      ]
    },
    {
      id: 7, label: "4th Year 1st Semester", courses: [
        { code: "URP 4105", title: "Climate Change and Disaster Management", credits: 3 }
      ]
    }
  ],
  resources: [
    { type: "book", title: "Urban Land Use Planning by Kaiser", course: "URP 1101", semester: 1, format: "PDF", level: "Core", link: "#" },
    { type: "note", title: "GIS Data Structures Lecture", course: "URP 3105", semester: 5, format: "PDF", level: "Lab Ready", link: "#" },
    { type: "question", title: "First Year Previous Questions", course: "Mixed", semester: 1, format: "PDF", level: "Archive", link: "#" },
    { type: "video", title: "Climate Risk and Vulnerability Assessment", course: "URP 4105", semester: 7, format: "YouTube", level: "Recommended", link: "https://www.youtube.com/results?search_query=climate+risk+vulnerability+assessment+urban+planning" }
  ]
};

const state = { data: FALLBACK_DATA, loadedSemesters: 0 };

document.addEventListener("DOMContentLoaded", async () => {
  setupMenu();
  state.data = await loadData();
  initHome();
  initResources();
  initCgpa();
  initTools();
});

async function loadData() {
  const isInnerPage = location.pathname.includes("/pages/");
  const path = isInnerPage ? "../data/resources.json" : "data/resources.json";
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error("Data file unavailable");
    return await response.json();
  } catch (error) {
    return FALLBACK_DATA;
  }
}

function setupMenu() {
  const openButton = document.querySelector(".menu-toggle");
  const closeButton = document.querySelector(".menu-close");
  const menu = document.querySelector("[data-mobile-menu]");
  const scrim = document.querySelector("[data-scrim]");
  if (!openButton || !menu || !scrim) return;

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    scrim.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    openButton.setAttribute("aria-expanded", String(open));
  };

  openButton.addEventListener("click", () => setOpen(true));
  closeButton?.addEventListener("click", () => setOpen(false));
  scrim.addEventListener("click", () => setOpen(false));
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
}

function initHome() {
  const preview = document.querySelector("[data-curriculum-preview]");
  if (preview) {
    preview.innerHTML = state.data.semesters.slice(0, 4).map((semester) => {
      const credits = sumCredits(semester.courses);
      const courses = semester.courses.slice(0, 3).map((course) => course.code).join(", ");
      return `<article class="semester-card"><strong>${semester.label}</strong><span>${credits} credits - ${courses}</span></article>`;
    }).join("");
  }

  const form = document.querySelector("[data-search-form]");
  const input = document.querySelector("#heroSearch");
  const results = document.querySelector("[data-search-results]");
  if (!form || !input || !results) return;

  const render = () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      results.classList.remove("visible");
      results.innerHTML = "";
      return;
    }

    const resourceMatches = state.data.resources.filter((item) =>
      [item.title, item.course, item.type, item.level].join(" ").toLowerCase().includes(query)
    );
    const courseMatches = state.data.semesters.flatMap((semester) =>
      semester.courses
        .filter((course) => [course.code, course.title, semester.label].join(" ").toLowerCase().includes(query))
        .map((course) => ({ ...course, semester: semester.id, type: "course" }))
    );
    const matches = [...courseMatches, ...resourceMatches].slice(0, 6);

    results.classList.add("visible");
    results.innerHTML = matches.length
      ? matches.map((item) => resultTemplate(item)).join("")
      : `<span class="result-item"><strong>No matches yet</strong><span>Add this resource to data/resources.json.</span></span>`;
  };

  input.addEventListener("input", render);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });
}

function resultTemplate(item) {
  const href = item.type === "course" ? "pages/cgpa.html" : pageForType(item.type);
  const label = item.type === "course" ? `${item.code} - ${item.credits} credits` : `${item.course} - ${item.format}`;
  return `<a class="result-item" href="${href}"><strong>${item.title}</strong><span>${label}</span></a>`;
}

function pageForType(type) {
  const map = { book: "pages/books.html", note: "pages/notes.html", question: "pages/questions.html", video: "pages/tools.html" };
  return map[type] || "pages/tools.html";
}

//FIXME:dsfgdfgsdfgsddgsdssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss


function initResources() {
  const list = document.querySelector("[data-resource-list]");
  if (!list) return;
  const type = list.dataset.type;
  const input = document.querySelector("[data-filter-input]");
  const semesterFilter = document.querySelector("[data-semester-filter]");

  if (semesterFilter) {
    semesterFilter.innerHTML += state.data.semesters
      .map((semester) => `<option value="${semester.id}">${semester.label}</option>`)
      .join("");
  }


  const render = () => {
    const query = (input?.value || "").toLowerCase();
    const semester = semesterFilter?.value || "all";
    let items = state.data.resources.filter((resource) => {
      const typeMatch = type === "video"
        ? [resource.title, resource.course].join(" ").toLowerCase().includes("video") : resource.type === type;
      const queryMatch = [resource.title, resource.course, resource.level, resource.format].join(" ").toLowerCase().includes(query);
      const semesterMatch = semester === "all" || String(resource.semester) === semester;
      return typeMatch && queryMatch && semesterMatch;
    });

    if (type === "video") {
      items = items.concat(state.data.resources.filter((resource) => resource.type === "video"));
    }

    list.innerHTML = items.length
      ? items.map(resourceCard).join("")
      : `<article class="resource-card"><h3>No resources found</h3><p>Add matching items to data/resources.json.</p></article>`;
  };

  input?.addEventListener("input", render);
  semesterFilter?.addEventListener("change", render);
  render();
}


function resourceCard(item) {
  return `
    <article class="resource-card">
      <h3>${item.title}</h3>
      <p>${item.course} </p>
      <p> resource for semester ${item.semester}.</p>
      <div class="meta">
        <span class="chip">${item.type}</span>
        <span class="chip">${item.format}</span>
        <span class="chip">${item.level}</span>
      </div>
      <a href="${item.link}" ${item.link.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>Open resource</a>
    </article>
  `;
}











//FIXME: yt video resource cardssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss










// function initResources() {
//   // const list = document.querySelector("[data-resource-list]");
//   // if (!list) return;
//   // const type = list.dataset.type;
//   // const input = document.querySelector("[data-filter-input]");
//   // const semesterFilter = document.querySelector("[data-semester-filter]");

//   // if (semesterFilter) {
//   //   semesterFilter.innerHTML += state.data.semesters
//   //     .map((semester) => `<option value="${semester.id}">${semester.label}</option>`)
//   //     .join("");
//   // }

//   const render = () => {
//     const query = (input?.value || "").toLowerCase();
//     const semester = semesterFilter?.value || "all";
//     let items = state.data.resources.filter((resource) => {
//       const typeMatch = type === "video"
//         ? [resource.title, resource.course].join(" ").toLowerCase().includes("video") : resource.type === type;
//       const queryMatch = [resource.title, resource.course, resource.level, resource.format].join(" ").toLowerCase().includes(query);
//       const semesterMatch = semester === "all" || String(resource.semester) === semester;
//       return typeMatch && queryMatch && semesterMatch;
//     });

//     if (type === "video") {
//       items = items.concat(state.data.resources.filter((resource) => resource.type === "video"));
//     }

//     list.innerHTML = items.length
//       ? items.map(videoCard).join("")
//       : `<article class="video-card"><h3>No resources found</h3><p>Add matching items to data/resources.json.</p></article>`;
//   };

//   input?.addEventListener("input", render);
//   semesterFilter?.addEventListener("change", render);
//   render();
// }

// function videoCard(item) {
//   return `
//     <article class="video-card">
//       <div class="cards-3">
//                         <iframe  src="${item.linkEmbd}" title="${item.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
//                         <div class="card-3-info">
//                             <h3>${item.title}</h3>
//                             <p>${item.course}</p>
//                             <p>Semester ${item.semester}</p>
//                             <div class="green-text">
//                                 <i class="fa-solid fa-clock" style="color: #00FF88;"></i> 42 min
//                             </div>
//                         </div>
//                         <a href="${item.link}" ${item.link.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>Open in YouTube</a>
//                     </div>
//     </article>
//   `;
// }


// function resourceCard(item) {
//   return `
//     <article class="resource-card">
//       <h3>${item.title}</h3>
//       <p>${item.course} </p>
//       <p> resource for semester ${item.semester}.</p>
//       <div class="meta">
//         <span class="chip">${item.type}</span>
//         <span class="chip">${item.format}</span>
//         <span class="chip">${item.level}</span>
//       </div>
//       <a href="${item.link}" ${item.link.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>Open resource</a>
//     </article>
//   `;
// }


//FIXME: YT resources end hare








// CGPA Calculator Logic /////////////////////////



function initCgpa() {
  const container = document.querySelector("[data-semester-container]");
  const semesterSelect = document.querySelector("[data-select-semester]");
  const resetButton = document.querySelector("[data-reset-cgpa]");
  if (!container || !semesterSelect) return;

  semesterSelect.addEventListener("change", (event) => {
    const selectedIndex = Number(event.target.value);
    container.innerHTML = "";

    if (selectedIndex === 0) {
      state.loadedSemesters = 0;
      if (typeof calculateCgpa === "function") calculateCgpa();
      return;
    }

    if (!state?.data?.semesters) {
      console.error("Semester data is missing from state!");
      return;
    }

    const arrayIndex = (selectedIndex - 1) % state.data.semesters.length;
    const semester = state.data.semesters[arrayIndex];

    state.loadedSemesters = selectedIndex;
    container.insertAdjacentHTML("beforeend", semesterTemplate(semester));
    container.querySelectorAll("select").forEach((select) =>
      select.addEventListener("change", calculateCgpa)
    );

    if (typeof calculateCgpa === "function") calculateCgpa();
  });

  resetButton?.addEventListener("click", () => {
    container.innerHTML = "";
    state.loadedSemesters = 0;
    semesterSelect.value = "0";
    if (typeof calculateCgpa === "function") calculateCgpa();
  });
}

resetButton?.addEventListener("click", () => {
  container.innerHTML = "";
  state.loadedSemesters = 0;
  semesterSelect.value = "0";
  calculateCgpa();
});

function semesterTemplate(semester) {
  return `
    <section class="semester-block">
      <h3><span>${semester.label}</span><span>${sumCredits(semester.courses)} credits</span></h3>
      ${semester.courses.map((course) => `
        <div class="course-row" data-credit="${course.credits}">
          <strong>${course.code}<br><span>${course.title}</span></strong>
          <span>${course.credits} credits</span>
          <select aria-label="${course.code} grade">
            ${state.data.gradingScale.map((grade) => `<option value="${grade.point}" ${grade.letter === "A+" ? "selected" : ""}>${grade.letter}</option>`).join("")}
          </select>
        </div>
      `).join("")}
    </section>
  `;
}

function calculateCgpa() {
  const rows = document.querySelectorAll(".course-row");
  let attempted = 0;
  let earned = 0;
  let weighted = 0;

  rows.forEach((row) => {
    const credit = Number(row.dataset.credit);
    const point = Number(row.querySelector("select").value);
    attempted += credit;
    weighted += credit * point;
    if (point > 0) earned += credit;
  });

  const cgpa = attempted ? weighted / attempted : 0;
  const value = document.querySelector("[data-cgpa-value]");
  const standing = document.querySelector("[data-standing]");
  const attemptedEl = document.querySelector("[data-credit-attempted]");
  const earnedEl = document.querySelector("[data-credit-earned]");

  if (value) value.textContent = cgpa.toFixed(2);
  if (attemptedEl) attemptedEl.textContent = formatNumber(attempted);
  if (earnedEl) earnedEl.textContent = formatNumber(earned);
  if (standing) standing.textContent = attempted ? getStanding(cgpa) : "Load a semester to begin.";
}

function getStanding(cgpa) {
  if (cgpa >= 4.00) return "উফফ!!! ভাই সেইইই ভাই সেইইই! আপনার মাথায় তো ব্রেইন না, পুরা 'SuperComputer' ফিট করা! মাথা নষ্ট!";
  if (cgpa >= 3.75) return "👑 আরে ভাই ভাই ভাই! 'Bro thinks he is the main character!'... কিন্তু কথা সত্য, আপনিই মেইন ক্যারেক্টার!";
  if (cgpa >= 3.50) return "আরে ভাই ভাই ভাই! আপনার ভাবসাব দেখে মনে হচ্ছে আপনি একাই পুরো ডিপার্টমেন্ট চালান!";
  if (cgpa >= 3.25) return "রেজাল্ট দেখে পুরা 'আমি কি তাদের মতো?' ভাইব আসতেছে! টপারদের জাস্ট একটু পিছন থেকে ছুঁয়ে দিলেন আরকি!";
  if (cgpa >= 3.00) return "রেজাল্ট দেখে মনে হচ্ছে আপনি সিজিপিএ না, সিজিপিএ-র ডিসকাউন্ট রেট দেখাচ্ছেন!";
  if (cgpa >= 2.75) return "তুমি পড়াশোনা করতে চাও, কিন্তু পড়ো না। কী, রাগ করলা?";
  if (cgpa >= 2.50) return "বাল ফালাইছেন! এইটা সিজিপিএ নাকি সেন্টার ফ্রুট এর দাম?!";
  if (cgpa >= 2.25) return "সারা সেমিস্টার শুধু রিলস দেখছেন! পড়ালেখা হয় নাই।";
  if (cgpa >= 2.00) return "মারা খাওয়া' থেকে বাঁচে গেছেন!";
  return "ফেল করছস ভাই! -10,000 Aura Points 💀";
}




function initTools() {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  document.querySelectorAll("[data-tool-toast]").forEach((button) => {
    button.addEventListener("click", () => {
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 1800);
    });
  });
}

function sumCredits(courses) {
  return formatNumber(courses.reduce((total, course) => total + Number(course.credits), 0));
}

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
