podTemplate(label: 's2i-demo',
  cloud: 'openshift',
  containers: [
    containerTemplate(name: 'nodejs',privileged: false, image: 'node:4.8.6-alpine', ttyEnabled: true, command: 'cat'),
  	containerTemplate(name: 's2i',privileged: false, image: 'debianmaster/s2i', ttyEnabled: true, command: 'cat'),
  	containerTemplate(name: 'docker',privileged: false, image: 'docker:1.11', ttyEnabled: true, command: 'cat')
  ],
  volumes: [
    	hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock'),

    ]
  ) {
  def image = "debianmaster/store-products"
  node('s2i-demo') {

    stage('unit testing') {
      container('nodejs'){
        sh 'npm install'
        sh 'npm test'
      }
    }

    stage('Build Docker image') {
      checkout scm
      container('s2i') {
        sh "s2i build . centos/nodejs-6-centos7 ${image}"
      }
      container('docker') {
      	sh "docker login -u debianmaster -p mypass"
      	sh "docker push ${image}"
      }
    }
  }
}