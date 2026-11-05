-- Starter content for Raymond's portfolio.
-- Run this once in the Supabase SQL editor after creating the tables and policies
-- from SUPABASE_SETUP.md. It inserts/updates content rows and adds the optional
-- `certificates.url` column if it is missing; it does not change RLS. Re-running is
-- safe for projects (upsert by slug) and publications (skips existing titles).

insert into public.projects
  (slug, title, description, thumbnail_url, tech_stack, features, live_url, github_url, published, display_order)
values
  (
    'bookcast-audiobooks',
    'Bookcast — Audiobook Web App',
    'Platform audiobook full-stack untuk menemukan dan streaming audiobook gratis melalui antarmuka yang intuitif dan responsif. Dilengkapi favorit dan riwayat mendengarkan agar pengguna dapat kembali ke konten yang sedang mereka nikmati.',
    '/mock/project-bookcast.svg',
    array['Next.js', 'Tailwind CSS', 'Supabase', 'LibriVox'],
    array[
      'Audiobook browsing, discovery, and streaming',
      'Favorites and listening-history persistence',
      'Responsive listening interface',
      'Supabase-backed content and user data'
    ],
    null,
    'https://github.com/Raym-z/bookcast-audiobook-app',
    true,
    2
  ),
  (
    'visa-immigration-platform',
    'Visa & Immigration Platform',
    'Sistem alur kerja visa dan imigrasi pemerintah internal yang dibangun selama magang di PT. Pro Sistimatika Automasi. Berkontribusi pada frontend dan backend, termasuk pembuatan laporan PDF otomatis.',
    '/mock/project-visa.svg',
    array['React', 'NodeJS', 'MySQL', 'PDF Generation'],
    array[
      'Internal visa and immigration workflow management',
      'Automated PDF generation for application data and reports',
      'Frontend and backend feature development',
      'Production internal tooling for government workflows'
    ],
    null,
    null,
    true,
    3
  ),
  (
    'choreboard',
    'Choreboard — Gamified Chores',
    'Pelacak tugas rumah tangga bergamifikasi yang dibangun dengan Laravel 12. Mendukung rumah tangga, undangan, akses berbasis peran, tugas berulang, bonus streak, dan hadiah berbasis papan peringkat.',
    '/mock/project-choreboard.svg',
    array['Laravel 12', 'MySQL', 'Tailwind CSS', 'FullCalendar'],
    array[
      'Task scheduling with frequency, deadlines, and streak bonuses',
      'Leaderboard and gamified rewards',
      'Role-based access for admins and members',
      'Household creation, invitations, and pivot-based task assignment'
    ],
    null,
    'https://github.com/Raym-z/ChoreBoard',
    true,
    4
  ),
  (
    'personal-finance-tracker',
    'Personal Finance Tracker',
    'Aplikasi web Laravel yang responsif untuk melacak pendapatan, pengeluaran, anggaran, dan tujuan keuangan, dengan dasbor Chart.js interaktif dan unggahan tanda terima yang aman.',
    '/mock/project-finance.svg',
    array['Laravel', 'MySQL', 'Chart.js', 'Bootstrap'],
    array[
      'Income, expense, and financial goal tracking',
      'Interactive Chart.js dashboard',
      'Custom tags, budget management, and receipt uploads',
      'Secure user authentication'
    ],
    null,
    'https://github.com/Raym-z/personal-finance-tracker',
    true,
    5
  ),
  (
  'nook-collaborative-notes',
  'Nook — Collaborative Notes',
  'Ruang kerja catatan kolaboratif dan produktivitas secara real-time dengan sinkronisasi file dan folder yang didukung Firebase. Dirancang untuk ribuan pengguna bersamaan dengan sinkronisasi di bawah 200ms dan kartu belajar yang dihasilkan AI.',
  '/mock/project-nook.svg',
  array['SvelteKit', 'Firebase', 'JavaScript', 'OpenAI API'],
  array[
    'Real-time file and folder synchronization',
    'Designed for thousands of concurrent users at <200ms latency',
    'ChatGPT-powered flashcard generation from notes',
    'Collaborative productivity workspace for shared knowledge'
  ],
  null,
  'https://github.com/IceEnemy/nook',
  true,
  1
  ),
  (
    'catastrophe-last-cat-standing',
    'Catastrophe: Last Cat Standing',
    'Proyek game Unity di mana saya membangun mekanik gameplay inti, AI musuh, pergerakan karakter, pertarungan, pembuatan dungeon, dan desain level. Diterbitkan di itch.io.',
    '/mock/project-catastrophe.svg',
    array['Unity', 'C#'],
    array[
      'Core gameplay mechanics and combat',
      'Enemy AI and dungeon generation',
      'Character movement and level design',
      'Game balancing and itch.io release'
    ],
    null,
    'https://github.com/Raym-z/Catastrophe',
    true,
    6
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  thumbnail_url = excluded.thumbnail_url,
  tech_stack = excluded.tech_stack,
  features = excluded.features,
  live_url = excluded.live_url,
  github_url = excluded.github_url,
  published = excluded.published,
  display_order = excluded.display_order,
  updated_at = now();

alter table public.certificates
  add column if not exists url text;

insert into public.certificates (title, issuer, image_url, url, display_order)
select
  'Uncovering Fake Profiles Using Machine Learning Algorithms',
  'ICoABCD 2024',
  '/mock/publication-fake-profiles.svg',
  'https://ieeexplore.ieee.org/document/10704439/',
  1
where not exists (
  select 1 from public.certificates
  where title = 'Uncovering Fake Profiles Using Machine Learning Algorithms'
);

insert into public.certificates (title, issuer, image_url, url, display_order)
select
  'Navigating the Ethics of AI-Generated Artworks Through Style Transfer Detection',
  'CENIM 2025',
  '/mock/publication-style-transfer.svg',
  'https://ieeexplore.ieee.org/document/11325823/',
  2
where not exists (
  select 1 from public.certificates
  where title = 'Navigating the Ethics of AI-Generated Artworks Through Style Transfer Detection'
);

update public.certificates
set url = 'https://ieeexplore.ieee.org/document/10704439/'
where title = 'Uncovering Fake Profiles Using Machine Learning Algorithms'
  and url is null;

update public.certificates
set url = 'https://ieeexplore.ieee.org/document/11325823/'
where title = 'Navigating the Ethics of AI-Generated Artworks Through Style Transfer Detection'
  and url is null;
