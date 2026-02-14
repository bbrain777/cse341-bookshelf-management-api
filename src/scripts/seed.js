require("dotenv").config();
const { connectDB } = require("../db/connect");

const MIN_ITEMS = 10;

const AUTHOR_SEED = [
  {
    firstName: "Chimamanda",
    lastName: "Adichie",
    nationality: "Nigerian",
    genres: ["Literary Fiction", "Essays"],
    bio: "Nigerian writer known for novels and essays on identity, migration, and feminism.",
  },
  {
    firstName: "Haruki",
    lastName: "Murakami",
    nationality: "Japanese",
    genres: ["Magical Realism", "Contemporary Fiction"],
    bio: "Japanese novelist whose works blend surreal storytelling with modern urban life.",
  },
  {
    firstName: "Isabel",
    lastName: "Allende",
    nationality: "Chilean",
    genres: ["Historical Fiction", "Magical Realism"],
    bio: "Chilean-American author celebrated for multi-generational historical novels.",
  },
  {
    firstName: "Kazuo",
    lastName: "Ishiguro",
    nationality: "British",
    genres: ["Literary Fiction", "Speculative Fiction"],
    bio: "Nobel Prize-winning British novelist known for restrained, emotionally layered prose.",
  },
  {
    firstName: "Margaret",
    lastName: "Atwood",
    nationality: "Canadian",
    genres: ["Dystopian Fiction", "Speculative Fiction"],
    bio: "Canadian author recognized for influential novels on power, gender, and society.",
  },
  {
    firstName: "Colson",
    lastName: "Whitehead",
    nationality: "American",
    genres: ["Historical Fiction", "Literary Fiction"],
    bio: "Pulitzer Prize-winning American novelist exploring race and history in inventive forms.",
  },
  {
    firstName: "Elena",
    lastName: "Ferrante",
    nationality: "Italian",
    genres: ["Literary Fiction", "Coming-of-Age"],
    bio: "Italian novelist acclaimed for psychologically rich narratives about friendship and class.",
  },
  {
    firstName: "Celeste",
    lastName: "Ng",
    nationality: "American",
    genres: ["Literary Fiction", "Domestic Drama"],
    bio: "American author whose novels center on family dynamics, identity, and belonging.",
  },
  {
    firstName: "Viet",
    lastName: "Thanh Nguyen",
    nationality: "Vietnamese-American",
    genres: ["Literary Fiction", "Political Fiction"],
    bio: "Pulitzer Prize-winning writer focused on memory, war, and diaspora.",
  },
  {
    firstName: "Yaa",
    lastName: "Gyasi",
    nationality: "Ghanaian-American",
    genres: ["Historical Fiction", "Literary Fiction"],
    bio: "Ghanaian-American novelist known for intergenerational stories about legacy and identity.",
  },
  {
    firstName: "Sally",
    lastName: "Rooney",
    nationality: "Irish",
    genres: ["Contemporary Fiction", "Literary Fiction"],
    bio: "Irish novelist writing closely observed stories about relationships and class.",
  },
  {
    firstName: "Abdulrazak",
    lastName: "Gurnah",
    nationality: "Tanzanian-British",
    genres: ["Postcolonial Fiction", "Literary Fiction"],
    bio: "Nobel Prize-winning novelist whose works engage migration, memory, and colonial history.",
  },
];

const BOOK_SEED = [
  { title: "Half of a Yellow Sun", author: "Chimamanda Adichie", genre: "Historical Fiction", isbn: "9780007200283" },
  { title: "Kafka on the Shore", author: "Haruki Murakami", genre: "Magical Realism", isbn: "9781400079278" },
  { title: "The House of the Spirits", author: "Isabel Allende", genre: "Historical Fiction", isbn: "9781501117015" },
  { title: "Never Let Me Go", author: "Kazuo Ishiguro", genre: "Speculative Fiction", isbn: "9781400078776" },
  { title: "The Handmaid's Tale", author: "Margaret Atwood", genre: "Dystopian Fiction", isbn: "9780385490818" },
  { title: "The Underground Railroad", author: "Colson Whitehead", genre: "Historical Fiction", isbn: "9780385542364" },
  { title: "My Brilliant Friend", author: "Elena Ferrante", genre: "Literary Fiction", isbn: "9781609450786" },
  { title: "Little Fires Everywhere", author: "Celeste Ng", genre: "Literary Fiction", isbn: "9780735224315" },
  { title: "The Sympathizer", author: "Viet Thanh Nguyen", genre: "Political Fiction", isbn: "9780802123459" },
  { title: "Homegoing", author: "Yaa Gyasi", genre: "Historical Fiction", isbn: "9781101971062" },
  { title: "Normal People", author: "Sally Rooney", genre: "Contemporary Fiction", isbn: "9781984822185" },
  { title: "Afterlives", author: "Abdulrazak Gurnah", genre: "Postcolonial Fiction", isbn: "9780593537084" },
];

