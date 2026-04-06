// DanceLog – Datenverwaltung mit localStorage

const STORAGE_KEY = 'dancelog_data';

export const STATUS = {
  NICHT_BEGONNEN: 'nicht-begonnen',
  IN_UEBUNG: 'in-uebung',
  SICHER: 'sicher',
};

export const STATUS_LABELS = {
  [STATUS.NICHT_BEGONNEN]: 'Nicht begonnen',
  [STATUS.IN_UEBUNG]: 'In Übung',
  [STATUS.SICHER]: 'Sicher in Ausführung',
};

export const CATEGORIES = [
  'Tanzunterricht',
  'Workshop',
  'Festival',
  'Übung Solo',
  'Übung mit Partner',
  'Improvisation',
];

export const STYLE_TAGS = [
  'Flow',
  'Fundamentals',
  'Footwork',
  'Dominican Bachata',
  'Sensual',
];

const initialData = {
  projects: [
    {
      id: 'p1',
      title: 'Bachata Sensual Flow',
      category: 'Tanzunterricht',
      demoVideoId: 'JnODTEK-pgI',
      demoNotes:
        'Fokus auf weiche Körperwellen und flüssige Verbindung. Schultern locker, Hüfte folgt der Musik. Schrittfolge: 1-2-3-tap, 5-6-7-tap. Besonders auf den Körperkontakt und die gemeinsame Bewegungsrichtung achten.',
      practiceVideos: [
        {
          id: 'v1',
          projectId: 'p1',
          title: 'Grundschritt & Körperwelle',
          videoId: 'xHl2-5_-OGE',
          date: '2025-03-28',
          status: STATUS.SICHER,
          trainedDates: ['2025-03-28', '2025-04-01', '2025-04-05'],
          last_practiced_at: '2025-04-05',
          tags: ['Körperwelle', 'Grundschritt'],
          style_tags: ['Flow', 'Sensual'],
          category: 'Tanzunterricht',
        },
        {
          id: 'v2',
          projectId: 'p1',
          title: 'Drehung mit Körperkontakt',
          videoId: 'KQ3gIL2B3wo',
          date: '2025-04-01',
          status: STATUS.IN_UEBUNG,
          trainedDates: ['2025-04-01', '2025-04-03'],
          last_practiced_at: '2025-04-03',
          tags: ['Drehung'],
          style_tags: ['Sensual'],
          category: 'Tanzunterricht',
        },
        {
          id: 'v3',
          projectId: 'p1',
          title: 'Rückwärtsbewegung & Dip',
          videoId: 'YlUKcNnnaf8',
          date: '2025-04-04',
          status: STATUS.NICHT_BEGONNEN,
          trainedDates: [],
          last_practiced_at: null,
          tags: ['Dip', 'Rückwärtsbewegung'],
          style_tags: ['Flow', 'Sensual'],
          category: 'Tanzunterricht',
        },
      ],
    },
    {
      id: 'p2',
      title: 'Bachata Moderna Footwork',
      category: 'Workshop',
      demoVideoId: 'KQ3gIL2B3wo',
      demoNotes:
        'Schnelle Fußarbeit kombiniert mit klassischen Drehfiguren. Gewichtsverlagerung ist entscheidend. Timing: eng am Beat bleiben, kein Verzögern bei den Synkopen.',
      practiceVideos: [
        {
          id: 'v4',
          projectId: 'p2',
          title: 'Synkopen-Schritte',
          videoId: 'YlUKcNnnaf8',
          date: '2025-03-20',
          status: STATUS.IN_UEBUNG,
          trainedDates: ['2025-03-20', '2025-03-25'],
          last_practiced_at: '2025-03-25',
          tags: ['Synkopen', 'Timing'],
          style_tags: ['Footwork', 'Fundamentals'],
          category: 'Workshop',
        },
        {
          id: 'v5',
          projectId: 'p2',
          title: 'Cross-Body Lead',
          videoId: 'JnODTEK-pgI',
          date: '2025-04-02',
          status: STATUS.NICHT_BEGONNEN,
          trainedDates: [],
          last_practiced_at: null,
          tags: ['Cross-Body'],
          style_tags: ['Fundamentals'],
          category: 'Workshop',
        },
      ],
    },
    {
      id: 'p3',
      title: 'Romantik-Figuren',
      category: 'Tanzunterricht',
      demoVideoId: 'YlUKcNnnaf8',
      demoNotes:
        'Langsame, ausdrucksstarke Figuren für romantische Musikpassagen. Augen-Kontakt halten, Bewegungen nicht übertreiben. Qualität vor Quantität.',
      practiceVideos: [
        {
          id: 'v6',
          projectId: 'p3',
          title: 'Embrace & Slide',
          videoId: 'xHl2-5_-OGE',
          date: '2025-04-05',
          status: STATUS.NICHT_BEGONNEN,
          trainedDates: [],
          last_practiced_at: null,
          tags: ['Embrace'],
          style_tags: ['Sensual', 'Flow'],
          category: 'Tanzunterricht',
        },
      ],
    },
  ],
};

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return initialData;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function getData() {
  return loadData();
}

