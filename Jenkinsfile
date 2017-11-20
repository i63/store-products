podTemplate(label: 's2i-demo',
  cloud: 'openshift',

  containers: [
    containerTemplate(name: 'mongo',privileged: false, image: 'mongo', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'nodejs',privileged: false, image: 'node:4.8.6-alpine', ttyEnabled: true, command: 'cat'),
  	containerTemplate(name: 's2i',privileged: true, image: 'debianmaster/s2i', ttyEnabled: true, command: 'cat'),
  	containerTemplate(name: 'docker',privileged: true, image: 'docker:1.11', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'k8s-cli',privileged: false, image: 'citools/k8s-cli', ttyEnabled: true, command: 'cat')
  ],

  volumes: [
      secretVolume(secretName: 'docker-reg', mountPath: '/home/jenkins'),
    	hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock'),
      emptyDirVolume(mountPath: '/data/db', memory: false)
    ]
  ) 

  {
  def image = "debianmaster/store-products:${BUILD_NUMBER}"
  node('s2i-demo') {

    git 'https://github.com/debianmaster/store-products'
    //checkout scm
    environment {
      mongo_url = "mongodb://root@127.0.0.1/store"
      MONGODB_ADMIN_PASSWORD = "password"
    }

    
    // unit testing
    stage('unit testing') {
      parallel(
        'Spinup Mongo': {
          container('mongo'){
            sh 'mongod'
          }
        },
        'Build and test': {
          container('nodejs'){
            sh 'npm install'
            sh 'mongo_url=mongodb://root@127.0.0.1/store npm test'
            sh 'killall -15 mongod'
          }
        }
      )
    }
    

    // containerization
    stage('Build - Docker image') {
      container('s2i') {
        //sh 'sleep 300'
        sh "s2i build . centos/nodejs-6-centos7 ${image}"
      }
      container('docker') {
        sh 'sleep 500'
      	sh "docker push ${image}"
      }
    }

    //deploy into dev 
    stage('Deploy to DEV') {

    }

    //deploy into dev 
    stage('Deploy to DEV') {
      container('k8s-cli') {
        sh 'kubectl set image deployment/products-api products-api=${image} --record'
      }
    }
    
    //deploy into prod
    stage('Deploy to PROD') {
      timeout(time:5, unit:'MINUTES') {
        input message: "Promote to PROD?", ok: "Promote"
      }
      container('k8s-cli') {
        sh 'kubectl set image deployment/products-api products-api=${image} --record'
      }
    }
    //notify
    post {
      failure {
        // notify users when the Pipeline fails
      }
      success {
        // notify users when the Pipeline succeeds
      }
    }

  }
}