const express = require('express');
const { Pool } = require('pg');
const inquirer = require("inquirer");
const fs = require('fs');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_db',
    password: 'jkl1234!',
    port: 5432, 
  });


const questions = [
    {
        type: 'list',
        message: ('What would you like to do?'),
        name: 'action',
        choices: ['View all departments','View all roles','View all employees','Add a department','Add a role','Add an employee','Update an employee role']
    }
]

function init() {
    inquirer
    .prompt(questions)
    .then((answers) => {
        console.log(answers);
        switch (answers.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
      }
    })
    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }
    });

}

// Function call to initialize app
init();

function viewAllDepartments() {
    const query = 'SELECT * FROM department';
    pool.query(query, (err, res) => {
        console.table(res.rows);
      init(); 
    });
  }

function viewAllRoles() {
    const query = 'SELECT * FROM role';
    pool.query(query, (err, res) => {
        console.table(res.rows);
      init(); 
    });
  }


function viewAllEmployees() {
    const query = 'SELECT employee.role_id AS "ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Title",department.name AS "Department", role.salary AS "Salary" FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id';
    pool.query(query, (err, res) => {
        console.table(res.rows);
      init(); 
    });
  }