export function updateData(updater) {
  const current = loadData();
  const next = updater(current);
  saveData(next);
  return next;
}

export function addTrainingToday(videoId) {
  const today = new Date().toISOString().split('T')[0];
  return updateData((data) => ({
    ...data,
    projects: data.projects.map((p) => ({
      ...p,
      practiceVideos: p.practiceVideos.map((v) =>
        v.id === videoId && !v.trainedDates.includes(today)
          ? { ...v, trainedDates: [...v.trainedDates, today], last_practiced_at: today }
          : v
      ),
    })),
  }));
}

export function updateVideoStatus(videoId, status) {
  return updateData((data) => ({
    ...data,
    projects: data.projects.map((p) => ({
      ...p,
      practiceVideos: p.practiceVideos.map((v) =>
        v.id === videoId ? { ...v, status } : v
      ),
    })),
  }));
}

export function addPracticeVideo(projectId, { title, videoId, notes = '' }) {
  const today = new Date().toISOString().split('T')[0];
  const newVideo = {
    id: `v${Date.now()}`,
    projectId,
    title,
    videoId,
    date: today,
    status: STATUS.NICHT_BEGONNEN,
    trainedDates: [],
    last_practiced_at: null,
    tags: [],
    style_tags: [],
    category: '',
    notes,
  };
  return updateData((data) => ({
    ...data,
    projects: data.projects.map((p) =>
      p.id === projectId
        ? { ...p, practiceVideos: [newVideo, ...p.practiceVideos] }
        : p
    ),
  }));
}

export function addProject({ title, category, demoVideoId, demoNotes = '' }) {
  const newProject = {
    id: `p${Date.now()}`,
    title,
    category,
    demoVideoId,
    demoNotes,
    practiceVideos: [],
  };
  return updateData((data) => ({
    ...data,
    projects: [...data.projects, newProject],
  }));
}

export function getAllVideos(data) {
  return data.projects
    .flatMap((p) =>
      p.practiceVideos.map((v) => ({ ...v, projectTitle: p.title }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getStreak(data) {
  const allDates = new Set(
    data.projects.flatMap((p) => p.practiceVideos.flatMap((v) => v.trainedDates))
  );
  const today = new Date().toISOString().split('T')[0];
  const startOffset = allDates.has(today) ? 0 : 1;
  let streak = 0;
  const base = new Date();
  for (let i = startOffset; i < 365; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (allDates.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getWeeklyActivity(data) {
  const allDates = data.projects.flatMap((p) =>
    p.practiceVideos.flatMap((v) => v.trainedDates)
  );
  const result = [];
  const base = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      count: allDates.filter((date) => date === dateStr).length,
      label: d.toLocaleDateString('de-DE', { weekday: 'short' }),
    });
  }
  return result;
}

export function getMonthlyActivity(data) {
  const allDates = data.projects.flatMap((p) =>
    p.practiceVideos.flatMap((v) => v.trainedDates)
  );
  const result = [];
  const base = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      count: allDates.filter((date) => date === dateStr).length,
    });
  }
  return result;
}

export function getYoutubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
