# Jenkins Setup Guide

## 1. Access Jenkins

After `terraform apply`, Jenkins is auto-installed on your EC2.

Access: `http://<EC2_IP>:8080`

Get admin password:
```bash
ssh -i your-key.pem ubuntu@<EC2_IP>
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

## 2. Install Plugins

Manage Jenkins → Plugins → Available → Install:

- **Git Plugin** — checkout source code
- **Pipeline** — Jenkinsfile support
- **Docker Pipeline** — build/push Docker images
- **SSH Agent** — SSH into EC2 for deployment
- **Credentials Binding** — securely inject secrets
- **JUnit** — publish test results
- **NodeJS Plugin** — run npm commands

---

## 3. Add Credentials

Manage Jenkins → Credentials → System → Global → Add Credential

| ID                       | Type                | Value                       |
|--------------------------|---------------------|-----------------------------|
| `docker-hub-credentials` | Username/Password   | Docker Hub login            |
| `ec2-host`               | Secret Text         | EC2 public IP               |
| `ec2-ssh-key`            | SSH private key     | Contents of your .pem file  |

---

## 4. Configure NodeJS Tool

Manage Jenkins → Tools → NodeJS installations → Add:
- Name: `NodeJS-20`
- Version: NodeJS 20.x

---

## 5. Create Pipeline Job

1. New Item → Pipeline → Name: `expense-tracker-cicd`
2. Under Pipeline section:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: your GitHub repo URL
   - Branch: `*/main`
   - Script Path: `jenkins/Jenkinsfile`
3. Enable: **GitHub hook trigger for GITScm polling**
4. Save → **Build Now**

---

## 6. Add GitHub Webhook (Auto-trigger on push)

GitHub repo → Settings → Webhooks → Add webhook:
- Payload URL: `http://<EC2_IP>:8080/github-webhook/`
- Content type: `application/json`
- Trigger: `Just the push event`

Now every `git push` to main triggers the full 8-stage pipeline automatically.

---

## Pipeline Stages Explained

```
[1] Checkout        Git pull latest code from branch
[2] Unit Tests      mvn test → JUnit report published in Jenkins UI
[3] Build JAR       mvn clean package → creates executable JAR
[4] Build Frontend  npm ci + npm run build → React production bundle
[5] Docker Build    2 images: backend (Spring Boot) + frontend (nginx)
[6] Docker Push     Both images pushed to Docker Hub with build number tag
[7] Deploy EC2      SSH into EC2 → docker-compose pull + up -d
[8] Health Check    curl /actuator/health → confirms app is live
```

Each stage is visible in the Jenkins Blue Ocean or classic UI with logs.
Failed stages automatically stop the pipeline and mark the build red.
