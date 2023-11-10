pipeline {
    agent any

    stages {              
        stage('Build') {
            steps {
                // Get some code from a GitHub repository
                git 'https://github.com/LuisSerapicos/ddd-forum-odsoft'
            }
        }
        
        stage('Set Up Docker Containers') {
            steps {
                script {
                    def isWindows = isUnix() ? false : true
                    if(isWindows) {
                        bat 'cp .env.template .env'
                        bat 'docker-compose up -d' // Start the Docker containers defined in docker-compose.yml
                    }
                    else {
                        sh 'cp .env.template .env'
                        sh 'docker-compose up -d' // Start the Docker containers defined in docker-compose.yml
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def isWindows = isUnix() ? false : true
                    if(isWindows) {
                        bat 'npm run build' //Build the project
                        bat 'npm run setup:dev' // Setup the project in dev mode
                        bat 'start /B npm run start:both ' // Run back/front end
                        bat 'timeout /t 180 > nul && npm run test' // Run a test
                        bat 'npm run testWithCoverage'
                        bat 'npm run test:dev'
                        bat 'npm run test:api'
                    }
                    else {
                        sh 'npm run build' //Build the project
                        sh 'npm run setup:dev' // Setup the project in dev mode
                        sh 'nohup npm run start:both &' // Run back/front end
                        sh 'sleep 180 && npm run test' // Run a test
                        sh 'npm run testWithCoverage'
                        sh 'npm run test:dev'
                        sh 'npm run test:api'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                def isWindows = isUnix() ? false : true
                if(isWindows) {
                    bat 'docker-compose down' // Stop and remove the Docker containers
                }
                else {
                     sh 'docker-compose down' // Stop and remove the Docker containers
                }

                // Publish HTML reports
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: './coverage/',
                    reportFiles: 'index.html'
                ])
            }
        }
    }
}
