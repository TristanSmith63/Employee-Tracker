const client = require('./connection');

// Query functions
const getAllDepartments = async () => {
  const res = await client.query('SELECT id AS "Department ID", name AS "Department Name" FROM departments');
  return res.rows;
};

const getAllRoles = async () => {
  const res = await client.query(`SELECT roles.id AS "Role ID", roles.title AS "Job Title", departments.name AS "Department", roles.salary AS "Salary"
                                  FROM roles
                                  JOIN departments ON roles.department_id = departments.id`);
  return res.rows;
};

const getAllEmployees = async () => {
  const res = await client.query(`SELECT employees.id AS "Employee ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS "Job Title", departments.name AS "Department", roles.salary AS "Salary", 
                                  COALESCE(manager.first_name || ' ' || manager.last_name, 'None') AS "Manager"
                                  FROM employees
                                  JOIN roles ON employees.role_id = roles.id
                                  JOIN departments ON roles.department_id = departments.id
                                  LEFT JOIN employees AS manager ON employees.manager_id = manager.id`);
  return res.rows;
};

const addDepartment = async (name) => {
  await client.query('INSERT INTO departments (name) VALUES ($1)', [name]);
};

const addRole = async (title, salary, department_id) => {
  await client.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
};

const addEmployee = async (first_name, last_name, role_id, manager_id) => {
  await client.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
};

const updateEmployeeRole = async (employee_id, role_id) => {
  await client.query('UPDATE employees SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
};

module.exports = {
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
