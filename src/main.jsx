import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  Mail,
  MapPin,
  Menu,
  PlayCircle,
  Search,
  X,
} from 'lucide-react';
import data from './content/site.json';
import './styles.css';

function AppLink({ href, children, className, onClick }) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:');
  if (isExternal) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={href} onClick={onClick}>
      {children}
    </Link>
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header-shell">
      <div className="topline">
        <span>{data.museum.company}</span>
        <a href={`mailto:${data.museum.email}`}>{data.museum.email}</a>
      </div>
      <div className="header">
        <Link className="brand" to="/">
          <span className="brand-mark">Э</span>
          <span>
            <strong>{data.museum.name}</strong>
            <small>{data.museum.subtitle}</small>
          </span>
        </Link>

        <nav className="nav desktop" aria-label="Основная навигация">
          {data.navigation.map((item) => (
            <NavLink key={item.href} to={item.href} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
          <a className="nav-cta" href={data.museum.projectsUrl} target="_blank" rel="noreferrer">
            Библиотека проектов
          </a>
        </nav>

        <button className="menu-toggle" type="button" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <nav className="nav mobile" aria-label="Мобильная навигация">
          {data.navigation.map((item) => (
            <NavLink key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <a href={data.museum.projectsUrl} target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)}>
            Библиотека проектов
          </a>
        </nav>
      )}
    </header>
  );
}

function PageHero({ eyebrow, title, lead, children }) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {children && <div className="page-hero__side">{children}</div>}
    </section>
  );
}

function Stats() {
  return (
    <div className="stats-grid">
      {data.stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </article>
      ))}
    </div>
  );
}

function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="eyebrow">{data.hero.caption}</p>
          <h1>{data.hero.title}</h1>
          <p className="lead">{data.hero.lead}</p>
          <div className="actions">
            <Link className="button primary" to="/collection">
              Открыть коллекцию <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" to="/media">
              <PlayCircle size={18} /> Видеоматериалы
            </Link>
          </div>
        </div>
        <div className="hero-panel" aria-label="Корпоративная иллюстрация приборов">
          <div className="device device-main">
            <span>ERIS</span>
            <strong>300</strong>
          </div>
          <div className="device device-small">ppm</div>
          <div className="device device-ring">KIP</div>
        </div>
      </section>
      <Stats />
      <section className="content-band">
        <div>
          <p className="eyebrow">О музее</p>
          <h2>Корпоративная память и инженерное образование</h2>
          <p>{data.history[0]}</p>
          <p>{data.history[3]}</p>
          <Link className="text-link" to="/about">
            Подробнее о музее <ChevronRight size={16} />
          </Link>
        </div>
        <div className="direction-list">
          {data.directions.map((direction) => (
            <span key={direction}>{direction}</span>
          ))}
        </div>
      </section>
      <FeaturedSection limit={4} />
      <NewsPreview />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="О музее"
        title="История коллекции ЭРИС и пространство для посетителей"
        lead="Музей показывает, как развивалась измерительная техника и почему точность измерений важна для промышленности, науки и повседневной жизни."
      >
        <div className="contact-card compact">
          <Building2 />
          <strong>{data.museum.company}</strong>
          <span>{data.museum.address}</span>
        </div>
      </PageHero>
      <section className="two-column">
        <article className="white-card">
          <h2>История</h2>
          {data.history.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
        <aside className="white-card accent-card">
          <h2>Направления работы</h2>
          <ul>
            {data.directions.map((direction) => (
              <li key={direction}>{direction}</li>
            ))}
          </ul>
          <Link className="button primary" to="/contacts">
            Запланировать визит
          </Link>
        </aside>
      </section>
    </>
  );
}

