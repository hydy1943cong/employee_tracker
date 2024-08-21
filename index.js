const express = require('express');
const { Pool } = require('pg');
const inquirer = require("inquirer");
const fs = require('fs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_db',
  password: 'password',
  port: 5432, 
});



const questions = [
    {
        type: 'list',
        message: ('What would you like to do?'),
        name: 'action',
        choices: ['View all departments','View all roles','View all employees','Add a department','Add a role','Add an employee','Update an employee role','View employees by department','View total utilized budget by department']
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
        case 'View employees by department':
          viewEmployeesByDepartment();
          break;
        case 'View total utilized budget by department': 
          viewBudgetByDepartment();
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
    const query = `SELECT e.role_id AS "ID", e.first_name AS "First Name", e.last_name AS "Last Name", role.title AS "Title",department.name AS "Department", role.salary AS "Salary", CASE WHEN e.manager_id IS NULL THEN NULL ELSE CONCAT(m.first_name,' ',m.last_name) END AS "Manager" FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id`;
    pool.query(query, (err, res) => {
        console.table(res.rows);
      init(); 
    });
  }

function addDepartment() {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'departmentName'
        }
    ])
    .then((answer) => {
        const query = 'INSERT INTO department (name) VALUES ($1)';
        pool.query(query, [answer.departmentName], (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`Added '${answer.departmentName}' to the database`);
            init();
        });
    })
    .catch((error) => {
        console.error(error);
    });
}

function addRole() {
  const getDepartmentsQuery = 'SELECT id, name FROM department';

  pool.query(getDepartmentsQuery, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    const departments = res.rows.map(department => ({
      name: department.name,
      value: department.id,
    }));

    inquirer.prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department does this role belong to?',
        choices: departments,
      }
    ]).then(answers => {
      const { roleName, salary, departmentId } = answers;
      const insertRoleQuery = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
      pool.query(insertRoleQuery, [roleName, salary, departmentId], (err, res) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Added ${roleName} to the database`);
          init();
        }
      });
    });
  });
}


function addEmployee() {
  pool.query('SELECT * FROM role', (err, roles) => {
    if (err) throw err;

    pool.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'first_name',
            type: 'input',
            message: 'What is the employee\'s first name?',
          },
          {
            name: 'last_name',
            type: 'input',
            message: 'What is the employee\'s last name?',
          },
          {
            name: 'role_id',
            type: 'list',
            message: 'What is the employee\'s role?',
            choices: roles.rows.map(role => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            name: 'manager_id',
            type: 'list',
            message: 'Who is the employee\'s manager?',
            choices: [
              { name: 'None', value: null },
              ...employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              })),
            ],
          },
        ])
        .then(answer => {
          const query = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ($1, $2, $3, $4)`;
          const values = [answer.first_name, answer.last_name, answer.role_id, answer.manager_id];

          pool.query(query, values, (err, res) => {
            if (err) throw err;
            console.log(`Added ${answer.first_name} ${answer.last_name} to the database`);
            init(); 
          });
        });
    });
  });
}


function updateEmployeeRole() {
  pool.query('SELECT * FROM employee', (err, employees) => {
    if (err) throw err;
    pool.query('SELECT * FROM role', (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'employee_id',
            type: 'list',
            message: 'Which employee\'s role do you want to update?',
            choices: employees.rows.map(employee => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: 'role_id',
            type: 'list',
            message: 'Which role do you want to assign the selected employee?',
            choices: roles.rows.map(role => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then(answer => {
          const query = `UPDATE employee SET role_id = $1 WHERE id = $2`;
          const values = [answer.role_id, answer.employee_id];

          pool.query(query, values, (err, res) => {
            if (err) throw err;
            console.log('Updated employee\'s role.');
            init(); // Go back to the main menu
          });
        });
    });
  });
}

function viewEmployeesByDepartment() {
  const query = 'SELECT * FROM department';

  pool.query(query, (err, res) => {
      if (err) {
          console.error(err);
          return;
      }

      const departments = res.rows.map(department => ({
          name: department.name,
          value: department.id
      }));

      inquirer.prompt([
          {
              type: 'list',
              name: 'departmentId',
              message: 'Which department do you want to view?',
              choices: departments
          }
      ])
      .then(answer => {
          const query = `
              SELECT e.id AS "ID", e.first_name AS "First Name", e.last_name AS "Last Name", 
                     role.title AS "Title", department.name AS "Department"
              FROM employee e
              LEFT JOIN role ON e.role_id = role.id
              LEFT JOIN department ON role.department_id = department.id
              WHERE department.id = $1
          `;

          pool.query(query, [answer.departmentId], (err, res) => {
              if (err) {
                  console.error(err);
                  return;
              }

              console.table(res.rows);
              init(); 
          });
      })
      .catch(error => {
          console.error(error);
      });
  });
}


function viewBudgetByDepartment() {
  const query = 'SELECT * FROM department';

  pool.query(query, (err, res) => {
      if (err) {
          console.error(err);
          return;
      }

      const departments = res.rows.map(department => ({
          name: department.name,
          value: department.id
      }));

      inquirer.prompt([
          {
              type: 'list',
              name: 'departmentId',
              message: 'Which department do you want to view its total utilized budget?',
              choices: departments
          }
      ])
      .then(answer => {
          const query = `
              SELECT department.name AS "Department", SUM(role.salary) AS "Total Utilized Budget"
              FROM employee e
              LEFT JOIN role ON e.role_id = role.id
              LEFT JOIN department ON role.department_id = department.id
              WHERE department.id = $1
              GROUP BY department.name
          `;

          pool.query(query, [answer.departmentId], (err, res) => {
              if (err) {
                  console.error(err);
                  return;
              }

              console.table(res.rows);
              init(); 
          });
      })
      .catch(error => {
          console.error(error);
      });
  });
}