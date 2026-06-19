import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: "oiki-604c0",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDt/uhDJgilPylj\nfbZJ1l+25rwh4pyTqT/YtZe1zRUpQdYFuZHxqlo2pGi05koyAZjrs8tW1/zB5GB9\nASsYsCX8pZT5L5EctTua1E0B5cdWZHnv0d1n9snekQvA09hN7JUK/KUc8JoUAS7K\nmwfFttpjE85f0C1S26aaKrWsxUf/1y8DBt56+nNTa2Ik1WnaRMa9XY3tHVXcYvqG\n0s10fbLYes+hLmq4vxAcPwJF7agRKk24nlNVkvUuYc+g8xBUMaft7d4GClSZx9Fp\nwP54Mc3OehJaSJK9xh95wlbJTLHQDl7KPB0aGcNtbyDzu4RGEi0QzoRssTbbpusz\n9kVovDaJAgMBAAECggEAAoOh3Su8BaWK1g6QQWwZVhZOldEOCbqiU7NqEd/ubEwn\navy7NPaxaJ2zWXiL/3E9i1KP6wVHGfPurQNj0ClJjXILsSzhIeYsO1t+IMSrpsGo\nTsdEc9e16ZBWCR3JItxFSs4WdHLPkzcxUQSdlWd0G9MsEp5hYYcJKzHDpOVEox2T\n8rFGgpIVCVEHAibLktub+zEVFmYHK/5cY7UYe/noC+sKNc/GYQ7Ak/gFqoMm+qcA\nEK27j+o4jm1obcceHBHBYclhpz/xFoXiux+fTYeUu1wNAxdsI4pKLq/UJ33ys+ch\nCgdDVbuu4lo2Xju1gSQKiW/VoaAPJBVYIrn+oPxu7QKBgQD/bUIHfamwOMpK3vXe\nRpvc7giMmyUelQjEhuv3LGFXD5VuXN/Mc1qDb2Qfx6lGPkFsPc8/zK1DOWp2Wxqh\ndkfbu5qnmG7OcoOdsdb2zpQfvj6WIEa1KeubrBj8nJPEOCR2VmUMqDDTQRxS7fNJ\nLrk/4yjLTOrWlXfqa7MGNYMizwKBgQDuh6KflPI/cZ+dbl+Vz90cDFHSDx9yT0pK\n7XsKo2vZcjdL/6jkth9Ktr1wSPcLAGX3KwO9gpF2D9lT53oPxLIqiFIv6KRlkMg8\ntm2CHx7gnqwArDoblqc4YVEJkh+G+jW7KOmqJR2WD5HEnRxDprzCO3AVBn+23pfv\nYI6rq93HJwKBgQC4b1IQSqKuhjM74Ma0W1PMMWym6pfg/0g3cB0Oe1NGJBCIgjNv\nU5P1+AbaE7ec6vMej3sI3Gf3dIv1Lk+Kavf0KADCJ4VLONDkmzdXO08lpJ9Yk7G6\nuqxP2fKo5P6l3swlTrjkbMXkpM0o7HyRSVWmVgZs1ft0OrU95cp9H0KzbQKBgCwV\nRSjZDixLg4RE8cVuNR8J59U6lkU6AjD20taUfUoiobWZ+kzKm93jB//IfF+8Ixwb\nBwXvK5L2OuQW06g2YfcaWpYgGMHskBUoYfS6a6p3qLI3IkYXAbCZy7BJISqA840z\ncnvPgDhLiFUd9CtMlXYQJha8rL3PRaUn4zY2/TXhAoGBAKlEGR6guv6Y8NEOjQxs\nzbacEzsabNYKOmSXce8QpiWD2EdieoGic6zJ+p+6ElgaOmE9x/dkLLu0ShdfuFyc\nayeYiUjQ5Zt6HxsyaDeSbcPUx5c4cQaH32Dvb5LpXoZzWxb8K/PZ6C9oETCIJIxJ\naP05cmOziqkYhuUR3/3Ku7xU\n-----END PRIVATE KEY-----\n",
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com",
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
