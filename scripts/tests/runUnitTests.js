const { exec } = require('child_process');

const commandToRun = 'npm run test --testPathIgnorePatterns=api';

const child = exec(commandToRun);

// Listen for the command's standard output
child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

// Listen for the command's standard error
child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

// Listen for the command to exit
child.on('close', (code) => {
    console.log(`Command exited with code ${code}`);
});
