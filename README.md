# Node TS JWT

---

## 🚀 Quick Installation

```bash
git clone https://github.com/cristiancosta/node-ts-jwt.git
cd node-ts-jwt
npm install
```

Then create a `.env` file in the project root with the following content:

```env
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=nodejwt
DB_PORT=3306

SERVER_PORT=8081

JWT_SECRET=mysecret
JWT_ACCESS_TOKEN_DURATION=2 hours
JWT_REFRESH_TOKEN_DURATION=2 days

SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=admin
```

Make sure you have a MySQL database up and running. In my case, I use Docker since it's the easiest way:

```bash
$ docker run -p 3306:3306 -e MYSQL_ROOT_USER=root -e MYSQL_ROOT_PASSWORD=root -d mysql
```

Log into the container and create the database:

```bash
$ docker exec -it <CONTAINER ID> mysql -uroot -proot
$ CREATE DATABASE nodejwt;
```

Start the server:

```bash
npm start
```

📍 The API will be available at: `http://localhost:8081`

---

## 📚 Interactive Documentation

You can explore and test all endpoints using Swagger UI:

🔗 [http://localhost:8081/api-docs/](http://localhost:8081/api-docs/)

Basic Auth required:

- **Username:** `admin`
- **Password:** `admin`

You can change Swagger credentials on `.env` file.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo.
2. Create a new branch.
3. Submit a Pull Request.
4. Make sure lint and tests pass.

📩 For direct contact: **cristiancosta1991@gmail.com**  
🌟 Found it useful? Give the project a ⭐ on GitHub!

[https://github.com/cristiancosta/node-ts-jwt](https://github.com/cristiancosta/node-ts-jwt)

---

## ☕ Donations

If you'd like to support this project, feel free to donate a coffee: [![Ko-Fi](https://img.shields.io/badge/Ko--fi-Donate-red?logo=ko-fi)](https://ko-fi.com/cristiancosta)

---

## 📝 License

MIT © [Cristian Costa](mailto:cristiancosta1991@gmail.com)
