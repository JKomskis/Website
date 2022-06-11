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

variable "storage_account_name" {
  type        = string
  default     = ""
  description = "Name of storage account created by frontend module"
}

variable "storage_account_connection_string" {
  type        = string
  default     = ""
  description = "Connection string of the storage account created by the frontend module"
}
