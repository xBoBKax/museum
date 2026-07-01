# Музей измерительных приборов — новый сайт без WordPress

Современная React/Vite-версия сайта `museum.eriskip.com`. Контент вынесен в `src/content/site.json`, поэтому тексты, навигацию, категории, новости и карточки коллекции можно редактировать без правки JSX-разметки.

## Запуск локально

```bash
npm install
npm run dev
```

Сборка production-версии:

```bash
npm run build
npm run preview
```

## Перенесенные разделы

- Главная / приветственный блок и виртуальный тур.
- История музея.
- О музее: площадь 330 кв. м, около 1500 экспонатов, образовательные активности.
- Уникальные экспонаты: 7 предметов с главной страницы.
- Коллекция: категории и первые 15 карточек каталога, найденные на текущем сайте.
- Новости: материал «Библиотека ЭРИС» от 08.05.2024.
- Образовательная деятельность и библиотека проектов.
- Контакты и ссылки ЭРИС/Vk.

## Улучшения

- Адаптивный интерфейс для ПК и телефонов.
- Sticky-навигация и мобильное меню.
- Поиск и фильтрация коллекции на клиенте.
- Карточная сетка экспонатов, быстрые CTA и раскрываемый блок истории.
- Чистая структура без WordPress-зависимостей.
- Контент-ориентированная архитектура через JSON.

## Что не удалось перенести автоматически

- Полный каталог из ~880 экспонатов: публичная страница отдает пагинированный WordPress/JetEngine-каталог, поэтому перенесена структура, категории и первые видимые позиции. Для полного переноса нужен экспорт из WordPress/БД или CSV.
- Оригинальные изображения не включены в репозиторий: вместо них используются дизайн-заглушки, чтобы не зависеть от WordPress-хранилища. После получения архива медиа их можно положить в `src/assets` и добавить пути в JSON.
- Реальный iframe/URL виртуального тура не был явно доступен в тексте страницы; блок подготовлен для подключения.

## Деплой

После `npm run build` статические файлы находятся в `dist/`.

### Nginx

```nginx
server {
    listen 80;
    server_name museum.example.com;
    root /var/www/museum/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache2

Включите `mod_rewrite`, скопируйте `dist/` в `/var/www/museum` и добавьте `.htaccess`:

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

### IIS

Установите URL Rewrite, разместите `dist/` как сайт и добавьте `web.config`:

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
  </system.webServer>
</configuration>
```

## Рекомендации по развитию

1. Получить экспорт WordPress/БД и автоматически заполнить полный каталог JSON/SQLite.
2. Добавить админку: Decap CMS, Strapi или простую ASP.NET/Node API-панель.
3. Подключить реальные фотографии экспонатов, WebP/AVIF и lazy loading.
4. Добавить страницы отдельных экспонатов с QR-кодами в экспозиции.
5. Подключить видео/панорамы виртуального тура.
6. Добавить многоязычность и метаданные SEO/OpenGraph.
