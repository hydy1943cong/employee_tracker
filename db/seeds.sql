INSERT INTO departments (name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');


INSERT INTO role (title, salary, department)
VALUES ('Sales Lead', 100000,'Sales'),
       ('Salesperson',80000, 'Sales'),
       ('Lead Engineer', 150000, 'Engineering'),
       ('Software Engineer',120000,'Engineering'),
       ('Account Manager',160000,'Finance'),
       ('Accountant',125000,'Finance'),
       ('Legal Team Lead',250000,'Legal'),
       ('Lawyer',190000,'Legal');

INSERT INTO employee (first_name, last_name, role_id,manager_id)
VALUES  ('John','Doe',1),
        ('Mike','Chan',2,1),
        ('Ashley','Rodriguez',3),
        ('Kevin','Tupik',4,3),
        ('Kunal','Singh',5),
        ('Malia','Brown',6,5),
        ('Sarah','Lourd',7),
        ('Tom','Allen',8,7)