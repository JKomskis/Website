variable "location" {
  type    = string
  default = "eastus2"
}

variable "resource_group" {
  type        = string
  default     = "website-prod"
  description = "Resource group for website"
}

variable "resource_code" {
  type        = string
  default     = ""
  description = "Unique code for use in creating resources"
}
