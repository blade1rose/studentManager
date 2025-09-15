pipeline {
    agent any
      tools {
      nodejs 'node'
    }
    environment {
        harborUser = 'admin'
        harborPasswd = 'Harbor12345'
        harborAddress = '192.168.157.136:80'
        harborRepo = 'repo'
    }

    stages {
        stage('拉取git仓库代码') {
            steps {
                checkout scmGit(branches: [[name: 'refs/tags/${tag}']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/blade1rose/studentmanager.git']])
            }
        }
        stage('通过Node构建项目') {
            steps {
                sh '''node -v
                npm install
                npm -v
                npm run build'''
            }
        }
        stage('通过docker制作自定义镜像') {
            steps {
                echo 'success'
            }
        }
        stage('将自定义镜像推送到Harbor') {
            steps {
                echo 'success'
            }
        }
        stage('将yml文件传到k8s-master上') {
            steps {
                echo 'success'
            }
        }
        stage('远程执行k8s-master的kubectl命令') {
            steps {
                echo 'success'
            }
        }
        stage('推送') {
            steps {
                 sshPublisher(
                               publishers: [
                               sshPublisherDesc(
                                configName: 'test',
                                transfers: [
                sshTransfer(
                    cleanRemote: false,
                    excludes: '',
                    execCommand: '',
                    execTimeout: 120000,
                    flatten: false,
                    makeEmptyDirs: false,
                    noDefaultExcludes: false,
                    patternSeparator: '[, ]+',
                    remoteDirectory: '/usr/local/test',
                    remoteDirectorySDF: false,
                    removePrefix: 'dist',
                    sourceFiles: 'dist/*'
                )
            ],
            usePromotionTimestamp: false,
            useWorkspaceInPromotion: false,
            verbose: false
        )
    ]
)

          }
      }
    }
}