const MEMBER_SEED = [
  { name: "Aisha Bello", email: "aisha.bello@cityreaders.org" },
  { name: "Daniel Kim", email: "daniel.kim@cityreaders.org" },
  { name: "Priya Nair", email: "priya.nair@cityreaders.org" },
  { name: "Miguel Santos", email: "miguel.santos@cityreaders.org" },
  { name: "Zoe Thompson", email: "zoe.thompson@cityreaders.org" },
  { name: "Noah Greene", email: "noah.greene@cityreaders.org" },
  { name: "Fatima Yusuf", email: "fatima.yusuf@cityreaders.org" },
  { name: "Lucas Pereira", email: "lucas.pereira@cityreaders.org" },
  { name: "Hannah Park", email: "hannah.park@cityreaders.org" },
  { name: "Ibrahim Musa", email: "ibrahim.musa@cityreaders.org" },
  { name: "Amelia Chen", email: "amelia.chen@cityreaders.org" },
  { name: "Mateo Rivera", email: "mateo.rivera@cityreaders.org" },
];

const SHELF_SEED = [
  { name: "African Voices", description: "Contemporary and classic works by African authors.", visibility: "public" },
  { name: "Modern Classics", description: "Influential late 20th and 21st century fiction.", visibility: "public" },
  { name: "Award Winners", description: "Pulitzer, Booker, and Nobel-recognized titles.", visibility: "shared" },
  { name: "Book Club Picks", description: "Monthly discussion books with broad appeal.", visibility: "shared" },
  { name: "Historical Journeys", description: "Fiction rooted in significant historical events.", visibility: "public" },
  { name: "Speculative Futures", description: "Dystopian and speculative thought experiments.", visibility: "shared" },
  { name: "Quiet Evenings", description: "Character-driven literary novels for slow reading.", visibility: "private" },
  { name: "Global Fiction", description: "Stories translated from and inspired by world literature.", visibility: "public" },
  { name: "New Arrivals", description: "Recent acquisitions and current recommendations.", visibility: "shared" },
  { name: "Staff Favorites", description: "Curated staff picks with personal notes.", visibility: "public" },
  { name: "Weekend Reads", description: "Short, gripping titles for a two-day read.", visibility: "private" },
  { name: "Deep Dives", description: "Layered novels with rich themes and symbolism.", visibility: "shared" },
];

