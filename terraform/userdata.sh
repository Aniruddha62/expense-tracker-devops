#!/bin/bash
set -e
apt-get update -y
apt-get install -y git curl openjdk-17-jdk docker.io maven

# Docker Compose v2
curl -SL https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
usermod -aG docker ubuntu
systemctl start docker && systemctl enable docker

# Jenkins
curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian binary/" | tee /etc/apt/sources.list.d/jenkins.list > /dev/null
apt-get update -y && apt-get install -y jenkins
usermod -aG docker jenkins
systemctl start jenkins && systemctl enable jenkins

echo "Bootstrap complete! Jenkins running at port 8080."
