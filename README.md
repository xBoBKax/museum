# Музей измерительных приборов — новый сайт без WordPress

Это новая версия сайта `museum.eriskip.com` на React + Vite. Проект не использует WordPress, PHP-темы, плагины или WordPress API: после сборки получается обычный статический сайт из папки `dist/`.

## Почему выбран React + Vite

- сайт можно развернуть как статические файлы на Nginx, Apache2 или IIS;
- интерактивность выполняется на клиенте без тяжелого backend;
- контент вынесен в `src/content/site.json`, поэтому тексты, категории, новости и карточки можно менять без редактирования JSX;
- позже можно добавить headless CMS, админку или API, не переписывая интерфейс.

## Структура проекта

```text
.
├── index.html                 # HTML-точка входа
├── package.json               # npm-скрипты и зависимости
├── src/
│   ├── content/site.json      # редактируемый контент сайта
│   ├── main.jsx               # React-компоненты сайта
│   └── styles.css             # адаптивный дизайн и анимации
└── README.md                  # запуск, перенос, деплой и рекомендации
```

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте URL, который покажет Vite, обычно `http://localhost:5173/`.

## Production-сборка

```bash
npm run build
npm run preview
```

После `npm run build` готовые файлы лежат в `dist/`.

## Управление контентом

Основной контент находится в `src/content/site.json`:

- `museum` — название, контакты и внешние ссылки;
- `navigation` — пункты меню;
- `stats` — ключевые показатели;
- `history` — история музея;
- `featured` — уникальные экспонаты главной страницы;
- `categories` — категории каталога с количествами;
- `collection` — карточки экспонатов;
- `news` — новости;
- `visit` — образовательные активности.

Чтобы добавить экспонат, добавьте объект в массив `collection`:

```json
{ "title": "Название экспоната", "category": "Весы" }
```

## Перенесенные страницы и разделы

- Главная страница с приветственным экраном и CTA.
- История музея.
- О музее: 330 м², около 1500 экспонатов, образовательные активности.
- Уникальные экспонаты: механический шагомер, весы Беранже, почтовые весы, «Фотокор-1», БМИ-1, музыкальная шкатулка, СЧ-5А.
- Коллекция: публичные категории и первые 15 карточек каталога.
- Видеоматериалы / виртуальный тур — подготовлен отдельный модуль для iframe или видео.
- Достижения музея и ссылка на библиотеку наград.
- Образовательная деятельность и библиотека проектов.
- Новости, контакты, ссылки на сайт ЭРИС и Vk.

## Улучшения относительно старой версии

- Современный адаптивный интерфейс для ПК и телефонов.
- Sticky header и полноценное мобильное меню.
- Поиск по каталогу и фильтрация по категориям.
- Карточки экспонатов с понятной структурой под будущие фото и описания.
- Раскрываемый блок истории.
- Визуальный hero-блок без зависимости от старых WordPress-изображений.
- Чистая структура проекта, пригодная для развития.
- Подготовленные инструкции деплоя для Nginx, Apache2 и IIS.

## Что не перенесено автоматически

- Полные данные всех 873 карточек каталога. Публичная страница показывает пагинацию WordPress/JetEngine; для надежного переноса нужен экспорт WordPress/БД/CSV.
- Оригинальные медиафайлы. Чтобы не зависеть от `wp-content`, в проекте сейчас используются CSS-иллюстрации. После получения архива изображений их нужно положить в `src/assets` и добавить поля `image` в JSON.
- Реальный источник виртуального тура. Блок готов к подключению iframe/видео после получения URL.

## Деплой на Nginx

```bash
npm install
npm run build
sudo mkdir -p /var/www/museum
sudo rsync -a --delete dist/ /var/www/museum/
```

Пример конфига:

```nginx
server {
    listen 80;
    server_name museum.example.com;
    root /var/www/museum;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|webp|avif|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
```

## Деплой на Apache2

```bash
npm install
npm run build
sudo mkdir -p /var/www/museum
sudo rsync -a --delete dist/ /var/www/museum/
sudo a2enmod rewrite
sudo systemctl reload apache2
```

`.htaccess` для `/var/www/museum`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Деплой на IIS

1. Установите IIS URL Rewrite.
2. Выполните `npm install && npm run build`.
3. Разместите содержимое `dist/` в директории сайта.
4. Добавьте `web.config` рядом с `index.html`:

```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="SPA Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
      <mimeMap fileExtension=".avif" mimeType="image/avif" />
    </staticContent>
  </system.webServer>
</configuration>
```

## Рекомендации по дальнейшему развитию

1. Запросить экспорт WordPress/БД и импортировать все 873 карточки каталога.
2. Добавить поля `description`, `year`, `manufacturer`, `inventoryNumber`, `image` в карточки коллекции.
3. Подключить реальные фотографии, сгенерировать WebP/AVIF и lazy loading.
4. Добавить отдельные страницы экспонатов и QR-коды для витрин.
5. Подключить headless CMS: Decap CMS, Strapi, Directus или простую админку на ASP.NET/Node.
6. Добавить SEO/OpenGraph, sitemap.xml, robots.txt и метрики.
7. Подключить реальный виртуальный тур и видеоархив.
