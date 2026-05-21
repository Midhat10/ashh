import { VACANCIES } from "./src/mocks/vacancies.ts";

new Promise((resolve, reject) => {
  const randomNumber = Math.random();
  if (randomNumber > 0.1) {
    resolve(VACANCIES);
  } else {
    reject(new Error("Мы не получили данных"));
  }
})
  .then((data) => console.log(data))
  .catch((error) => console.log(error.message));

// console.log("Request data...");

// setTimeout(() => {
//   console.log("Prepariong data ...");

//   const backendData = {
//     server: "aws",
//     port: 2000,
//     status: "working",
//   };
//   setTimeout(() => {
//     backendData.modified = true;
//     console.log("Data received", backendData);
//   }, 2000);
// }, 2000);

// const p = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     console.log("Prepariong data ...");
//     const backendData = {
//       server: "aws",
//       port: 2000,
//       status: "working",
//     };
//     resolve(backendData);
//   }, 2000);
// })
//   .then((data) => {
//     const d = new Promise((resolve, reject) => {
//       setTimeout(() => {
//         data.modified = true;
//         resolve(data);
//       }, 2000);
//     });
//     return d;
//   })
//   .then((data2) => {
//     console.log("data received", data2);
//   });

// const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

// sleep(2000).then(() => console.log("After 2 sec"));
// sleep(3000).then(() => console.log("After 3 sec"));

// Promise.all([sleep(2000), sleep(5000)]).then(() => console.log("All Promises"));
// Promise.race([sleep(2000), sleep(5000)]).then(() =>
//   console.log("Race Promises"),
// );
