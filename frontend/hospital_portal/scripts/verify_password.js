import bcrypt from 'bcryptjs';
const cases = [
  { p: 'R)@da_/-oU', h: '$2b$10$DKdBk1wji5Zm/Z4EYa853u9qTiWWamgXe8P1J0e/Vd7BWQ57tUbnO' }, // 001 Admin
  { p: 'Z.Zj>vU2', h: '$2b$10$WuWFb01nevo3Dn28EjLrBO7XLIBu9JflMej4bUxNJemKylMhLrn/.' }  // 059 Staff
];
cases.forEach((c, i) => {
  console.log(`Case ${i}:`, bcrypt.compareSync(c.p, c.h));
});
