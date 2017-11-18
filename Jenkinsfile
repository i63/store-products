podTemplate(label: 's2i-demo',
  cloud: 'openshift',
  containers: [
    containerTemplate(name: 'mongo',privileged: false, image: 'mongo', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'nodejs',privileged: false, image: 'node:4.8.6-alpine', ttyEnabled: true, command: 'cat'),
  	containerTemplate(name: 's2i',privileged: false, image: 'debianmaster/s2i', ttyEnabled: true, command: 'cat'),
  	containerTemplate(name: 'docker',privileged: false, image: 'docker:1.11', ttyEnabled: true, command: 'cat')
  ],
  volumes: [
    	hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock'),
      emptyDirVolume(mountPath: '/data/db', memory: false)
    ]
  ) {
  def image = "debianmaster/store-products"
  node('s2i-demo') {

    checkout scm
    environment {
      mongo_url = "mongodb://root@127.0.0.1/store"
      MONGODB_ADMIN_PASSWORD = "password"
    }

    stage('unit testing') {
      
      container('mongo'){
        sh 'nohup MONGODB_ADMIN_PASSWORD=password mongod &&'
      }
      container('nodejs'){
        sh 'npm install'
        sh 'mongo_url=mongodb://root@127.0.0.1/store npm test'
      }
    }

    stage('Build Docker image') {
      container('s2i') {
        sh "s2i build . centos/nodejs-6-centos7 ${image}"
      }
      container('docker') {
      	sh "docker login -u debianmaster -p mypass"
      	sh "docker push ${image}"
      }
    }

    post {
      failure {
        // notify users when the Pipeline fails
        
      }
    }

  }
}