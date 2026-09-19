const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");

if (nav && toggle) {
  const label = toggle.querySelector(".visually-hidden");

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "关闭导航菜单" : "打开导航菜单";
  };

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

const form = document.querySelector("[data-contact-form]");
if (form) {
  const status = form.querySelector("[data-form-status]");
  const email = form.dataset.email || "hello@example.com";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`合作咨询${company ? " · " + company : ""}`);
    const body = encodeURIComponent(
      [`姓名：${name || "未填写"}`, `公司/工厂：${company || "未填写"}`, "", message || "（请在此写下你的需求）"].join("\n"),
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    if (status) {
      status.textContent = `已唤起邮件客户端。若没有弹出，请直接写信至 ${email}。`;
    }
  });
}

const list = document.querySelector("[data-post-list]");
if (list) {
  const cards = [...list.querySelectorAll("[data-tags]")];
  const buttons = [...document.querySelectorAll("[data-tag-filter]")];
  const empty = document.querySelector("[data-empty]");
  const params = new URLSearchParams(window.location.search);
  let current = params.get("tag") || "全部";

  const apply = (tag) => {
    current = tag;
    let visible = 0;
    cards.forEach((card) => {
      const tags = (card.getAttribute("data-tags") || "").split(",").filter(Boolean);
      const show = tag === "全部" || tags.includes(tag);
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
    buttons.forEach((btn) => {
      const active = btn.getAttribute("data-tag-filter") === tag;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    const url = new URL(window.location.href);
    if (tag === "全部") url.searchParams.delete("tag");
    else url.searchParams.set("tag", tag);
    window.history.replaceState({}, "", url);
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => apply(btn.getAttribute("data-tag-filter")));
  });

  apply(current);
}
