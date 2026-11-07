export const WEBVIEW_HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Training form</title>
  </head>
  <body>
    <form id="web-form">
      <label for="web-name">Name</label>
      <input id="web-name" name="name" />
      <label for="web-email">Email</label>
      <input id="web-email" name="email" />
      <button id="web-submit" type="button">Send</button>
    </form>
    <p id="web-result"></p>
    <a id="web-link" href="#more">Open the in-page link</a>
    <div id="more">
      <p id="web-link-result"></p>
    </div>
    <script>
      document.getElementById('web-submit').addEventListener('click', function () {
        document.getElementById('web-result').textContent = 'Web form sent';
      });
      document.getElementById('web-link').addEventListener('click', function () {
        document.getElementById('web-link-result').textContent = 'Link opened';
      });
    </script>
  </body>
</html>
`;
