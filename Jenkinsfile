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
                        bat 'npm run setup:dev' // Setup the project in dev mode
                        bat 'nohup npm run start:both &'
                        bat 'sleep 180 && npm run test' // Run back/front end and after that run a test
                    }
                    else {
                        sh 'npm run setup:dev' // Setup the project in dev mode
                        sh 'nohup npm run start:both &'
                        sh 'sleep 180 && npm run test' // Run back/front end and after that run a test
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
            }
        }
    }
}
