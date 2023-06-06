const fs = require('fs');
const csv = require('csv-parser');

// Function to read the CSV file and return a promise with the parsed data
const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Function to calculate the average monthly salary for each department
const calculateAverageSalary = (employees, salaries) => {
  const departmentSalaries = {};

  employees.forEach((employee) => {
    const empId = employee.ID;
    const deptId = employee['DEPT ID'];
    const salaryData = salaries.find((salary) => salary.EMP_ID === empId);

    if (salaryData) {
      const monthlySalary = parseFloat(salaryData.AMOUNT);
      if (departmentSalaries.hasOwnProperty(deptId)) {
        departmentSalaries[deptId].totalSalary += monthlySalary;
        departmentSalaries[deptId].count += 1;
      } else {
        departmentSalaries[deptId] = {
          totalSalary: monthlySalary,
          count: 1,
        };
      }
    }
  });

  const departmentAverages = [];
  for (const deptId in departmentSalaries) {
    const department = departmentSalaries[deptId];
    const averageSalary = department.totalSalary / department.count;

    departmentAverages.push({
      DEPT_ID: deptId,
      AVG_MONTHLY_SALARY: averageSalary.toFixed(2),
    });
  }

  return departmentAverages;
};

// Function to fetch the top 3 departments based on average monthly salary
const fetchTopDepartments = (departmentAverages) => {
  return departmentAverages
    .sort((a, b) => b.AVG_MONTHLY_SALARY - a.AVG_MONTHLY_SALARY)
    .slice(0, 3);
};

// Main function to generate the report
const generateReport = async () => {
  try {
    const employees = await readCSV('employees.csv');
    const salaries = await readCSV('salaries.csv');

    const departmentAverages = calculateAverageSalary(employees, salaries);
    const topDepartments = fetchTopDepartments(departmentAverages);

    console.log('DEPT_NAME');
    console.log('AVG_MONTHLY_SALARY (USD)');
    topDepartments.forEach((department) => {
      console.log(department.DEPT_ID);
      console.log(department.AVG_MONTHLY_SALARY);
      console.log();
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Call the main function to generate the report
generateReport();
