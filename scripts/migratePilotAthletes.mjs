import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";

const API_URL = process.env.MIGRATION_API_URL;
const EMAIL = process.env.MIGRATION_EMAIL;
const PASSWORD = process.env.MIGRATION_PASSWORD;

if (!API_URL || !EMAIL || !PASSWORD) {
  console.error(
    "Missing MIGRATION_API_URL / MIGRATION_EMAIL / MIGRATION_PASSWORD in .env",
  );
  process.exit(1);
}

const PHOTOS_DIR = path.join(process.cwd(), "temp", "migration");

// Пілотна п'ятірка з реєстру навс-athletes-registry.vercel.app
const ATHLETES = [
  {
    photo: "vadym-babych.jpg",
    name: "Бабич Вадим",
    department: "ННІПД",
    course: 3,
    sport: "thai-boxing-kickboxing",
    rank: "I спортивний розряд",
    achievements:
      "2 місце — Фіналіст Чемпіонату України (Чемпіонат України з таїландського боксу 2026, Національний, 06.12.2025); " +
      "3 місце — Призер Чемпіонату України (Чемпіонат України з ICO Combat самозахист, Національний, дата не вказана). " +
      "Джерело: реєстр спортсменів НАВС (navs-athletes-registry.vercel.app).",
  },
  {
    photo: "oleksandr-bezushko.jpg",
    name: "Безушко Олександр",
    department: "ННІПД",
    course: 2,
    sport: "kettlebell",
    rank: "I спортивний розряд",
    achievements:
      "16 місце — Учасник відкритого кубка МВС України з гирьового спорту (Національний (відомчий), 07.06.2026; ривок з довільною зміною рук Р12/24кг — 165 разів, вагова категорія до 95 кг); " +
      "13 місце — Учасник чемпіонату України серед студентів ЗВО з гирьового спорту (Національний, 25.04.2026; ривок — 140 разів, вагова категорія до 95 кг). " +
      "Джерело: реєстр спортсменів НАВС.",
  },
  {
    photo: "nikita-bettyar.jpg",
    name: "Беттяр Нікіта",
    department: "ННІПД",
    course: 1,
    sport: "sambo",
    rank: "КМС України",
    achievements:
      "3 місце — Кубок України серед чоловіків та жінок; " +
      "2 місце — Кубок України з боротьби самбо; " +
      "3 місце — Чемпіонат України з боротьби самбо; " +
      "1 місце — Кубок України з бойового самбо; " +
      "3 місце — Чемпіонат з боротьби самбо серед курсантів ЗВО системи МВС (усі — національний рівень). " +
      "Джерело: реєстр спортсменів НАВС.",
  },
  {
    photo: "viktoriya-bondaryeva.jpg",
    name: "Бондарєва Вікторія",
    department: "ННІПД",
    course: 1,
    sport: "athletics",
    rank: "КМС України",
    achievements:
      "1 місце — Командний чемпіонат України серед молоді, 6 км (Національний, 25.07.2026); " +
      "Чемпіонат України з легкої атлетики серед молоді (національний, 24.04.2026); " +
      "Чемпіонат України серед молоді U23, м. Львів (Національний, 26.08.2025). " +
      "Джерело: реєстр спортсменів НАВС.",
  },
  {
    photo: "artem-borysenko.jpg",
    name: "Борисенко Артем",
    department: "ННІПД",
    course: 1,
    sport: "kettlebell",
    rank: "Майстер спорту України",
    achievements:
      "Чемпіон світу серед юнаків з гирьового спорту 2026 року (Міжнародний, 14.11.2026; поштовх 24кг — 95 разів, ривок — 180 разів, сума двоборства 185 балів); " +
      "Переможець чемпіонату КМО ФСТ «Динамо» України з гирьового спорту (Регіональний, 15.10.2026; ривок Р12/24кг — 280 разів, вагова категорія до 68 кг); " +
      "Переможець першості світу 2025 (Міжнародний, 15.10.2025; 3 золоті медалі); " +
      "Чемпіон Європи 2025 (Міжнародний, 09.04.2025; 3 золоті медалі); " +
      "Чемпіон Європи 2024 (Міжнародний, 17.04.2024; 4 золоті медалі). " +
      "Джерело: реєстр спортсменів НАВС.",
  },
];

async function login() {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.token;
}

async function createAthlete(token, athlete) {
  const res = await fetch(`${API_URL}/athletes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: athlete.name,
      department: athlete.department,
      course: athlete.course,
      sport: athlete.sport,
      rank: athlete.rank,
      achievements: athlete.achievements,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `Create failed for ${athlete.name}: ${res.status} ${await res.text()}`,
    );
  }
  return res.json();
}

async function uploadAvatar(token, id, photoPath) {
  const fileBuffer = await readFile(photoPath);
  const form = new FormData();
  form.append("avatar", new Blob([fileBuffer]), path.basename(photoPath));

  const res = await fetch(`${API_URL}/athletes/${id}/avatar`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error(
      `Avatar upload failed for ${id}: ${res.status} ${await res.text()}`,
    );
  }
  return res.json();
}

async function main() {
  console.log(`Logging in as ${EMAIL}...`);
  const token = await login();
  console.log("Logged in. Starting import of", ATHLETES.length, "athletes...");

  const results = [];
  for (const athlete of ATHLETES) {
    console.log(`\n-> ${athlete.name}`);
    const created = await createAthlete(token, athlete);
    console.log(`   created _id=${created._id}`);

    const photoPath = path.join(PHOTOS_DIR, athlete.photo);
    const withAvatar = await uploadAvatar(token, created._id, photoPath);
    console.log(`   avatar uploaded: ${withAvatar.avatarURL}`);

    results.push({
      name: athlete.name,
      id: created._id,
      avatarURL: withAvatar.avatarURL,
    });
  }

  console.log("\nDone. Summary:");
  console.table(results);
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