function slug(input) {
  return String(input).trim().toLowerCase();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSubset(items, minCount, maxCount) {
  const copy = [...items];
  const count = Math.min(copy.length, randomInt(minCount, maxCount));
  const selected = [];

  while (selected.length < count && copy.length > 0) {
    const idx = randomInt(0, copy.length - 1);
    selected.push(copy.splice(idx, 1)[0]);
  }

  return selected;
}

function dateDaysAgo(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

async function ensureAuthors(db) {
  const authorsCol = db.collection("authors");
  const existing = await authorsCol.find({}).toArray();
  const existingNames = new Set(existing.map((a) => slug(`${a.firstName} ${a.lastName}`)));

  if (existing.length < MIN_ITEMS) {
    const needed = MIN_ITEMS - existing.length;
    const toInsert = AUTHOR_SEED.filter((a) => !existingNames.has(slug(`${a.firstName} ${a.lastName}`)))
      .slice(0, needed)
      .map((a) => ({ ...a, createdAt: new Date() }));

    if (toInsert.length > 0) {
      await authorsCol.insertMany(toInsert);
    }
  }

  return authorsCol.find({}).toArray();
}

async function ensureBooks(db, authors) {
  const booksCol = db.collection("books");
  const existing = await booksCol.find({}).toArray();
  const existingTitles = new Set(existing.map((b) => slug(b.title)));
  const authorLookup = new Map(authors.map((a) => [slug(`${a.firstName} ${a.lastName}`), String(a._id)]));

  if (existing.length < MIN_ITEMS) {
    const needed = MIN_ITEMS - existing.length;
    const toInsert = BOOK_SEED.filter((b) => !existingTitles.has(slug(b.title)))
      .slice(0, needed)
      .map((b, index) => ({
        ...b,
        authorId: authorLookup.get(slug(b.author)),
        copiesAvailable: randomInt(2, 9),
        shelfNumber: `S-${String(index + 1).padStart(2, "0")}`,
        status: ["planned", "reading", "completed"][index % 3],
        createdAt: new Date(),
      }));

    if (toInsert.length > 0) {
      await booksCol.insertMany(toInsert);
    }
  }

  return booksCol.find({}).toArray();
}

async function ensureMembers(db) {
  const membersCol = db.collection("members");
  const existing = await membersCol.find({}).toArray();
  const existingEmails = new Set(existing.map((m) => slug(m.email)));

  if (existing.length < MIN_ITEMS) {
    const needed = MIN_ITEMS - existing.length;
    const toInsert = MEMBER_SEED.filter((m) => !existingEmails.has(slug(m.email)))
      .slice(0, needed)
      .map((m) => ({ ...m, createdAt: new Date() }));

    if (toInsert.length > 0) {
      await membersCol.insertMany(toInsert);
    }
  }

  return membersCol.find({}).toArray();
}

async function ensureShelves(db, books, members) {
  const shelvesCol = db.collection("shelves");
  const existing = await shelvesCol.find({}).toArray();
  const existingNames = new Set(existing.map((s) => slug(s.name)));

  if (existing.length < MIN_ITEMS) {
    const needed = MIN_ITEMS - existing.length;
    const toInsert = SHELF_SEED.filter((s) => !existingNames.has(slug(s.name)))
      .slice(0, needed)
      .map((s) => {
        const owner = members[randomInt(0, members.length - 1)];
        const bookIds = randomSubset(books, 2, 5).map((b) => String(b._id));
        const now = new Date();
        return {
          ...s,
          ownerUserId: String(owner._id),
          bookIds,
          createdAt: now,
          updatedAt: now,
        };
      });

    if (toInsert.length > 0) {
      await shelvesCol.insertMany(toInsert);
    }
  }

  return shelvesCol.find({}).toArray();
}

async function ensureLoans(db, books, members) {
  const loansCol = db.collection("loans");
  const existingCount = await loansCol.countDocuments({});

  if (existingCount < MIN_ITEMS) {
    const needed = MIN_ITEMS - existingCount;
    const toInsert = [];
    const statuses = ["active", "returned", "overdue"];

    for (let i = 0; i < needed; i += 1) {
      const book = books[(i + randomInt(0, books.length - 1)) % books.length];
      const member = members[(i + randomInt(0, members.length - 1)) % members.length];
      const loanDate = dateDaysAgo(randomInt(1, 45));
      const dueDate = new Date(loanDate);
      dueDate.setDate(dueDate.getDate() + 14);
      const status = statuses[i % statuses.length];

      toInsert.push({
        bookId: String(book._id),
        memberId: String(member._id),
        loanDate,
        dueDate,
        status,
        createdAt: new Date(),
      });
    }

    if (toInsert.length > 0) {
      await loansCol.insertMany(toInsert);
    }
  }
}

async function logCounts(db) {
  const collections = ["authors", "books", "members", "shelves", "loans"];
  const counts = await Promise.all(
    collections.map(async (name) => ({
      name,
      count: await db.collection(name).countDocuments({}),
    })),
  );

  counts.forEach((entry) => {
    console.log(`${entry.name}: ${entry.count}`);
  });
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in environment");
  }

  const db = await connectDB(process.env.MONGODB_URI);
  const authors = await ensureAuthors(db);
  const books = await ensureBooks(db, authors);
  const members = await ensureMembers(db);
  await ensureShelves(db, books, members);
  await ensureLoans(db, books, members);

  console.log("Seed complete. Current collection counts:");
  await logCounts(db);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
