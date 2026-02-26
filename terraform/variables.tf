variable "aws_region"      { default = "us-east-1" }
variable "project_name"    { default = "expense-tracker" }
variable "instance_type"   { default = "t3.medium" }
variable "environment"     { default = "production" }
variable "my_ip"           { default = "0.0.0.0/0" }
variable "public_key_path" { default = "~/.ssh/id_rsa.pub" }
