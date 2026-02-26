pipeline {
    agent any

    environment {
        BACKEND_IMAGE   = "expense-tracker-backend"
        FRONTEND_IMAGE  = "expense-tracker-frontend"
        DOCKER_HUB_USER = "your-dockerhub-username"
        APP_VERSION     = "${BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    stages {

        // ── Stage 1: Checkout ──────────────────────────────────────
        stage('Checkout') {
            steps {
                echo "Checking out source code from Git..."
                checkout scm
                sh 'git log --oneline -5'
            }
        }

        // ── Stage 2: Unit Tests ────────────────────────────────────
        stage('Unit Tests') {
            steps {
                echo "Running unit tests with Mockito..."
                dir('backend') {
                    sh 'mvn test -Dspring.profiles.active=test'
                }
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                    echo "JUnit test report published to Jenkins"
                }
                failure {
                    echo "Tests FAILED — pipeline stopped. Fix tests before proceeding."
                }
            }
        }

        // ── Stage 3: Build Backend ─────────────────────────────────
        stage('Build Backend JAR') {
            steps {
                echo "Building Spring Boot JAR with Maven..."
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                    sh 'ls -lh target/*.jar'
                }
                echo "Backend JAR created successfully"
            }
        }

        // ── Stage 4: Build Frontend ────────────────────────────────
        stage('Build Frontend') {
            steps {
                echo "Building React app with npm..."
                dir('frontend') {
                    sh 'npm ci --silent'
                    sh 'npm run build'
                    sh 'du -sh build/'
                }
                echo "React production build created"
            }
        }

        // ── Stage 5: Build Docker Images ───────────────────────────
        stage('Build Docker Images') {
            steps {
                echo "Building Docker images for backend and frontend..."
                sh "docker build -t ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:${APP_VERSION} ./backend/"
                sh "docker tag  ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:${APP_VERSION} ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest"
                sh "docker build -t ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${APP_VERSION} ./frontend/"
                sh "docker tag  ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${APP_VERSION} ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest"
                sh "docker images | grep expense-tracker"
                echo "Docker images built: version ${APP_VERSION}"
            }
        }

        // ── Stage 6: Push to Docker Hub ────────────────────────────
        stage('Push to Docker Hub') {
            steps {
                echo "Pushing images to Docker Hub..."
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:${APP_VERSION}"
                    sh "docker push ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest"
                    sh "docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${APP_VERSION}"
                    sh "docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest"
                }
                echo "Images pushed to Docker Hub successfully"
            }
        }

        // ── Stage 7: Deploy to EC2 ─────────────────────────────────
        stage('Deploy to EC2') {
            steps {
                echo "Deploying to AWS EC2 via SSH..."
                withCredentials([
                    string(credentialsId: 'ec2-host', variable: 'HOST'),
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'KEY')
                ]) {
                    sh '''
                        ssh -i $KEY -o StrictHostKeyChecking=no ubuntu@$HOST << REMOTE
                            cd /home/ubuntu/expense-tracker-cicd
                            git pull origin main
                            docker-compose pull backend frontend
                            docker-compose up -d --no-deps backend frontend
                            docker image prune -f
                            echo "Deployed successfully on EC2"
REMOTE
                    '''
                }
            }
        }

        // ── Stage 8: Health Check ──────────────────────────────────
        stage('Health Check') {
            steps {
                echo "Verifying deployment is healthy..."
                withCredentials([string(credentialsId: 'ec2-host', variable: 'HOST')]) {
                    retry(5) {
                        sleep(time: 10, unit: 'SECONDS')
                        sh 'curl -f http://$HOST:8080/actuator/health'
                    }
                }
                echo "Health check PASSED — app is live!"
            }
        }

    } // end stages

    post {
        success {
            echo """
            ============================================
             BUILD #${BUILD_NUMBER} — DEPLOYMENT SUCCESS
             Branch:  ${GIT_BRANCH}
             Version: ${BUILD_NUMBER}
            ============================================
            """
        }
        failure {
            echo """
            ============================================
             BUILD #${BUILD_NUMBER} — FAILED
             Check console output for details
            ============================================
            """
        }
        always {
            sh 'docker logout || true'
            cleanWs()
        }
    }
}
