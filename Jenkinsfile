pipeline {
    agent any

    stages {
        /*stage('Non-Functional Tests') {
            steps {
                script {
                    // Execute non-functional tests
                    // Use JMeter or similar tool
                    def jmeterHome = "C:/Users/'Luis Serapicos'/Downloads/apache-jmeter-5.6.2/apache-jmeter-5.6.2/"  // Update this with the actual path
                    def jmeterCommand = "${jmeterHome}/bin/jmeter.bat"
                    
                    // Execute non-functional tests
                    sh "${jmeterCommand} -n -t HTTPRequest.jmx -l JMeterResults.jtl"
                }
            }
        }*/
        
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

                    // Execute non-functional tests
                    // Use JMeter or similar tool
                    def jmeterHome = "C:/Users/'Luis Serapicos'/Downloads/apache-jmeter-5.6.2/apache-jmeter-5.6.2/"  // Update this with the actual path
                    def jmeterCommand = "${jmeterHome}/bin/jmeter.bat"
                    
                    if(isWindows) {
                        bat 'npm run build' //Build the project
                        bat 'npm run setup:dev' // Setup the project in dev mode
                        bat 'start /B npm run start:both ' // Run back/front end
                        bat 'ping /n 180 localhost > nul && npm run test' // Run the tests //&& npm run testWithCoverage && npm run test:dev && npm run test:api
                        sh "${jmeterCommand} -n -t HTTPRequest.jmx -l JMeterResults.jtl"
                    }
                    else {
                        // Execute non-functional tests
                        // Use JMeter or similar tool
                        //def jmeterHome = "C:/Users/'Luis Serapicos'/Downloads/apache-jmeter-5.6.2/apache-jmeter-5.6.2/"  // Update this with the actual path
                        //def jmeterCommand = "${jmeterHome}/bin/jmeter.bat"
                        
                        sh 'npm run build' //Build the project
                        sh 'npm run setup:dev' // Setup the project in dev mode
                        sh 'nohup npm run start:both &' // Run back/front end
                        sh 'sleep 180 && npm run test && ${jmeterCommand} -n -t HTTPRequest.jmx -l JMeterResults.jtl' // Run the tests //&& npm run testWithCoverage && npm run test:dev && npm run test:api                     
                        // Execute non-functional tests
                        //sh "${jmeterCommand} -n -t HTTPRequest.jmx -l JMeterResults.jtl"
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
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: '', reportFiles: 'test-report.html', reportName: 'Jest Coverage Report', reportTitles: 'Test Report', useWrapperFileDirectly: true])
                                                                                                                                            //, coverage/index.html                                        //, Jest Coverage
                //archiveArtifacts 'coverage/index.html'
                archiveArtifacts 'test-report.html'

                //GitHub tag build_number_status
                def BUILD_STATUS = currentBuild.result == 'SUCCESS' ? 'Passed' : 'Failed'

                // Tag the repository
                def TAG = "Build#${BUILD_NUMBER}-${BUILD_STATUS}"
                sh "git tag -a ${TAG} -m 'Jenkins Build ${BUILD_NUMBER} ${BUILD_STATUS}'"
                sh "git push origin ${TAG}"

                // Publish non-functional test results
                perfReport 'JMeterResults.jtl'
                archiveArtifacts 'JMeterResults.jtl'
            }
        }
    }
}
