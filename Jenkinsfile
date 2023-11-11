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
                        bat 'copy .env.template .env'
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
                        bat 'ping /n 180 localhost > nul && npm run test && npm run testWithCoverage && npm run test:dev && npm run test:api' // Run the tests
                    }
                    else {
                        sh 'npm run build' //Build the project
                        sh 'npm run setup:dev' // Setup the project in dev mode
                        sh 'nohup npm run start:both &' // Run back/front end
                        sh 'sleep 180 && npm run test && npm run testWithCoverage && npm run test:dev && npm run test:api' // Run the tests
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
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: '', reportFiles: 'test-report.html, coverage/index.html', reportName: 'Jest Coverage Report', reportTitles: 'Jest Coverage, Test Report', useWrapperFileDirectly: true])

                archiveArtifacts 'coverage/index.html'
                archiveArtifacts 'test-report.html'
            }
        }
    }
}
