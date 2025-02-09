# fyp-backend
MIND TRACK

uses prisma as ORM
database: Postgresql
language: typescript
validation: Yup
dates: moment
hashing: bcrypt
authentication: JWT through Passport
other: lodash

how to run:
npm i
npm i -g ts-node tsx 
npx prisma migrate dev --name init
tsx index.js