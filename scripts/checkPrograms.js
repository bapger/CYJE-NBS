const { exec } = require('child_process');

const checkPrograms = () => {
  return new Promise((resolve, reject) => {
    const programs = {
      mysql: 'mysqlsh.exe -V',
      python: 'py --version',
      vscode: 'code --version'
    };

    let results = {};

    const keys = Object.keys(programs);
    let completed = 0;

    keys.forEach(program => {
      exec(programs[program], (error, stdout, stderr) => {
        if (error) {
          results[program] = 'Non installé';
        } else {
          results[program] = stdout.trim();
        }

        completed++;
        if (completed === keys.length) {
          resolve(results);
        }
      });
    });
  });
};

module.exports = { checkPrograms };
