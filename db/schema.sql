DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;
\c employee_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
)

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  Foreign Key (department) REFERENCES department(id) INTEGER NOT NULL
)

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  Foreign Key (role_id) REFERENCES role(id) INTEGER NOT NULL,
  FOREIGN KEY (manager_id) REFERENCES employee(id) INTEGER
)
