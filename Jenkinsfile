// Assignment #1: Basic Declarative Pipeline
// Checkout -> Install Dependencies -> Run Tests -> Archive Artifacts

pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }

    post {
        success {
            echo 'Build succeeded — archiving artifacts (excluding node_modules)...'
            archiveArtifacts artifacts: 'dist/**/*', excludes: 'node_modules/**', fingerprint: true
        }
        failure {
            echo 'Build failed. Check console output for details.'
        }
    }
}