function FeaturedSection({ limit }) {
  const items = limit ? data.featured.slice(0, limit) : data.featured;
  return (
    <section className="section-block">
      <div className="section-head">
        <div>
          <p className="eyebrow">Экспонаты</p>
          <h2>Уникальные предметы коллекции</h2>
        </div>
        {limit && (
          <Link className="text-link" to="/collection">
            Весь каталог <ChevronRight size={16} />
          </Link>
        )}
      </div>
      <div className="exhibit-grid">
        {items.map((item, index) => (
          <article className="exhibit-card" key={item.title}>
            <div className="exhibit-thumb">
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div>
              <small>{item.category}</small>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CollectionPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Все');
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return data.collection.filter((item) => {
      const categoryOk = category === 'Все' || item.category === category;
      const queryOk = !term || item.title.toLowerCase().includes(term);
      return categoryOk && queryOk;
    });
  }, [query, category]);

  return (
    <>
      <PageHero
        eyebrow="Коллекция"
        title="Каталог измерительных приборов"
        lead="Каталог сделан отдельной страницей: фильтры, поиск и карточки готовы к расширению полным экспортом из WordPress/БД."
      />
      <section className="catalog-layout">
        <aside className="filter-panel">
          <label className="search-field">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск" />
          </label>
          <div className="category-list">
            {data.categories.map((item) => (
              <button
                key={item.name}
                className={category === item.name ? 'active' : ''}
                type="button"
                onClick={() => setCategory(item.name)}
              >
                <span>{item.name}</span>
                <b>{item.count}</b>
              </button>
            ))}
          </div>
        </aside>
        <div className="catalog-results">
          <div className="result-head">
            <strong>{filtered.length} карточек</strong>
            <span>из перенесенного набора</span>
          </div>
          <div className="catalog-grid">
            {filtered.map((item) => (
              <Link className="catalog-card catalog-card--link" key={item.title} to={`/collection/${item.slug}`}>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
          {!filtered.length && <p className="empty">По этому запросу ничего не найдено.</p>}
        </div>
      </section>
    </>
  );
}


function ExhibitPage() {
  const slug = window.location.pathname.split('/').filter(Boolean).at(-1);
  const item = data.collection.find((entry) => entry.slug === slug) || data.collection[0];
  const related = data.collection.filter((entry) => entry.category === item.category && entry.slug !== item.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow={item.category} title={item.title} lead={item.description}>
        <div className="contact-card compact">
          <strong>Инвентарный номер</strong>
          <span>{item.inventoryNumber}</span>
        </div>
      </PageHero>
      <section className="two-column">
        <article className="white-card">
          <h2>Описание экспоната</h2>
          <p>{item.description}</p>
          <p>Страница подготовлена под полный музейный паспорт: изображение, период, производитель, страна, технические характеристики, сохранность и историю использования.</p>
          <Link className="text-link" to="/collection">← Вернуться в каталог</Link>
        </article>
        <aside className="white-card accent-card">
          <h2>Похожие экспонаты</h2>
          <ul>
            {(related.length ? related : data.collection.slice(0, 3)).map((entry) => (
              <li key={entry.slug}>
                <Link to={`/collection/${entry.slug}`}>{entry.title}</Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  );
}

function NewsPreview() {
  return (
    <section className="section-block">
      <div className="section-head">
        <div>
          <p className="eyebrow">Новости</p>
          <h2>События музея</h2>
        </div>
        <Link className="text-link" to="/news">
          Все новости <ChevronRight size={16} />
        </Link>
      </div>
      <div className="news-grid">
        {data.news.slice(0, 3).map((item) => (
          <NewsCard item={item} key={item.title} />
        ))}
      </div>
    </section>
  );
}

function NewsCard({ item }) {
  return (
    <article className="news-card">
      <time>
        <CalendarDays size={16} /> {item.date}
      </time>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
    </article>
  );
}

function NewsPage() {
  return (
    <>
      <PageHero eyebrow="Новости" title="События и публикации музея" lead="Список новостей перенесен отдельной страницей, как на старом сайте, но без WordPress-зависимостей." />
      <section className="news-grid news-grid--page">
        {data.news.map((item) => (
          <NewsCard item={item} key={item.title} />
        ))}
      </section>
    </>
  );
}

function MediaPage() {
  return (
    <>
      <PageHero eyebrow="Видеоматериалы" title="Виртуальный тур и медиаархив" lead="Раздел подготовлен как отдельная страница: сюда можно подключить существующий тур, видеоэкскурсии и корпоративные ролики." />
      <section className="media-grid">
        {data.media.map((item) => (
          <article className="media-card" key={item.title}>
            <PlayCircle size={34} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <AppLink className="text-link" href={item.href}>
              Открыть <ExternalLink size={15} />
            </AppLink>
          </article>
        ))}
      </section>
    </>
  );
}

function ContactsPage() {
  return (
    <>
      <PageHero eyebrow="Контакты" title="Как связаться с музеем" lead="Контакты вынесены на отдельную страницу, чтобы посетителю было проще найти адрес, почту и корпоративные ссылки." />
      <section className="contacts-grid">
        <div className="contact-card">
          <MapPin />
          <h3>Адрес</h3>
          <p>{data.museum.address}</p>
        </div>
        <div className="contact-card">
          <Mail />
          <h3>Email</h3>
          <p><a href={`mailto:${data.museum.email}`}>{data.museum.email}</a></p>
        </div>
        <div className="contact-card">
          <ExternalLink />
          <h3>Ссылки</h3>
          <p><a href={data.museum.companyUrl}>Сайт ЭРИС</a></p>
          <p><a href={data.museum.vkUrl}>Vk</a></p>
        </div>
      </section>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>{data.museum.name}</strong>
        <p>{data.museum.company} · {data.museum.address}</p>
      </div>
      <div>
        <a href={data.museum.companyUrl}>Сайт ЭРИС</a>
        <a href={data.museum.vkUrl}>Vk</a>
        <a href={`mailto:${data.museum.email}`}>{data.museum.email}</a>
      </div>
    </footer>
  );
}

function LegacyRedirects() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/o-muzee" element={<AboutPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/novosti" element={<NewsPage />} />
      <Route path="/collection" element={<CollectionPage />} />
      <Route path="/collection/:slug" element={<ExhibitPage />} />
      <Route path="/kollekcija" element={<CollectionPage />} />
      <Route path="/kollekciya" element={<CollectionPage />} />
      <Route path="/media" element={<MediaPage />} />
      <Route path="/videomaterialy" element={<MediaPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <LegacyRedirects />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
