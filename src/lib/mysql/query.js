import db from "./db.js";

export default function createPromise(sql) {
  // console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  }).catch((err) => {
    // console.log(err);
    throw new Error(err.sqlMessage);
  });
}
