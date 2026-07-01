import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Mail,
  MapPin,
  Menu,
  PlayCircle,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import data from './content/site.json';
import './styles.css';

const accentClasses = ['amber', 'teal', 'clay', 'green', 'violet', 'blue', 'rose'];

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="На главную">
          <span className="brand__mark">МИП</span>
          <span>
            <strong>{data.museum.name}</strong>
            <small>{data.museum.subtitle}</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Основная навигация">
          {data.navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-label="Открыть меню"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isOpen && (
        <nav className="mobile-nav" aria-label="Мобильная навигация">
          {data.navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__content">
        <p className="eyebrow">{data.museum.subtitle}</p>
        <h1>Музей, где историю измерений можно увидеть, потрогать и понять.</h1>
        <p className="hero__lead">{data.museum.lead}</p>
        <div className="hero__actions">
          <a className="button button--primary" href="#collection">
            Смотреть коллекцию <ArrowRight size={18} />
          </a>
          <a className="button button--secondary" href="#tour">
            <PlayCircle size={18} /> Виртуальный тур
          </a>
        </div>
      </div>

      <div className="hero__visual" aria-label="Декоративная композиция приборов">
        <div className="instrument instrument--dial">0–100</div>
        <div className="instrument instrument--scale">mm</div>
        <div className="instrument instrument--wave">Hz</div>
        <div className="hero__glass">
          <Sparkles size={28} />
          <strong>1500+</strong>
          <span>экспонатов в фондах музея</span>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats" aria-label="Ключевые факты">
      {data.stats.map((stat) => (
        <article className="stat" key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </article>
      ))}
    </section>
  );
}

function About() {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = expanded ? data.history : data.history.slice(0, 2);

  return (
    <section className="split-section" id="about">
      <div>
        <p className="eyebrow">История</p>
        <h2>От сервисного предприятия КИП до музейного пространства</h2>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <button className="text-button" type="button" onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Свернуть историю' : 'Показать полную историю'}
        </button>
      </div>

      <aside className="info-card">
        <p className="eyebrow">О музее</p>
        <h3>Техническая культура для посетителей любого возраста</h3>
        <p>{data.history.at(-1)}</p>
        <ul>
          {data.visit.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

function Featured() {
  return (
    <section className="section" id="featured">
      <div className="section__heading">
        <p className="eyebrow">Уникальные экспонаты</p>
        <h2>Семь предметов для первого знакомства</h2>
      </div>

      <div className="featured-grid">
        {data.featured.map((item, index) => (
          <article className={`exhibit-card exhibit-card--${accentClasses[index]}`} key={item.title}>
            <div className="exhibit-card__image">
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="exhibit-card__body">
              <small>{item.tag}</small>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Collection() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Все');

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return data.collection.filter((item) => {
      const matchesCategory = category === 'Все' || item.category === category;
      const matchesQuery = !normalizedQuery || item.title.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <section className="section collection" id="collection">
      <div className="section__heading section__heading--row">
        <div>
          <p className="eyebrow">Коллекция</p>
          <h2>Каталог экспонатов</h2>
          <p>
            Перенесена структура каталога, публичные категории и первые карточки. Для полного импорта
            достаточно заменить JSON экспортом из WordPress/БД.
          </p>
        </div>
        <label className="search-field">
          <Search size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти экспонат"
          />
        </label>
      </div>

      <div className="category-list" aria-label="Категории коллекции">
        {data.categories.map((item) => (
          <button
            className={category === item.name ? 'is-active' : ''}
            key={item.name}
            type="button"
            onClick={() => setCategory(item.name)}
          >
            {item.name} <span>{item.count}</span>
          </button>
        ))}
      </div>

      <div className="catalog-grid">
        {filteredItems.map((item, index) => (
          <article className="catalog-card" key={item.title}>
            <span className="catalog-card__number">#{String(index + 1).padStart(3, '0')}</span>
            <small>{item.category}</small>
            <h3>{item.title}</h3>
            <p>Карточка готова для фото, описания, года выпуска, производителя и инвентарного номера.</p>
          </article>
        ))}
      </div>

      {filteredItems.length === 0 && <p className="empty-state">По этому запросу экспонаты не найдены.</p>}
    </section>
  );
}

function TourAndAwards() {
  return (
    <section className="tour-awards" id="tour">
      <article className="tour-card">
        <p className="eyebrow">Видеоматериалы</p>
        <h2>Виртуальный тур готов к подключению</h2>
        <p>
          На текущем сайте есть переход «Виртуальный тур». Новый блок оставлен отдельным модулем: сюда можно
          вставить iframe панорамы, видеоэкскурсию или набор роликов без изменения остальной страницы.
        </p>
        <a className="button button--primary" href="#visit">
          Планировать визит <ChevronRight size={18} />
        </a>
      </article>

      <article className="awards-card">
        <BookOpen size={34} />
        <h3>Достижения музея</h3>
        <p>
          Музей отмечен профессиональными и отраслевыми наградами за вклад в развитие технической культуры.
        </p>
        <a href={data.museum.awardsUrl} target="_blank" rel="noreferrer">
          В библиотеку наград <ExternalLink size={16} />
        </a>
      </article>
    </section>
  );
}

function NewsAndVisit() {
  return (
    <section className="split-section" id="news">
      <div>
        <p className="eyebrow">Новости</p>
        <h2>События музея</h2>
        <div className="news-list">
          {data.news.map((item) => (
            <article className="news-card" key={item.title}>
              <time>{item.date}</time>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>

      <aside className="visit-card" id="visit">
        <p className="eyebrow">Образование</p>
        <h2>Экскурсии, мастер-классы и проекты</h2>
        <p>
          Кураторы рассказывают о принципах измерений и работе приборов, а учащиеся демонстрируют собственные
          инженерные идеи. Проекты собраны в библиотеке проектов.
        </p>
        <a className="button button--secondary" href={data.museum.projectsUrl} target="_blank" rel="noreferrer">
          В библиотеку проектов <ExternalLink size={16} />
        </a>
      </aside>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{data.museum.name}</strong>
        <p>
          <MapPin size={17} /> {data.museum.address}
        </p>
        <p>
          <Mail size={17} /> <a href={`mailto:${data.museum.email}`}>{data.museum.email}</a>
        </p>
      </div>
      <div className="footer-links">
        <a href={data.museum.companyUrl} target="_blank" rel="noreferrer">
          Сайт ЭРИС
        </a>
        <a href={data.museum.vkUrl} target="_blank" rel="noreferrer">
          Vk
        </a>
        <span>© 2026 Все права защищены</span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <Featured />
        <Collection />
        <TourAndAwards />
        <NewsAndVisit />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
