provider "aws" {
  region = "eu-west-2"
}

provider "aws" {
  alias  = "acm_provider"
  region = "eu-west-2"
}

terraform {

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.10.0"
    }
  }
  backend "s3" {
    bucket = "hackathon-tfstate-errorforensic-2026"
    key    = "terraform.tfstate"
    region = "eu-west-2"
  }
}

data "aws_caller_identity" "current" {}