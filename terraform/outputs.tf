output "ec2_public_ip" { value = aws_instance.server.public_ip }
output "jenkins_url"   { value = "http://${aws_instance.server.public_ip}:8080" }
output "app_url"       { value = "http://${aws_instance.server.public_ip}:3000" }
output "grafana_url"   { value = "http://${aws_instance.server.public_ip}:3001" }
