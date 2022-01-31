const fs = require("fs");
const Airtable = require("airtable");

async function build() {
  fs.rmSync(`${__dirname}/public`, { recursive: true, force: true });
  fs.mkdirSync(`${__dirname}/public`);

  const base = new Airtable({ apiKey: "keyPkPoUtgWqAzpDk" }).base(
    "appZ5aTo7tmAU7OdO"
  );

  base("Table 1")
    .select({ view: "Grid view" })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          console.log("Retrieved", record.get("Name"));
          const name = record.get("Name");
          const path = `${__dirname}/public/${name.toLowerCase()}.html`;
          fs.writeFileSync(
            path,
            `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Hello, ${name}!</p>
  </body>
</html>
`
          );
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
}

build();
