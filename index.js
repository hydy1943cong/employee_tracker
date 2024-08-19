const express = require('express');
const { Pool } = require('pg');
const inquirer = require("inquirer");
const fs = require('fs');

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