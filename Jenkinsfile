 pipeline {
     agent {
        label 'Asian_Champian_Testing'
    }
    environment {
        AWS_ACCOUNT_ID = credentials('ACCOUNT_ID')
        AWS_REGION = "ap-south-1"
        IMAGE_REPO_NAME = "aac_accredatation_frontend_uat"
        IMAGE_TAG = "latest"
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
        IMAGE_NAME = "${REPOSITORY_URI}:${IMAGE_TAG}"
    }

     
    stages {
    
         stage('Clean Workspace') {
        steps {
            cleanWs()
         }
        } 
        
        stage('Logging into AWS ECR') {
            steps {
                script {
                    // Log into AWS ECR
                    sh """aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${REPOSITORY_URI}"""
                }
            }
        }

        stage('Cloning Git') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/server_testing_env']],
                 doGenerateSubmoduleConfigurations: false, extensions: [],
                  submoduleCfg: [], userRemoteConfigs: [[credentialsId: '29395465-e2f8-4311-a945-c28c64cf7e94',
                   url: 'https://kamalchouhanassrm@bitbucket.org/HostAssrm/acc_accreditation_attendence_frontend.git']]])
            }
        }
     stage('Copy env file') {
            steps {
                withCredentials([file(credentialsId: 'ACCREDATATION_FRONTEND_UAT_ENV', variable: 'SECRET_ENV_FILE')]) {
                    sh 'cp $SECRET_ENV_FILE .env'
                }
            }
        }
        stage('Building Docker Image') {
            steps {
                script {
                   def dockerImage = docker.build("${IMAGE_REPO_NAME}:${IMAGE_TAG}")
        
                }
            }
        }

        // Push container to ECR
        stage('Pushing to ECR') {
            steps {
                script {
                    // Tag the Docker image
                    sh """docker tag ${IMAGE_REPO_NAME}:${IMAGE_TAG} ${REPOSITORY_URI}:${IMAGE_TAG}"""

                    // Push the Docker image to ECR
                    sh """docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${IMAGE_TAG}"""
                }
            }
        }
       stage("Remove Old Version") {
           steps {
              script {
          
               sh """docker rm -f ${IMAGE_REPO_NAME}|| TRUE"""
              }
          }
       }
        stage("Start Container") {
            steps {
                script {
                    sh """docker-compose up -d ${IMAGE_REPO_NAME} || { echo 'docker-compose failed'; exit 1; }"""
                }
            }
        }
    }
}