variable "location" {
  type    = string
  default = "eastus2"
}

variable "deployment_prefix" {
  type        = string
  default     = ""
  description = "Prefix to use when deploying website. Used for DNS and resource names. Empty string is used for master deployments."
}
